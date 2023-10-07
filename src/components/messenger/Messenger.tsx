import { ContentTypeRemoteAttachment } from "@xmtp/content-type-remote-attachment";
import {
  Client,
  ContentTypeText,
  Conversation,
  DecodedMessage,
  Stream,
} from "@xmtp/xmtp-js";
import { useLiveQuery } from "dexie-react-hooks";
import _ from "lodash";
import moment from "moment";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { MessageRelayTypeId } from "../../hooks/messenger/codecs/MessageRelayCodec.ts";
import { SwapStatusTypeId } from "../../hooks/messenger/codecs/SwapStatusCodec.ts";
import useMessenger from "../../hooks/messenger/useMessenger.ts";
import useWindowFocus from "../../hooks/useWindowFocus.ts";
import {
  isDisputed,
  isSwapCounterparty,
  isSwapDisputeExecuted,
  isSwapDraftee,
} from "../../libs/api_utils.ts";
import { isEqlStr } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { AlwaysScrollToBottom } from "../AlwaysScrollToBottom.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { Label } from "../ui/label.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { IdentityInitializer } from "./IdentityInitializer.tsx";
import { MessageItem } from "./MessageItem.tsx";
import { MessageItemSwapStatus } from "./MessageItemSwapStatus.tsx";
import { MessengerInputActions } from "./MessengerInputActions.tsx";
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
    loadMessagesFromConvoToDB,
    processMessage,
    getMessagesFromDB,
    createOrGetConvoWithMediator,
    createConversationsWithCounterparts,
    relayMessageToConvos,
    relayConvoToConvos,
    getConvoId,
    removeMessageById,
    sendReadReceipt,
    sendSwapStatus,
    sendDeliveryReceipt,

    send,
  } = useMessenger();
  const { address } = useConnectorContext();
  const scrollToBottomRef = createRef<HTMLDivElement>();
  const [client, setClient] = useState<Client | null>(null);
  const [readableConvosIds, setReadableConvoIds] = useState<string[]>([]);
  const [conversation, setConversation] = useState<Conversation | undefined>(
    undefined
  );
  const [mediatorsConvo, setMediatorsConvo] = useState<Conversation[]>([]);
  const [countPartsConvo, setCountPartsConvo] = useState<Conversation[]>([]);
  const [lastMsgTime, setLastMsgTime] = useState<{ [key: string]: number }>({});
  const streams = useRef<{ [key: string]: MessageStream | undefined }>({});
  const streamEnders = useRef(streamEnderFunc);
  const [pendingReadReceipts, setPendingReadReceipts] = useState<{
    [key: string]: DecodedMessage[];
  }>({});
  const windowFocus = useWindowFocus();

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
    void loadMessagesFromConvoToDB(client, conversation);
  }, [client, conversation]);

  // As a swap counterparty, relay counterparty's conversation to mediators' conversation
  useEffect(() => {
    if (!client || !conversation) return;
    if (mediatorsConvo.length == 0) return;
    relayConvoToConvos(client.address, conversation, mediatorsConvo);
  }, [client, conversation, swap.disputes, mediatorsConvo]);

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
    [streams]
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
      return createStream(
        conversation,
        async (s) => {
          stream = s;
        },
        async (message: DecodedMessage) => {
          const { peerAddress } = conversation;

          // Ignore messages from self
          if (message.senderAddress != client.address) {
            // Process and store message
            const msgCopy = { ...message } as DecodedMessage;
            await processMessage(client, peerAddress, msgCopy);

            // Send delivery receipt
            void sendDeliveryReceipt(client.address, message, [conversation]);

            // Send read receipt on window focus
            if (windowFocus) {
              void sendReadReceipt(client.address, message, [conversation]);
            } else {
              setPendingReadReceipts({
                ...pendingReadReceipts,
                [convId]: (pendingReadReceipts[convId] || []).concat(message),
              });
            }
          }

          // Relay message to conversation with mediators
          void relayMessageToConvos(
            client.address,
            conversation.peerAddress,
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
  }, [conversation, client, mediatorsConvo, streams, windowFocus]);

  // Send read receipts for pending messages
  useEffect(() => {
    if (!windowFocus || !conversation) return;
    if (!client) return;

    const sendReadReceiptsForSwapCounterpart = async () => {
      const convId = getConvoId(conversation);
      const pendingMsgs = pendingReadReceipts[convId];
      if (!pendingMsgs || !pendingMsgs?.length) return;
      for (const msg of pendingMsgs) {
        await sendReadReceipt(client.address, msg, [conversation]);
      }
      delete pendingReadReceipts[convId];
    };

    const sendReadReceiptsForMediators = async () => {
      for (const convo of mediatorsConvo) {
        const convId = getConvoId(convo);
        const pendingMsgs = pendingReadReceipts[convId];
        if (!pendingMsgs || !pendingMsgs?.length) continue;
        for (const msg of pendingMsgs) {
          await sendReadReceipt(client.address, msg, [convo]);
        }
        delete pendingReadReceipts[convId];
      }
    };

    void sendReadReceiptsForSwapCounterpart();
    void sendReadReceiptsForMediators();
  }, [windowFocus, pendingReadReceipts]);

  // As a swap counterparty or mediator, load messages from DB
  const messages = useLiveQuery(async () => {
    const messages = getMessagesFromDB(readableConvosIds);
    scrollToBottomRef?.current?.scrollIntoView();
    return messages;
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
        void (await loadMessagesFromConvoToDB(client, convo, true));
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
            const { address } = client;
            const { peerAddress } = convo;

            await processMessage(client, peerAddress, message, true);

            void sendDeliveryReceipt(address, message, [convo]);

            if (windowFocus) {
              void sendReadReceipt(client.address, message, [convo]);
            } else {
              setPendingReadReceipts({
                ...pendingReadReceipts,
                [convId]: (pendingReadReceipts[convId] || []).concat(message),
              });
            }

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
  }, [mediatorsConvo, client, streams, pendingReadReceipts, windowFocus]);

  // As a mediator, create conversations with swap counterparties (if in dispute)
  useEffect(() => {
    if (!client || !isDisputed(swap)) return;
    if (isSwapCounterparty(swap, address)) return;

    const createConvoWithCounterparts = async (disputeExecuted = false) => {
      const convos = await createConversationsWithCounterparts(client, swap);

      // If dispute is not executed, store references to the counterparties' conversations.
      // If dispute is executed, clear references to the counterparties' conversations.
      if (!disputeExecuted) {
        setCountPartsConvo(convos);
      } else {
        // Delay clearing the conversations to allow incoming messages to be processed.
        setTimeout(() => {
          setCountPartsConvo([]);
        }, 3000);
      }

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
        await loadMessagesFromConvoToDB(client, convo).catch(console.error);
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
            // Process and store message
            await processMessage(client, convo.peerAddress, message, true);

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

  // As a swap counterpart, send swap status for dispute commencement in swap counterparty conversation
  useEffect(() => {
    if (!conversation) return;
    if (!swap || !isSwapCounterparty(swap, address)) return;
    if (!isDisputed(swap)) return;
    if (isSwapDisputeExecuted(swap)) return;

    const sendDisputeStartedNotice = async () => {
      const dispId = swap.disputes[0].disputeId;
      await sendSwapStatus(
        `dispute-start-${dispId}`,
        `Dispute #${dispId} has started`,
        conversation
      );
    };

    void sendDisputeStartedNotice();
  }, [conversation, swap.disputes]);

  // As a swap counterpart, send swap status for dispute conclusion to counterparty conversation
  useEffect(() => {
    if (!conversation) return;
    if (!swap || !isSwapCounterparty(swap, address)) return;
    if (!isSwapDisputeExecuted(swap)) return;

    const sendDisputeEndedNotice = async () => {
      const dispId = swap.disputes[0].disputeId;
      await sendSwapStatus(
        `dispute-ended-${dispId}`,
        `Dispute #${dispId} has concluded`,
        conversation
      );
    };

    void sendDisputeEndedNotice();
  }, [conversation, swap.disputes]);

  // As a mediator, send swap status for dispute commencement to counterparts conversations
  useEffect(() => {
    if (!countPartsConvo.length) return;
    if (!swap || isSwapCounterparty(swap, address)) return;
    if (!isDisputed(swap)) return;
    if (isSwapDisputeExecuted(swap)) return;

    const sendDisputeStartedNotice = async () => {
      for (const convo of countPartsConvo) {
        const dispId = swap.disputes[0].disputeId;
        await sendSwapStatus(
          `dispute-start-${dispId}`,
          `Dispute #${dispId} has started`,
          convo
        );
      }
    };

    void sendDisputeStartedNotice();
  }, [countPartsConvo, swap.disputes]);

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

    if (isDisputed(swap) && isSwapDraftee(swap, address, true)) {
      const now = moment();
      for (const convo of countPartsConvo) {
        void send(client, convo, msg, now.toDate(), true).then(() => {
          setLastMsgTime({
            ...lastMsgTime,
            [getConvoId(convo)]: moment().unix(),
          });
        });
      }
    }
  }

  async function handleMsgResend(msg: Message) {
    if (!client) return;
    await removeMessageById(msg.id as number);
    await handleSendMsg(msg.content as string);
  }

  // Decide whether to disable send elements
  function disableSend() {
    return (
      !client ||
      (!isSwapCounterparty(swap, address) &&
        (!isSwapDraftee(swap, address, true) || isSwapDisputeExecuted(swap)))
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
                        {[
                          ContentTypeText.typeId,
                          ContentTypeRemoteAttachment.typeId,
                          MessageRelayTypeId,
                        ].includes(msg.contentType?.typeId as string) && (
                          <>
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
                          </>
                        )}
                        {[SwapStatusTypeId].includes(
                          msg.contentType?.typeId as string
                        ) && <MessageItemSwapStatus msg={msg} />}
                      </div>
                    ))}
                  <AlwaysScrollToBottom scrollRef={scrollToBottomRef} />
                </div>
              </ScrollArea>
            </ScrollOverflowIndicator>
          </div>
          <div
            className={cn(
              "flex shrink-0 p-2 px-0 gap-2 items-center border-t border-gray-700 bg-card-background",
              { "rounded-b-xl": !sheetMode }
            )}
          >
            <div className="w-full">
              <TextareaAutosize
                className="w-full mt-1 px-3 font-light text-gray-200 tracking-wide bg-card-background outline-none resize-none"
                placeholder="Write a message"
                maxRows={3}
                disabled={disableSend()}
                onChange={() => {
                  scrollToBottomRef?.current?.scrollIntoView();
                }}
                onKeyDown={(e) => {
                  // Detect enter as long as shift is not pressed
                  if (e.key == "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMsg(e.currentTarget.value).catch(console.error);
                    e.currentTarget.value = "";
                  }
                }}
              />
              {client && (conversation || countPartsConvo.length > 0) && (
                <MessengerInputActions
                  disabled={disableSend()}
                  swap={swap}
                  client={client}
                  convos={[...countPartsConvo.concat(conversation || [])]}
                  onFileUpload={() => {
                    scrollToBottomRef?.current?.scrollIntoView();
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
