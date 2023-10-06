import {
  Client,
  ContentTypeId,
  ContentTypeText,
  Conversation,
  DecodedMessage,
} from "@xmtp/xmtp-js";
import { getSwapCounterpart } from "../../libs/api_utils.ts";
import db, { ContentType, Message } from "../../components/messenger/db.ts";
import moment from "moment";
import { isDev, isEqlStr, sha1 } from "../../libs/helpers.ts";
import { randomBytes } from "ethers/lib.esm/utils";
import {
  ContentTypeMessageRelay,
  isMessageRelayType,
} from "./codecs/MessageRelayCodec.ts";
import {
  isRemoteAttachmentType,
  isTextType,
  JointAuthorityId,
} from "./codecs/common.ts";
import {
  ContentTypeSwapStatus,
  isSwapStatusType,
  SwapStatusTypeId,
} from "./codecs/SwapStatusCodec.ts";
import {
  ContentTypeDeliveryReceipt,
  isDeliveryReceipt,
} from "./codecs/DeliveryReceiptCodec.ts";
import {
  ContentTypeReadReceipt,
  isReadReceipt,
} from "./codecs/ReadReceiptCodec.ts";
import {
  RemoteAttachmentCodec,
  RemoteAttachment,
  ContentTypeRemoteAttachment,
  Attachment,
} from "@xmtp/content-type-remote-attachment";

