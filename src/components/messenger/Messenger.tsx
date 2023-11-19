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
import { useTimeout } from "usehooks-ts";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { MessageRelayTypeId } from "../../hooks/messenger/codecs/MessageRelayCodec.ts";
import { SwapStatusTypeId } from "../../hooks/messenger/codecs/SwapStatusCodec.ts";
import useMessenger from "../../hooks/messenger/useMessenger.ts";
import { useConvoService } from "../../hooks/services/backend/useConvoService.ts";
import useStore from "../../hooks/store/useStore.ts";
import useWindowFocus from "../../hooks/useWindowFocus.ts";
import {
  getOfferCounterpart,
  getSwapCounterpart,
  isDisputed,
  isOfferCounterparty,
  isSwapCounterparty,
  isSwapDisputeExecuted,
  isSwapDraftee,
} from "../../libs/api_utils.ts";
import { isEqlStr } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { NotificationType } from "../../types/enums.ts";
import { AlwaysScrollToBottom } from "../AlwaysScrollToBottom.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { IdentityInitializer } from "./IdentityInitializer.tsx";
import { MessageItem } from "./MessageItem.tsx";
import { MessageItemSwapStatus } from "./MessageItemSwapStatus.tsx";
import { MessengerInputActions } from "./MessengerInputActions.tsx";
import { MuteMessenger } from "./MuteMessenger.tsx";
import { SendChatButton } from "./SendChatButton.tsx";
import { UnreadMessageCount } from "./UnreadMessageCount.tsx";
import { Message } from "./db.ts";

export type MessageStream = Promise<Stream<DecodedMessage>>;

async function streamEnderFunc(stream?: MessageStream) {
  if (stream != undefined) void (await stream).return();
}

