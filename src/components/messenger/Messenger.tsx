import { Label } from "../ui/label.tsx";
import { IconPlus } from "../icons/IconPlus.tsx";
import { Input } from "../ui/Input.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { cn } from "../../libs/utils.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { Upload } from "lucide-react";
import { IdentityInitializer } from "./IdentityInitializer.tsx";
import { Client, Conversation, DecodedMessage, Stream } from "@xmtp/xmtp-js";
import { useCallback, useEffect, useRef, useState } from "react";
import useMessenger from "../../hooks/messager/useMessenger.ts";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useLiveQuery } from "dexie-react-hooks";
import { isEqlStr } from "../../libs/helpers.ts";
import { MessageItem } from "./MessageItem.tsx";
import { AlwaysScrollToBottom } from "../AlwaysScrollToBottom.tsx";
import {
  isDisputed,
  isSwapCounterparty,
  isSwapDisputeExecuted,
  isSwapDraftee,
} from "../../libs/api_utils.ts";
import _ from "lodash";
import moment from "moment";
import { Message } from "./db.ts";

export type MessageStream = Promise<Stream<DecodedMessage>>;

async function streamEnderFunc(stream?: MessageStream) {
  if (stream != undefined) void (await stream).return();
}

export function Messenger({
  sheetMode,
  swap,
}: {
  sheetMode: boolean;
  swap: Swap;
}) {
  const {
    makeSwapConversationKey,
    createConversation,
    loadMessagesToDB,
    processMessage,
    getMessagesFromDB,
    createOrGetConvoWithMediator,
    createConversationsWithCounterparts,
    relayMessageToConvos,
    getConvoId,
    removeMessageById,
    send,
  } = useMessenger();
  const { address } = useConnectorContext();
  const [client, setClient] = useState<Client | null>(null);
  const [readableConvosIds, setReadableConvoIds] = useState<string[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [mediatorsConvo, setMediatorsConvo] = useState<Conversation[]>([]);
  const [countPartsConvo, setCountPartsConvo] = useState<Conversation[]>([]);
  const [lastMsgTime, setLastMsgTime] = useState<{ [key: string]: number }>({});
  const streams = useRef<{ [key: string]: MessageStream | undefined }>({});
  const streamEnders = useRef(streamEnderFunc);

  // As a swap counterparty, create or get existing conversation with counterparty
  useEffect(() => {
    if (!client || !swap || !isSwapCounterparty(swap, address)) return;

    const createConvoWithCounterpart = async () => {
      let conversation = (await client.conversations.list()).find((c) => {
        const convId = c.context?.conversationId;
        return convId == makeSwapConversationKey(swap.network, swap.orderId);
      });

      if (!conversation) conversation = await createConversation(client, swap);
      setConversation(conversation);
      setReadableConvoIds(
        _.uniq([...readableConvosIds, getConvoId(conversation)])
      );
    };

    void createConvoWithCounterpart();
  }, [client, swap]);

  // As a swap counterparty, load messages from conversation with counterparty to DB
  useEffect(() => {
    if (!client || !conversation) return;
    void loadMessagesToDB(client, conversation);
  }, [client, conversation]);

  // Creates a stream for a conversation
  const createStream = useCallback(
    async (
      conversation: Conversation,
      onCreated?: (stream: MessageStream) => void,
      onMessage?: (msg: DecodedMessage) => void,
      onError?: (err: unknown) => void
    ) => {
      const convId = getConvoId(conversation);
      if (streams.current[convId]) return;

      // Create stream for conversation if not created
      let stream: MessageStream | undefined;
      if (streams.current[convId] == undefined) {
        streams.current[convId] = conversation.streamMessages();
        stream = streams.current[convId];
        onCreated?.(stream as MessageStream);
      } else {
        return;
      }

      try {
        stream = streams.current[convId];
        if (!stream) return;
        for await (const message of await stream) {
          onMessage?.(message);
        }
      } catch (e) {
        onError?.(e);
      }
    },
    []
  );

  // As a swap counterparty, process incoming messages for counterparty conversation.
  // Relay new message to mediators' conversation if in dispute.
  useEffect(() => {
    if (!conversation || !client) return;

    const streamsRef = streams.current;
    const convId = getConvoId(conversation);
    let stream: MessageStream | undefined;
    const endStream = streamEnders.current;

    const createCounterpartyStream = async () => {
      await createStream(
        conversation,
        (s) => (stream = s),
        async (message) => {
          const { peerAddress } = conversation;
          message.recipientAddress = peerAddress;
          await processMessage(client.address, peerAddress, message);
          await relayMessageToConvos(
            client.address,
            peerAddress,
            mediatorsConvo,
            message
          );
          const msgTime = message.sent.getTime();
          setLastMsgTime({ ...lastMsgTime, [convId]: msgTime / 1000 });
        },
        (err) => {
          console.error("counterparty conversation stream error:", err);
        }
      );
    };

    void createCounterpartyStream();

    return () => {
      void endStream(stream);
      delete streamsRef[convId];
    };
  }, [conversation, client, streams, mediatorsConvo]);

  // As a swap counterparty or mediator, load messages from DB
  const messages = useLiveQuery(async () => {
    return getMessagesFromDB(readableConvosIds);
  }, [conversation, readableConvosIds, lastMsgTime]);

  // As a swap counterparty, create conversations with mediators (if in dispute)
  useEffect(() => {
    if (!client || !conversation || !isDisputed(swap)) return;
    if (!isSwapCounterparty(swap, address)) return;

    const createConvoWithMediators = async () => {
      let index = 0;
      const updReadableConvosIds = [...readableConvosIds];
      for (const dispute of swap.disputes) {
        const convos = await createOrGetConvoWithMediator(client, dispute);

        // If latest dispute has not been executed, store reference to the mediator's conversation.
        if (index == 0) {
          const disputeExecuted = isSwapDisputeExecuted(swap);
          setMediatorsConvo(!disputeExecuted ? convos : []);
        }

        // Add conversations to the readable list to allow them to be read from DB.
        updReadableConvosIds.push(...convos.map((c) => getConvoId(c)));
        setReadableConvoIds(_.uniq(updReadableConvosIds));

        index++;
      }
    };

    void createConvoWithMediators();
  }, [client, conversation, swap]);

  // As a swap counterparty, load messages from mediators conversation to DB
  useEffect(() => {
    if (!client) return;

    const loadMsgFromMediators = async () => {
      for (const convo of mediatorsConvo) {
        void (await loadMessagesToDB(client, convo, true));
      }
    };

    void loadMsgFromMediators();
  }, [client, mediatorsConvo]);

  // As a swap counterparty, process incoming messages from mediators
  useEffect(() => {
    if (!mediatorsConvo.length || !client) return;

    const streamsRef = streams.current;
    const convosStream: MessageStream[] = [];
    const endStream = streamEnders.current;
    const convosId: string[] = [];

    for (const convo of mediatorsConvo) {
      const convId = getConvoId(convo);
      const createConvoStream = async () => {
        await createStream(
          convo,
          (stream) => {
            convosId.push(convId);
            convosStream.push(stream);
          },
          async (message) => {
            await processMessage(
              client.address,
              convo.peerAddress,
              message,
              true
            );
            const msgTime = message.sent.getTime();
            setLastMsgTime({ ...lastMsgTime, [convId]: msgTime / 1000 });
          },
          (err) => {
            console.error("mediator conversation stream error:", err);
          }
        );
      };
      void createConvoStream();
    }

    return () => {
      convosStream.forEach((stream) => void endStream(stream));
      convosId.forEach((convId) => delete streamsRef[convId]);
    };
  }, [mediatorsConvo, client, streams]);

  // As a mediator, create conversations with swap counterparties (if in dispute)
  useEffect(() => {
    if (!client || !isDisputed(swap)) return;
    if (isSwapCounterparty(swap, address)) return;

    const createConvoWithCounterparts = async (disputeExecuted = false) => {
      const convos = await createConversationsWithCounterparts(client, swap);

      // If dispute is not executed, store references to the counterparties' conversations.
      setCountPartsConvo(!disputeExecuted ? convos : []);

      // Add conversations to the readable list to allow them to be read from DB.
      setReadableConvoIds(
        _.uniq([...readableConvosIds, ...convos.map((c) => getConvoId(c))])
      );
    };

    void createConvoWithCounterparts(isSwapDisputeExecuted(swap));
  }, [swap, client]);

  // As a mediator, load messages from counterparties conversation to DB
  useEffect(() => {
    if (!client) return;

    const loadMsgsFromCounterparts = async () => {
      for (const convo of countPartsConvo) {
        await loadMessagesToDB(client, convo).catch(console.error);
      }
    };

    void loadMsgsFromCounterparts();
  }, [client, countPartsConvo]);

  // As a mediator, process incoming messages from counterparties
  useEffect(() => {
    if (!countPartsConvo.length || !client) return;

    const streamsRef = streams.current;
    const convosStream: MessageStream[] = [];
    const endStream = streamEnders.current;
    const convosId: string[] = [];

    for (const convo of countPartsConvo) {
      const convId = getConvoId(convo);
      const createConvoStream = async () => {
        await createStream(
          convo,
          (stream) => {
            convosId.push(convId);
            convosStream.push(stream);
          },
          async (message) => {
            message.recipientAddress = convo.peerAddress;
            const { peerAddress } = convo;
            await processMessage(client.address, peerAddress, message, true);
            const msgTime = message.sent.getTime();
            setLastMsgTime({ ...lastMsgTime, [convId]: msgTime / 1000 });
          },
          (err) => {
            console.error("counterpart conversation stream error:", err);
          }
        );
      };
      void createConvoStream();
    }

    return () => {
      convosStream.forEach((stream) => void endStream(stream));
      convosId.forEach((convId) => delete streamsRef[convId]);
    };
  }, [client, countPartsConvo]);

  // Post notice of dispute execution in swap counterparty conversation
  useEffect(() => {
    if (!swap || !isSwapCounterparty(swap, address)) return;
    if (!isSwapDisputeExecuted(swap)) return;
  }, [swap]);

  async function handleSendMsg(msg: string) {
    if (!client) return;

    if (isSwapCounterparty(swap, address)) {
      if (!conversation) return;
      await send(client, conversation, msg);
      setLastMsgTime({
        ...lastMsgTime,
        [getConvoId(conversation)]: moment().unix(),
      });
    }

    if (isSwapDraftee(swap, address, true)) {
      for (const convo of countPartsConvo) {
        await send(client, convo, msg);
        setLastMsgTime({
          ...lastMsgTime,
          [getConvoId(convo)]: moment().unix(),
        });
      }
    }
  }

  async function handleMsgResend(msg: Message) {
    if (!client) return;
    await removeMessageById(msg.id as number);
    await handleSendMsg(msg.content);
  }

  // Decide whether to disable send elements
  function disableSend() {
    return (
      !client ||
      (!isSwapCounterparty(swap, address) &&
        !isSwapDraftee(swap, address, true))
    );
  }

  return (
    <div className="relative h-full">
      <div
        className={cn(
          "absolute overflow-hidden flex flex-col text-gray-200 w-full h-full bg-card-background",
          { "rounded-xl border-card-border border": !sheetMode }
        )}
      >
        <Label
          className={cn(
            "flex gap-2 items-center select-none p-3 py-3 border-card-border bg-card-background border-b text-xl drop-shadow-3xl",
            { "justify-between gap-0": !sheetMode }
          )}
        >
          <span className="tracking-wider">Chat</span>
          <span>
            <span className="rounded-full h-[20px] min-w-[20px] px-[5px] leading-[20px] flex justify-center items-center  bg-red-600 text-[10px]">
              60
            </span>
          </span>
        </Label>
        <div className="flex max-h-full  justify-between flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-hidden bg-chat ">
            <ScrollOverflowIndicator side="bottom" className="h-full">
              <ScrollArea
                type="scroll"
                className="h-full"
                viewportClassName="[&>div]:h-full"
              >
                {!client && (
                  <IdentityInitializer
                    onInitialized={(client) => {
                      setClient(client);
                    }}
                  />
                )}

                {messages?.length == 0 &&
                  !!client &&
                  isSwapCounterparty(swap, address) && (
                    <div className="text-gray-300 m-2 rounded-xl p-3 text-xs tracking-wider bg-gray-800 font-light border border-chinese-green/10">
                      Need clarification or want to ask for or share information
                      with your swap partner?
                      <br />
                      <span className="text-chinese-green">Send a message</span>
                    </div>
                  )}

                {messages?.length == 0 &&
                  !!client &&
                  !isSwapCounterparty(swap, address) && (
                    <div className="text-gray-300 m-2 rounded-xl p-3 text-xs tracking-wider bg-gray-800 font-light border border-chinese-green/10">
                      As a mediator, you can help solve disputes by requesting
                      for useful evidence or information.
                      <br />
                      <span className="text-chinese-green">Send a message</span>
                    </div>
                  )}

                <div className="px-3 flex flex-col gap-3 py-3">
                  {address &&
                    client &&
                    messages?.map((msg, i) => (
                      <div key={i}>
                        {!isEqlStr(msg.from || "", address) && (
                          <MessageItem
                            msg={msg}
                            swap={swap}
                            onResend={(msg) => {
                              void handleMsgResend(msg);
                            }}
                          />
                        )}
                        {isEqlStr(msg.from, address) && (
                          <MessageItem
                            msg={msg}
                            swap={swap}
                            onResend={(msg) => {
                              void handleMsgResend(msg);
                            }}
                          />
                        )}
                      </div>
                    ))}
                  <AlwaysScrollToBottom />
                </div>
              </ScrollArea>
            </ScrollOverflowIndicator>
          </div>
          <div
            className={cn(
              "flex shrink-0 p-2 gap-2 items-center border-t border-gray-700 bg-gray-800",
              { "rounded-b-xl": !sheetMode }
            )}
          >
            <div className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger disabled={disableSend()}>
                  <div
                    className={cn(
                      "rounded-full p-[2px] cursor-not-allowed transition-all duration-300",
                      {
                        "hover:bg-chinese-green hover:text-black cursor-pointer":
                          !disableSend(),
                      }
                    )}
                  >
                    <IconPlus width="20" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card-background border-card-border text-gray-300 p-0">
                  <DropdownMenuItem className="flex gap-2">
                    <Upload width="15" />
                    <span>Upload File</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-1">
              <Input
                type="text"
                variant="default"
                rounded="full"
                className="px-3"
                disabled={disableSend()}
                placeholder="Type a message"
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    handleSendMsg(e.currentTarget.value).catch(console.error);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