export default function useMessenger() {
  const version = "159";

  /**
   * Make a key for storing the keys
   * @param env The environment to save the keys for
   * @param address The address to save the keys for
   */
  function makeStorageKey(env: string, address: string) {
    return `messenger_key:${env}:${address}`;
  }

  /**
   * Save the keys to local storage
   * @param env The environment to save the keys for
   * @param address The address to save the keys for
   * @param keys The keys to save
   */
  function saveKeys(env: string, address: string, keys: Uint8Array) {
    const key = makeStorageKey(env, address);
    localStorage.setItem(key, Buffer.from(keys).toString("hex"));
  }

  /**
   * Load the keys from local storage
   * @param env The environment to load the keys for
   * @param address The address to load the keys for
   */
  function loadKeys(env: string, address: string) {
    const keys = localStorage.getItem(makeStorageKey(env, address));
    if (!keys) return;
    return Buffer.from(keys, "hex").valueOf();
  }

  /**
   * Make a key for referencing a swap conversation
   * @param network The network where the swap order was created
   * @param orderId The id of the swap order
   */
  function makeSwapConversationKey(network: string, orderId: number) {
    return `swap_conversation_${version}:${network}:${orderId}`;
  }

  /**
   * Make a key for referencing a swap conversation with a draftee
   * @param network The network where the swap order was created
   * @param orderId The id of the swap order
   * @param draftee The draftee address
   * @param address The address of the swapper
   */
  function makeSwapConversationKeyWithDraftee(
    network: string,
    orderId: number,
    draftee: string,
    address: string
  ) {
    return `mediation_msgs_${version}:${network}:${orderId}:${address.toLowerCase()}:${draftee.toLowerCase()}`;
  }

  /**
   * Make a key for referencing a mediator's conversation with a swap counterparty
   * @param network The network where the swap order was created
   * @param orderId The id of the swap order
   * @param counterparty The counterparty address
   * @param mediator The mediator address
   */
  function makeSwapConversationKeyWithCounterparty(
    network: string,
    orderId: number,
    counterparty: string,
    mediator: string
  ) {
    return `mediation_msgs_${version}:${network}:${orderId}:${counterparty.toLowerCase()}:${mediator.toLowerCase()}`;
  }

  /**
   * Create a conversation for a swap
   * @param client The XMTP client
   * @param swap The swap order
   */
  function createConversation(
    client: Client,
    swap: Swap
  ): Promise<Conversation> {
    return client.conversations.newConversation(
      getSwapCounterpart(swap, client.address),
      {
        conversationId: makeSwapConversationKey(swap.network, swap.orderId),
        metadata: {},
      }
    );
  }

  /**
   * Create conversations for each dispute draftees.
   * If a draftee is not on XMPT, it will not create a conversation.
   * If client address is a counterparty, it will not create a conversation.
   * @param client The XMTP client
   * @param dispute The dispute object
   */
  async function createOrGetConvoWithMediator(
    client: Client,
    dispute: Dispute
  ) {
    const conversations: Conversation[] = [];
    const seen: { [key: string]: boolean } = {};
    for (const draftee of dispute.draftees) {
      if (seen[draftee.owner]) continue;
      if (isEqlStr(draftee.owner, client.address)) continue;
      if (!(await client.canMessage(draftee.owner))) continue;
      seen[draftee.owner] = true;
      conversations.push(
        await client.conversations.newConversation(draftee.owner, {
          conversationId: makeSwapConversationKeyWithDraftee(
            dispute.network,
            dispute.orderId,
            draftee.owner,
            client.address
          ),
          metadata: {},
        })
      );
    }
    return conversations;
  }

  /**
   * Create conversations for each swap counterparties.
   * If a counterparty is not on XMPT, it will not create a conversation.
   * If client address is a counterparty, it will not create a conversation.
   * @param client The XMTP client
   * @param swap
   */
  async function createConversationsWithCounterparts(
    client: Client,
    swap: Swap
  ) {
    const conversations: Conversation[] = [];
    const seen: { [key: string]: boolean } = {};
    for (const addr of [swap.provider, swap.taker]) {
      if (seen[addr]) continue;
      if (isEqlStr(addr, client.address)) continue;
      if (!(await client.canMessage(addr))) continue;
      seen[addr] = true;
      conversations.push(
        await client.conversations.newConversation(addr, {
          conversationId: makeSwapConversationKeyWithCounterparty(
            swap.network,
            swap.orderId,
            addr,
            client.address
          ),
          metadata: {},
        })
      );
    }
    return conversations;
  }

  /**
   * Create a prepared message
   * @param conversation The conversation to send the message to
   * @param msg The message to send
   * @param timestamp The timestamp of the message
   * @param contentType The content type of the message
   */
  async function createPreparedMessage(
    conversation: Conversation,
    msg: unknown,
    timestamp?: Date,
    contentType?: ContentTypeId
  ) {
    return conversation.prepareMessage(msg, {
      contentType,
      timestamp: timestamp || new Date(),
    });
  }

  /**
   * Load messages from a conversation into the database
   * @param client The XMTP client
   * @param conversation The conversation to load messages from
   * @param ignoreOwnMessages Ignore own messages
   */
  async function loadMessagesFromConvoToDB(
    client: Client,
    conversation: Conversation,
    ignoreOwnMessages = false
  ) {
    if (!conversation) return;

    const lastMsg = await db.messages
      .where("conversationId")
      .equals(getConvoId(conversation))
      .limit(1)
      .reverse()
      .sortBy("sentAt");

    const messages = await conversation.messages({
      startTime: lastMsg.length
        ? moment.unix(lastMsg[0].sentAt).toDate()
        : undefined,
    });

    const { peerAddress } = conversation;
    for (const msg of messages) {
      await processMessage(client, peerAddress, msg, ignoreOwnMessages);
    }
  }

  /**
   * Get the content hash of a message
   * @param msg The message to get the content hash from
   * @param convoId The conversation id (optional)
   */
  function getContentHash(
    msg: {
      contentType?: ContentType;
      content: unknown;
      sentAt?: number;
      sent?: Date;
    },
    convoId?: string
  ) {
    const parts: unknown[] = [];

    // Add conversation ID if provided
    if (convoId) parts.push(convoId);

    // Add sent time. If message is a swap status, don't add sent time
    let sentTime = (msg.sentAt || moment(msg.sent).unix()).toString();
    const { contentType } = msg;
    const skipSentTimeList = [SwapStatusTypeId];
    if (contentType && skipSentTimeList.includes(contentType.typeId))
      sentTime = "";
    if (sentTime) parts.push(sentTime);

    // Add content
    parts.push(JSON.stringify(msg.content));

    return sha1(parts.join(":"));
  }

  /**
   * Process a message and save it to the database
   * @param client The XMTP client
   * @param peerAddress The peer address
   * @param msg The message to process
   * @param ignoreOwnMessages Ignore own messages
   */
  async function processMessage(
    client: Client,
    peerAddress: string,
    msg: DecodedMessage,
    ignoreOwnMessages = false
  ) {
    msg.recipientAddress = peerAddress;

    let dbMsg: Message | null = null;
    if (ignoreOwnMessages && isEqlStr(msg.senderAddress, client.address))
      return;

    // For message delivery receipt, update message status only, don't save to DB
    if (isDeliveryReceipt(msg.contentType)) {
      await db.messages
        .where("sentAt")
        .belowOrEqual(moment(msg.sent).unix())
        .and((q) => {
          return q.status != "read";
        })
        .modify((q) => {
          if (q.receivers?.includes(msg.senderAddress.toLowerCase())) return;
          q.status = "delivered";
          q.receivers = (q.readers || []).concat(
            msg.senderAddress.toLowerCase()
          );
        });
      return;
    }

    // For message read receipt, update message status only, don't save to DB
    if (isReadReceipt(msg.contentType)) {
      await db.messages
        .where("sentAt")
        .belowOrEqual(moment(msg.sent).unix())
        .modify((q) => {
          if (q.readers?.includes(msg.senderAddress.toLowerCase())) return;
          q.status = "read";
          q.readers = (q.readers || []).concat(msg.senderAddress.toLowerCase());
        });
      return;
    }

    // For remote attachment, load attachment and save to DB.
    // For message relay with remote attachment, load attachment and save to DB
    if (
      isRemoteAttachmentType(msg.contentType) ||
      (isMessageRelayType(msg.contentType) &&
        isRemoteAttachmentType(msg.content.originalContentType))
    ) {
      const content = !isMessageRelayType(msg.contentType)
        ? msg.content
        : msg.content.content;

      const attachment = await RemoteAttachmentCodec.load<Attachment>(
        content,
        client
      );

      msg.content = {
        type: attachment.mimeType,
        data: Buffer.from(attachment.data).toString("base64"),
      };

      dbMsg = processDecodedMessage(client.address, peerAddress, msg);
    }

    // Ignore existing message
    const existing = await db.messages
      .where("contentHash")
      .equals(getContentHash(msg))
      .first();
    if (existing) {
      return;
    }

    try {
      dbMsg = !dbMsg
        ? processDecodedMessage(client.address, peerAddress, msg)
        : dbMsg;
      await db.messages.add(dbMsg);
    } catch (e) {
      handleMessageAddError(e);
    }
  }

  /**
   * Process decoded message
   * @param clientAddress The client address
   * @param peerAddress The peer address
   * @param decoded The decoded message
   */
  function processDecodedMessage(
    clientAddress: string,
    peerAddress: string,
    decoded: DecodedMessage
  ): Message {
    const { id, conversation } = decoded;
    let contentType: ContentType = {
      authorityId: decoded.contentType.authorityId,
      typeId: decoded.contentType.typeId,
      versionMajor: decoded.contentType.versionMajor,
      versionMinor: decoded.contentType.versionMinor,
    };
    let { content, senderAddress, sent } = decoded;
    let to = "";
    const contentHash = getContentHash(decoded);

    if (
      isMessageRelayType(decoded.contentType) &&
      isTextType(decoded.content.originalContentType)
    ) {
      content = decoded.content.content;
      senderAddress = decoded.content.from;
      to = decoded.content.to;
      sent = moment.unix(decoded.content.sentAt).toDate();
      contentType = decoded.content.originalContentType;
    }

    if (decoded.contentType.sameAs(ContentTypeText)) {
      to = isEqlStr(senderAddress, clientAddress) ? peerAddress : clientAddress;
    }

    return {
      conversationId: conversation?.context?.conversationId || "",
      from: senderAddress,
      to,
      sentAt: moment(sent).unix(),
      receivedAt: moment().unix(),
      msgId: id,
      content,
      contentHash: contentHash,
      contentType,
    };
  }

  /**
   * Get messages from the database
   * @param convoIds The conversation ids to get messages from
   */
  async function getMessagesFromDB(convoIds: string[]) {
    const messages = await db.messages
      .where("conversationId")
      .anyOf(convoIds)
      .sortBy("sentAt");
    return uniqifyMessages(messages);
  }

  /**
   * Returns a new array of messages with unique messages
   * @param messages The messages to filter
   */
  function uniqifyMessages(messages: Message[]) {
    const msgHash: { [key: string]: boolean } = {};
    const uniqueMessages: Message[] = [];
    for (const msg of messages) {
      if (msgHash[msg.contentHash]) continue;
      msgHash[msg.contentHash] = true;
      uniqueMessages.push(msg);
    }
    return uniqueMessages;
  }

  /**
   * Copy a message from one conversation to another
   * @param clientAddress The client address
   * @param peerAddress The peer address
   * @param conversations The conversations to copy message to
   * @param message The message to copy
   */
  async function relayMessageToConvos(
    clientAddress: string,
    peerAddress: string,
    conversations: Conversation[],
    message: DecodedMessage
  ) {
    for (const conversation of conversations) {
      const decMsg = processDecodedMessage(clientAddress, peerAddress, message);
      const contentHash = getContentHash(decMsg, getConvoId(conversation));

      // If message is already copied, skip
      const seen = await db.copiedMessages.where({ contentHash }).first();
      if (seen) {
        console.log("SENT");
        continue;
      }

      const { contentType } = message;

      // If message is a SwapStatusType, clone it and send to conversation
      if (isSwapStatusType(contentType)) {
        await conversation.send(message.content, { contentType });
        await db.copiedMessages.add({ contentHash, createdAt: new Date() });
        continue;
      }

      // If message is a ContentTypeDeliveryReceipt, skip
      if (isDeliveryReceipt(contentType)) {
        continue;
      }

      // If message is a ContentTypeReadReceipt, skip
      if (isReadReceipt(contentType)) {
        continue;
      }

      // Send message to conversation
      await conversation.send(
        {
          from: decMsg.from,
          to: decMsg.to,
          sentAt: decMsg.sentAt,
          content: decMsg.content,
          originalContentType: decMsg.contentType,
        },
        {
          contentType: ContentTypeMessageRelay,
        }
      );

      await db.copiedMessages.add({ contentHash, createdAt: new Date() });
    }
  }

  /**
   * Send swap status to a conversation if not already sent
   * @param id The id of the status
   * @param status The status to send
   * @param conversation The conversation to send the status to
   */
  async function sendSwapStatus(
    id: string,
    status: string,
    conversation: Conversation
  ) {
    const messages = await conversation.messages({});

    // Find swap-status message
    const existing = messages.find(
      (msg) =>
        msg.contentType?.authorityId == JointAuthorityId &&
        msg.contentType?.typeId == SwapStatusTypeId &&
        msg.content.id == id
    );
    if (existing) return;

    await conversation.send(
      { id, status },
      { contentType: ContentTypeSwapStatus }
    );
  }

  /**
   * Send a delivery receipt to one or more conversations
   * @param clientAddress The client address
   * @param msg The message to send the delivery receipt for
   * @param convos The conversations to send the delivery receipt to
   */
  async function sendDeliveryReceipt(
    clientAddress: string,
    msg: { id: string; senderAddress: string; contentType: ContentType },
    convos: Conversation[]
  ) {
    // If message is a delivery or receive receipt, skip
    if (isDeliveryReceipt(msg.contentType) || isReadReceipt(msg.contentType)) {
      return;
    }

    // If message is from client, skip
    if (msg.senderAddress == clientAddress) {
      return;
    }

    for (const convo of convos) {
      const messages = await convo.messages({});
      const existing = messages.find((m) => {
        return isDeliveryReceipt(m.contentType) && m.content.msgId == msg.id;
      });
      if (existing) continue;

      void convo.send(
        { msgId: msg.id, timestamp: moment().unix() },
        { contentType: ContentTypeDeliveryReceipt }
      );
    }
  }

  /**
   * Send a read receipt to one or more conversations
   * @param clientAddress The client address
   * @param msg The message to send the delivery receipt for
   * @param convos The conversations to send the delivery receipt to
   */
  async function sendReadReceipt(
    clientAddress: string,
    msg: { id: string; senderAddress: string; contentType: ContentType },
    convos: Conversation[]
  ) {
    // If message is a read or delivery receipt, skip
    if (isReadReceipt(msg.contentType) || isDeliveryReceipt(msg.contentType)) {
      return;
    }

    // If message is from client, skip
    if (msg.senderAddress == clientAddress) {
      return;
    }

    for (const convo of convos) {
      const messages = await convo.messages({});
      const existing = messages.find((m) => {
        return isReadReceipt(m.contentType) && m.content.msgId == msg.id;
      });
      if (existing) {
        continue;
      }

      void convo.send(
        { msgId: msg.id, timestamp: moment().unix() },
        { contentType: ContentTypeReadReceipt }
      );
    }
  }

  /**
   * Send a message to a conversation
   * @param client The XMTP client
   * @param conversation The conversation to send the message to
   * @param msg The message to send
   * @param sentAt The timestamp of the message
   * @param ignoreDupCheck
   * @param metadata Additional information about the message
   */
  async function send(
    client: Client,
    conversation: Conversation,
    msg: string | { [key: string]: never } | RemoteAttachment,
    sentAt?: Date,
    ignoreDupCheck = false,
    metadata?: { [key: string]: string }
  ) {
    if (!conversation) return;

    let pendingMsgId = 0;
    const now = sentAt ? moment(sentAt) : moment();
    type PreparedMessage = ReturnType<typeof createPreparedMessage>;
    let convoMsg: PreparedMessage | undefined = undefined;

    // Create unsent message with common fields
    let dbMsg: Partial<Message> = {
      msgId: Buffer.from(randomBytes(16)).toString("hex"),
      from: client.address,
      to: conversation.peerAddress,
      conversationId: getConvoId(conversation),
      status: "sending",
      sentAt: now.unix(),
    };

    // Create message for text or object messages
    if (
      typeof msg == "string" ||
      (typeof msg == "object" && !("contentLength" in msg))
    ) {
      convoMsg = createPreparedMessage(
        conversation,
        msg as string,
        now.toDate()
      );
      dbMsg = {
        ...dbMsg,
        content: msg,
        contentHash: getContentHash({ content: msg, sentAt: now.unix() }),
        contentType: ContentTypeText,
      };
    }

    // Create message for remote attachment messages
    if (typeof msg == "object" && "contentLength" in msg) {
      const content = { ...metadata };
      dbMsg = {
        ...dbMsg,
        content,
        contentHash: getContentHash({ content, sentAt: now.unix() }),
        contentType: ContentTypeRemoteAttachment,
      };
      convoMsg = createPreparedMessage(
        conversation,
        msg,
        now.toDate(),
        ContentTypeRemoteAttachment
      );
    }

    if (!convoMsg) throw new Error("message is undefined");

    try {
      // If message is already sent, skip
      if (!ignoreDupCheck) {
        const existing = await db.messages
          .where("contentHash")
          .equals(dbMsg.contentHash as string)
          .first();
        if (existing) return;
      }

      // Add pending message to database
      pendingMsgId = await db.messages.add(dbMsg as Message);

      try {
        await (await convoMsg).send();
      } catch (e) {
        db.messages.update(pendingMsgId, { status: "failed" });
        throw e;
      }

      db.messages.update(pendingMsgId, {
        msgId: await (await convoMsg).messageID(),
        status: "sent",
      });
    } catch (e) {
      handleMessageAddError(e);
    }
  }

  /**
   * Handle error when adding a message to the database
   * @param e
   */
  function handleMessageAddError(e) {
    const errMsg = (e as { message: string }).message;
    if (errMsg.includes("uniqueness requirements")) {
      if (isDev()) console.error("processMessage(): message exist. skipping");
    } else {
      throw e;
    }
  }

  /**
   * Get the conversation id from a conversation
   * @param convo The conversation to get the id from
   */
  function getConvoId(convo: Conversation) {
    if (!convo.context || !convo.context.conversationId)
      throw new Error("conversationId not found");
    return convo.context?.conversationId;
  }

  /**
   * Remove a message by id
   * @param id The id of the message
   */
  async function removeMessageById(id: number) {
    await db.messages.delete(id);
  }

  return {
    saveKeys,
    loadKeys,
    makeSwapConversationKey,
    createOrGetConvoWithMediator,
    createConversationsWithCounterparts,
    createConversation,
    send,
    getConvoId,
    loadMessagesFromConvoToDB,
    removeMessageById,
    getMessagesFromDB,
    processMessage,
    sendDeliveryReceipt,
    sendReadReceipt,
    relayMessageToConvos,
    sendSwapStatus,
  };
}