export function Messenger({
  sheetMode,
  swap,
  offer,
}: {
  sheetMode: boolean;
  swap?: Swap;
  offer?: Offer;
}) {
  const {
    makeSwapConvoKey: makeSwapConversationKey,
    makeOfferConvoKey: makeOfferConvoKey,
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
    sendReadReceiptForMessage,
    sendSwapStatus,
    sendDeliveryReceipt,

    send,
  } = useMessenger();
  const { address, getChainInfo } = useConnectorContext();
  const scrollToBottomRef = createRef<HTMLDivElement>();
  const [textMsg, setTextMsg] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [readableConvosIds, setReadableConvoIds] = useState<string[]>([]);
  const [conversation, setConversation] = useState<Conversation | undefined>(
    undefined,
  );
  const [mediatorsConvo, setMediatorsConvo] = useState<Conversation[]>([]);
  const [countPartsConvo, setCountPartsConvo] = useState<Conversation[]>([]);
  const [lastMsgTime, setLastMsgTime] = useState<{ [key: string]: number }>({});
  const streams = useRef<{ [key: string]: MessageStream | undefined }>({});
  const streamEnders = useRef(streamEnderFunc);
  const user = useStore((state) => state.user);
  const { subscribeToConvosNotifications } = useConvoService();
  const [reveal, setReveal] = useState(false);
  const [pendingReadReceipts, setPendingReadReceipts] = useState<{
    [key: string]: DecodedMessage[];
  }>({});
  const windowFocus = useWindowFocus();

  useTimeout(() => {
    setReveal(true);
    scrollToBottomRef.current?.scrollIntoView();
  }, 3000);

  // As a swap/offer counterparty, create or get existing conversation with counterparty
  useEffect(() => {
    if (!client || !address) return;

    const createConvoWithCounterpart = async () => {
      if (!swap && !offer) return;

      let convoId = "";
      if (swap && !isSwapCounterparty(swap, address)) return;
      if (swap) convoId = makeSwapConversationKey(swap.network, swap.orderId);
      if (offer) convoId = makeOfferConvoKey(offer.network, offer.offerId);

      let conversation = (await client.conversations.list()).find((c) => {
        return convoId == c.context?.conversationId;
      });

      if (swap && !conversation) {
        const peerAddress = getSwapCounterpart(swap, client.address);
        conversation = await createConversation(client, peerAddress, convoId);
      }

      if (offer && !conversation) {
        const peerAddress = getOfferCounterpart(offer, client.address);
        conversation = await createConversation(client, peerAddress, convoId);
      }

      if (conversation) {
        setConversation(conversation);
        setReadableConvoIds(_.uniq([...readableConvosIds, convoId]));
      }

      // Subscribe to conversation topic to receive notifications
      if (user && conversation) {
        subscribeToConvosNotifications({
          net: getChainInfo().queryName,
          topics: [conversation.topic],
          peerAddresses: [conversation.peerAddress],
          orderId: swap ? swap.orderId : undefined,
          offerId: offer ? offer.offerId : undefined,
        });
      }
    };

    void createConvoWithCounterpart();
  }, [client, swap, offer, user]);

  // As a swap/offer counterparty, load messages from conversation with counterparty to DB
  useEffect(() => {
    if (!client || !conversation) return;
    void loadMessagesFromConvoToDB(client, conversation);
  }, [client, conversation]);

  // As a swap counterparty, relay counterparty's conversation to mediators' conversation
  useEffect(() => {
    if (!client || !conversation) return;
    if (mediatorsConvo.length == 0) return;
    relayConvoToConvos(client.address, conversation, mediatorsConvo);
  }, [client, conversation, swap?.disputes, mediatorsConvo]);

  // Creates a stream for a conversation
  const createStream = useCallback(
    async (
      conversation: Conversation,
      onCreated?: (stream: MessageStream) => void,
      onMessage?: (msg: DecodedMessage) => void,
      onError?: (err: unknown) => void,
    ) => {
      const convoId = getConvoId(conversation);
      if (streams.current[convoId]) return;

      // Create stream for conversation if not created
      let stream: MessageStream | undefined;
      if (streams.current[convoId] == undefined) {
        streams.current[convoId] = conversation.streamMessages();
        stream = streams.current[convoId];
        onCreated?.(stream as MessageStream);
      } else {
        return;
      }

      try {
        stream = streams.current[convoId];
        if (!stream) return;
        for await (const message of await stream) {
          onMessage?.(message);
        }
      } catch (e) {
        onError?.(e);
      }
    },
    [streams],
  );

  // As a swap/offer counterparty, process incoming messages from counterparty conversation.
  // For swaps, relay new message to mediators' conversation if in dispute.
  useEffect(() => {
    if (!conversation || !client) return;

    const streamsRef = streams.current;
    const convoId = getConvoId(conversation);
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
                [convoId]: (pendingReadReceipts[convoId] || []).concat(message),
              });
            }
          }

          // Relay message to conversation with mediators
          if (swap) {
            void relayMessageToConvos(
              client.address,
              conversation.peerAddress,
              mediatorsConvo,
              message,
            );
          }

          const msgTime = message.sent.getTime();
          setLastMsgTime({ ...lastMsgTime, [convoId]: msgTime / 1000 });
        },
        (err) => {
          console.error("counterparty conversation stream error:", err);
        },
      );
    };

    void createCounterpartyStream();

    return () => {
      void endStream(stream);
      delete streamsRef[convoId];
    };
  }, [conversation, client, mediatorsConvo, streams, windowFocus]);

  // Send read receipts for pending messages
  useEffect(() => {
    if (!windowFocus || !conversation) return;
    if (!client) return;

    const sendReadReceiptsForSwapCounterpart = async () => {
      const convoId = getConvoId(conversation);
      const pendingMsgs = pendingReadReceipts[convoId];
      if (!pendingMsgs || !pendingMsgs?.length) return;
      for (const msg of pendingMsgs) {
        await sendReadReceipt(client.address, msg, [conversation]);
      }
      delete pendingReadReceipts[convoId];
    };

    const sendReadReceiptsForMediators = async () => {
      for (const convo of mediatorsConvo) {
        const convoId = getConvoId(convo);
        const pendingMsgs = pendingReadReceipts[convoId];
        if (!pendingMsgs || !pendingMsgs?.length) continue;
        for (const msg of pendingMsgs) {
          await sendReadReceipt(client.address, msg, [convo]);
        }
        delete pendingReadReceipts[convoId];
      }
    };

    void sendReadReceiptsForSwapCounterpart();
    void sendReadReceiptsForMediators();
  }, [windowFocus, pendingReadReceipts]);

  // As a swap/offer counterparty or mediator, load messages from DB
  const messages = useLiveQuery(async () => {
    const messages = await getMessagesFromDB(readableConvosIds);
    scrollToBottomRef?.current?.scrollIntoView();
    return messages;
  }, [conversation, readableConvosIds, lastMsgTime]);

  // As a swap/offer counterparty or mediator, send read receipt for
  // latest unread message received when message is updated or window is focused
  useEffect(() => {
    if (!messages || !windowFocus) return;
    ensureLastMessageRead(messages);
  }, [messages, windowFocus]);

  // As a swap counterparty, create conversations with mediators (if in dispute)
  useEffect(() => {
    if (!client || !conversation || !swap || !isDisputed(swap)) return;
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

        // Subscribe to conversation topics to receive notifications
        if (user && convos.length) {
          subscribeToConvosNotifications({
            net: getChainInfo().queryName,
            topics: (convos || []).map((c) => c.topic),
            peerAddresses: (convos || []).map((c) => c.peerAddress),
            orderId: swap ? swap.orderId : undefined,
            offerId: offer ? offer.offerId : undefined,
          });
        }

        index++;
      }
    };

    void createConvoWithMediators();
  }, [client, conversation, swap, user]);

  // As a swap counterparty, load messages from mediators conversation to DB
  useEffect(() => {
    if (!client || !swap) return;

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
      const convoId = getConvoId(convo);

      const createConvoStream = async () => {
        await createStream(
          convo,
          (stream) => {
            convosId.push(convoId);
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
                [convoId]: (pendingReadReceipts[convoId] || []).concat(message),
              });
            }

            const msgTime = message.sent.getTime();
            setLastMsgTime({ ...lastMsgTime, [convoId]: msgTime / 1000 });
          },
          (err) => {
            console.error("mediator conversation stream error:", err);
          },
        );
      };

      void createConvoStream();
    }

    return () => {
      convosStream.forEach((stream) => void endStream(stream));
      convosId.forEach((convoId) => delete streamsRef[convoId]);
    };
  }, [mediatorsConvo, client, streams, pendingReadReceipts, windowFocus]);

  // As a mediator, create conversations with swap counterparties (if in dispute)
  useEffect(() => {
    if (!client || !swap || !isDisputed(swap)) return;
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
        _.uniq([...readableConvosIds, ...convos.map((c) => getConvoId(c))]),
      );

      // Subscribe to conversation topics to receive notifications
      if (user && convos.length) {
        subscribeToConvosNotifications({
          net: getChainInfo().queryName,
          topics: (convos || []).map((c) => c.topic),
          peerAddresses: (convos || []).map((c) => c.peerAddress),
          orderId: swap ? swap.orderId : undefined,
          offerId: offer ? offer.offerId : undefined,
        });
      }
    };

    void createConvoWithCounterparts(isSwapDisputeExecuted(swap));
  }, [swap, client, user]);

  // As a mediator, load messages from counterparties conversation to DB
  useEffect(() => {
    if (!client || !swap) return;

    const loadMsgsFromCounterparts = async () => {
      for (const convo of countPartsConvo) {
        await loadMessagesFromConvoToDB(client, convo).catch(console.error);
      }
    };

    void loadMsgsFromCounterparts();
  }, [client, countPartsConvo]);

  // As a mediator, process incoming messages from counterparties
  useEffect(() => {
    if (!countPartsConvo.length || !client || !swap) return;

    const streamsRef = streams.current;
    const convosStream: MessageStream[] = [];
    const endStream = streamEnders.current;
    const convosId: string[] = [];

    for (const convo of countPartsConvo) {
      const convoId = getConvoId(convo);
      const createConvoStream = async () => {
        await createStream(
          convo,
          (stream) => {
            convosId.push(convoId);
            convosStream.push(stream);
          },
          async (message) => {
            // Process and store message
            await processMessage(client, convo.peerAddress, message, true);

            const msgTime = message.sent.getTime();
            setLastMsgTime({ ...lastMsgTime, [convoId]: msgTime / 1000 });
          },
          (err) => {
            console.error("counterpart conversation stream error:", err);
          },
        );
      };
      void createConvoStream();
    }

    return () => {
      convosStream.forEach((stream) => void endStream(stream));
      convosId.forEach((convoId) => delete streamsRef[convoId]);
    };
  }, [client, countPartsConvo]);

  // As a swap counterpart, send swap status for dispute commencement
  // in swap counterparty conversation
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
        conversation,
      );
    };

    void sendDisputeStartedNotice();
  }, [conversation, swap?.disputes]);

  // As a swap counterpart, send swap status for dispute conclusion to
  // counterparty conversation
  useEffect(() => {
    if (!conversation) return;
    if (!swap || !isSwapCounterparty(swap, address)) return;
    if (!isSwapDisputeExecuted(swap)) return;

    const sendDisputeEndedNotice = async () => {
      const dispId = swap.disputes[0].disputeId;
      await sendSwapStatus(
        `dispute-ended-${dispId}`,
        `Dispute #${dispId} has concluded`,
        conversation,
      );
    };

    void sendDisputeEndedNotice();
  }, [conversation, swap?.disputes]);

  // As a mediator, send swap status for dispute commencement to
  // counterparts conversations
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
          convo,
        );
      }
    };

    void sendDisputeStartedNotice();
  }, [countPartsConvo, swap?.disputes, address]);

  // Send read receipt for latest unread message received
  async function ensureLastMessageRead(messages: Message[]) {
    if (!windowFocus || !client) return;
    const lastMsg = messages.length ? messages[messages.length - 1] : undefined;
    if (!lastMsg || lastMsg.status == "read") return;
    if (isEqlStr(lastMsg.from, address)) return;
    sendReadReceiptForMessage(client, lastMsg);
  }

  async function handleSendMsg(msg: string) {
    if (!client || !msg) return;

    if (
      (swap && isSwapCounterparty(swap, address)) ||
      (offer && isOfferCounterparty(offer, address))
    ) {
      if (!conversation) return;
      await send(client, conversation, msg);
      setLastMsgTime({
        ...lastMsgTime,
        [getConvoId(conversation)]: moment().unix(),
      });
    }

    if (swap && isDisputed(swap) && isSwapDraftee(swap, address, true)) {
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

  async function handleMsgResend(id: number, content: unknown) {
    if (!client) return;
    await removeMessageById(id as number);
    await handleSendMsg(content as string);
  }

  // Decide whether to disable send elements
  function disableSend() {
    if (!client) return true;
    if (swap) {
      return (
        !isSwapCounterparty(swap, address) &&
        (!isSwapDraftee(swap, address, true) || isSwapDisputeExecuted(swap))
      );
    }
    if (offer) {
      return !isOfferCounterparty(offer, address);
    }
    return false;
  }

  // Decide whether to show input actions
  function canHideShowActions() {
    return conversation || countPartsConvo.length > 0;
  }

  return (
    <div className="relative h-full">
      {!reveal && (
        <div className="absolute flex justify-center items-center z-10 w-full h-full bg-card-background rounded-xl">
          <IconSpinner
            width="20"
            fill="fill-gray-600"
            className="animate-spin"
          />
        </div>
      )}
      <div
        className={cn(
          "absolute overflow-hidden flex flex-col text-gray-200 w-full h-full bg-card-background",
          { "rounded-xl border-card-border/30 border": !sheetMode },
        )}
      >
        <div
          className={cn(
            "flex gap-2 items-center justify-between select-none p-3 py-3 border-card-border/50 bg-card-background border-b text-xl drop-shadow-3xl",
            { "pr-10": sheetMode },
          )}
        >
          <span className="flex items-center gap-1 tracking-wider">
            <span>Chat</span>
            {(!!swap?.orderId || !!offer?.offerId) && (
              <UnreadMessageCount
                orderId={swap?.orderId}
                offerId={offer?.offerId}
                type={NotificationType.TypeChatNotification}
                disableUnmark
              />
            )}
          </span>
          <span className="top-0.5 relative">
            <MuteMessenger
              convos={[
                ...(conversation ? [conversation] : []),
                ...mediatorsConvo,
                ...countPartsConvo,
              ]}
            />
          </span>
        </div>
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
                  client &&
                  swap &&
                  isSwapCounterparty(swap, address) && (
                    <div className="text-gray-300 m-2 rounded-xl p-3 text-xs tracking-wider bg-gray-800 font-light border border-chinese-green/10">
                      Need clarification or want to ask for or share information
                      with your swap partner?
                      <br />
                      <span className="text-chinese-green">Send a message</span>
                    </div>
                  )}

                {messages?.length == 0 &&
                  client &&
                  swap &&
                  !isSwapCounterparty(swap, address) && (
                    <div className="text-gray-300 m-2 rounded-xl p-3 text-xs tracking-wider bg-gray-800 font-light border border-chinese-green/10">
                      As a mediator, you can help solve disputes by requesting
                      for useful evidence or information.
                      <br />
                      <span className="text-chinese-green">Send a message</span>
                    </div>
                  )}

                {messages?.length == 0 &&
                  client &&
                  offer &&
                  isEqlStr(offer.creator, address) && (
                    <div className="text-gray-300 m-2 rounded-xl p-3 text-xs tracking-wider bg-gray-800 font-light border border-chinese-green/10">
                      Start a conversation with the liquidity provider to
                      discuss the terms and details of your offer.
                      <br />
                      <span className="text-chinese-green">Send a message</span>
                    </div>
                  )}

                {messages?.length == 0 &&
                  client &&
                  offer &&
                  isEqlStr(offer.provider, address) && (
                    <div className="text-gray-300 m-2 rounded-xl p-3 text-xs tracking-wider bg-gray-800 font-light border border-chinese-green/10">
                      Start a conversation with the offer creator to discuss the
                      terms and details of the offer.
                      <br />
                      <span className="text-chinese-green">Send a message</span>
                    </div>
                  )}

                <div className="px-3 flex flex-col gap-3 py-3">
                  {address &&
                    client &&
                    (swap || offer) &&
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
                                id={msg.id as number}
                                from={msg.from}
                                content={msg.content}
                                contentType={msg.contentType}
                                readers={msg.readers || []}
                                msgId={msg.msgId}
                                sentAt={msg.sentAt}
                                status={msg.status}
                                offer={offer}
                                swap={swap}
                                onResend={(id: number, content: unknown) => {
                                  void handleMsgResend(id, content);
                                }}
                              />
                            )}

                            {isEqlStr(msg.from, address) && (
                              <MessageItem
                                id={msg.id as number}
                                from={msg.from}
                                content={msg.content}
                                contentType={msg.contentType}
                                readers={msg.readers || []}
                                msgId={msg.msgId}
                                sentAt={msg.sentAt}
                                status={msg.status}
                                swap={swap}
                                onResend={(id: number, content: unknown) => {
                                  void handleMsgResend(id, content);
                                }}
                              />
                            )}
                          </>
                        )}
                        {[SwapStatusTypeId].includes(
                          msg.contentType?.typeId as string,
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
              "flex shrink-0 p-2 pb-0 px-0 gap-2 items-center border-t border-gray-800 bg-card-background",
              { "rounded-b-xl": !sheetMode },
            )}
          >
            <div className="w-full">
              <div className="flex items-end">
                <div className="flex-1 shrink-0">
                  <TextareaAutosize
                    className="w-full px-3 font-light text-gray-200 tracking-wide bg-card-background outline-none resize-none"
                    placeholder="Write a message"
                    maxRows={3}
                    disabled={disableSend()}
                    value={textMsg}
                    onChange={(e) => {
                      setTextMsg(e.currentTarget.value);
                      scrollToBottomRef?.current?.scrollIntoView();
                    }}
                    onKeyDown={(e) => {
                      // Detect enter as long as shift is not pressed
                      if (e.key == "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMsg(e.currentTarget.value).catch(
                          console.error,
                        );
                        setTextMsg("");
                      }
                    }}
                  />
                </div>
                {!(client && swap && canHideShowActions()) && (
                  <div>
                    <SendChatButton
                      className="!top-0 -left-1.5"
                      disabled={!textMsg}
                      onSend={() => {
                        handleSendMsg(textMsg).catch(console.error);
                        setTextMsg("");
                      }}
                    />
                  </div>
                )}
              </div>
              {client && swap && canHideShowActions() && (
                <MessengerInputActions
                  disabled={disableSend()}
                  disableSendButton={!textMsg}
                  swap={swap}
                  client={client}
                  convos={[...countPartsConvo.concat(conversation || [])]}
                  onFileUpload={() => {
                    scrollToBottomRef?.current?.scrollIntoView();
                  }}
                  onSend={() => {
                    handleSendMsg(textMsg).catch(console.error);
                    setTextMsg("");
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
