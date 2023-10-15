import {
  Attachment,
  AttachmentCodec,
  ContentTypeRemoteAttachment,
  RemoteAttachment,
  RemoteAttachmentCodec,
} from "@xmtp/content-type-remote-attachment";
import {
  Client,
  ClientOptions,
  ContentTypeId,
  ContentTypeText,
  Conversation,
  DecodedMessage,
} from "@xmtp/xmtp-js";
import EthCrypto from "eth-crypto";
import { randomBytes } from "ethers/lib.esm/utils";
import moment from "moment";
import forge from "node-forge";
import { Chain, WalletClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "wagmi/chains";
import db, { ContentType, Message } from "../../components/messenger/db.ts";
import { getSwapCounterpart } from "../../libs/api_utils.ts";
import { isDev, isEqlStr, sha1, uint8ArrayToB64 } from "../../libs/helpers.ts";
import DeliveryReceiptCodec, {
  ContentTypeDeliveryReceipt,
  isDeliveryReceipt,
} from "./codecs/DeliveryReceiptCodec.ts";
import FollowCodec from "./codecs/FollowCodec.ts";
import MessageRelayCodec, {
  ContentTypeMessageRelay,
  MessageRelayPayload,
  isMessageRelayType,
} from "./codecs/MessageRelayCodec.ts";
import ReadReceiptCodec, {
  ContentTypeReadReceipt,
  isReadReceipt,
} from "./codecs/ReadReceiptCodec.ts";
import SwapStatusCodec, {
  ContentTypeSwapStatus,
  SwapStatusTypeId,
  isSwapStatusType,
} from "./codecs/SwapStatusCodec.ts";
import {
  FileMeta,
  isRemoteAttachmentType,
  isTextType,
} from "./codecs/common.ts";

/**
 * UseMessenger provides messaging capabilities built on top of XMTP
 * messaging network. This hook provides functions for sending, receiving,
 * filtering and storage of messages.
 * @returns
 */
export default function useMessenger() {
  const version = "171"; // TODO: use 1 in production

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

  function applyCodecToClient(client: Client) {
    client.registerCodec(new DeliveryReceiptCodec());
    client.registerCodec(new ReadReceiptCodec());
    client.registerCodec(new MessageRelayCodec());
    client.registerCodec(new SwapStatusCodec());
    client.registerCodec(new RemoteAttachmentCodec());
    client.registerCodec(new AttachmentCodec());
    client.registerCodec(new FollowCodec());
  }

  /**
   * Initialize the XMTP client
   * @param env The environment to initialize the client for
   * @param wallet The wallet to use for signing
   * @returns The XMTP client
   */
  async function initClient(
    env: "local" | "dev" | "production",
    wallet: WalletClient
  ) {
    const opts: Partial<ClientOptions> = { env };
    const address = (await wallet.getAddresses())[0];
    let keys = loadKeys(env, address);
    if (!keys) {
      keys = await Client.getKeys(wallet, opts);
      saveKeys(env, address, keys);
    }

    const c = await Client.create(null, {
      ...opts,
      privateKeyOverride: keys,
      skipContactPublishing: true,
    });

    applyCodecToClient(c);

    return c;
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
   * Get the message hash of a message
   * @param msg The message to get the message hash from
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

    if (ignoreOwnMessages && isEqlStr(msg.senderAddress, client.address))
      return;

    // For message delivery receipt, update message status only, don't save to DB
    if (isDeliveryReceipt(msg.contentType)) {
      await db.messages
        .where("sentAt")
        .belowOrEqual(moment(msg.sent).unix())
        .and((q) => {
          return q.status != "read" && q.status != "delivered";
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

      const { mimeType, data, filename } = attachment;
      msg.content = {
        type: mimeType,
        data: uint8ArrayToB64(data),
        filename,
      } as FileMeta;
    }

    // For text message relay, reconstruct message using the original content
    // type and relayed content to make it appear as though the message was
    // sent directly to the client by the original sender.
    if (
      isMessageRelayType(msg.contentType) &&
      isTextType(msg.content.originalContentType)
    ) {
      msg.senderAddress = msg.content.from;
      msg.recipientAddress = msg.content.to;
      msg.sent = moment.unix(msg.content.sentAt).toDate();
      msg.contentType = msg.content.originalContentType;
      msg.content = msg.content.content;
    }

    // For text message, if recipient address is unset, set recipient address to
    // be the peer address if the sender address is the client address.
    if (isTextType(msg.contentType) && !msg.recipientAddress) {
      msg.recipientAddress = isEqlStr(msg.senderAddress, client.address)
        ? peerAddress
        : client.address;
    }

    // Ignore existing message
    const existing = await db.messages
      .where("msgHash")
      .equals(getContentHash(msg))
      .first();
    if (existing) return;

    try {
      await db.messages.add(processDecodedMessage(msg));
    } catch (e) {
      handleMessageAddError(e);
    }
  }

  /**
   * Converts a DecodedMessage to a Message
   * @param clientAddress The client address
   * @param peerAddress The peer address
   * @param decoded The decoded message
   */
  function processDecodedMessage(decoded: DecodedMessage): Message {
    return {
      conversationId: decoded.conversation?.context?.conversationId || "",
      from: decoded.senderAddress,
      to: decoded.recipientAddress || "",
      sentAt: moment(decoded.sent).unix(),
      receivedAt: moment().unix(),
      msgId: decoded.id,
      content: decoded.content,
      msgHash: getContentHash(decoded),
      contentHash: "",
      contentType: decoded.contentType,
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
    let lastRelayedContentHash = "";

    for (const msg of messages) {
      if (msgHash[msg.msgHash]) continue;
      msgHash[msg.msgHash] = true;

      // For relayed message, skip when the last content hash matches the current content hash.
      // Prevents showing duplicate messages relayed by multiple clients.
      if (isMessageRelayType(msg.contentType)) {
        if (msg.contentHash == lastRelayedContentHash) continue;
        lastRelayedContentHash = msg.contentHash;
      }

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
      const msgHash = getContentHash(
        {
          contentType: message.contentType,
          content: message.content,
          sentAt: moment(message.sent).unix(),
        },
        getConvoId(conversation)
      );

      // If message is already copied, skip
      const seen = await db.copiedMessages.where({ msgHash }).first();
      if (seen) {
        continue;
      }

      const { contentType } = message;

      // If message is a SwapStatusType, clone it and send to conversation
      if (isSwapStatusType(contentType)) {
        await conversation.send(message.content, { contentType });
        await db.copiedMessages.add({ msgHash, createdAt: new Date() });
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
          from: message.senderAddress,
          to: isEqlStr(message.senderAddress, clientAddress)
            ? peerAddress
            : clientAddress,
          sentAt: moment(message.sent).unix(),
          content: message.content,
          originalContentType: message.contentType,
        } as MessageRelayPayload,
        {
          contentType: ContentTypeMessageRelay,
        }
      );

      await db.copiedMessages.add({ msgHash, createdAt: new Date() });
    }
  }

  /**
   * Relay a conversation to other conversations
   * @param clientAddress The client address
   * @param peerAddress The source conversation peer address
   * @param convo The source conversation
   * @param conversations The destination conversations
   */
  async function relayConvoToConvos(
    clientAddress: string,
    convo: Conversation,
    conversations: Conversation[]
  ) {
    const messages = await convo.messages({});
    for (const msg of messages) {
      await relayMessageToConvos(
        clientAddress,
        convo.peerAddress,
        conversations,
        msg
      );
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
      (msg) => isSwapStatusType(msg.contentType) && msg.content.id == id
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
        msgHash: getContentHash({ content: msg, sentAt: now.unix() }),
        contentType: ContentTypeText,
      };
    }

    // Create message for remote attachment messages
    if (typeof msg == "object" && "contentLength" in msg) {
      const content = { ...metadata };
      dbMsg = {
        ...dbMsg,
        content,
        msgHash: getContentHash({ content, sentAt: now.unix() }),
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
          .where("msgHash")
          .equals(dbMsg.msgHash as string)
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

  /**
   * Get public conversation used as a mailbox that anyone can write to.
   * @param chain The chain to use
   * @param address The address that owns the mailbox
   * @returns Returns the convo and a client for writing to the mailbox
   */
  async function getMailbox(chain: Chain, address: string) {
    const entropy = forge.md.sha512
      .create()
      .update(`mailbox_address:${address}`)
      .digest()
      .toHex();
    const identity = EthCrypto.createIdentity(Buffer.from(entropy, "utf8"));
    const account = privateKeyToAccount(identity.privateKey as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(),
    });
    const client = await Client.create(walletClient, {
      env: chain === hardhat ? "dev" : isDev() ? "dev" : "production",
    });
    applyCodecToClient(client);
    const convo: Conversation = await client.conversations.newConversation(
      address,
      {
        conversationId: `mailbox:${version}`,
        metadata: {},
      }
    );
    return { convo, client };
  }

  /**
   * Read a mailbox
   * @param chain The chain to use
   * @param address The address that owns the mailbox
   * @param type The content type to filter by
   * @param reverse Whether to read the mailbox in reverse
   * @param cb A callback function to call for each message
   */
  async function readMailbox(
    chain: Chain,
    address: string,
    type?: ContentTypeId,
    reverse = false,
    cb?: (msg: DecodedMessage) => Promise<boolean>
  ): Promise<void> {
    const { convo } = await getMailbox(chain, address);
    const messages = await convo.messages({});
    for (const msg of reverse ? messages.reverse() : messages) {
      if (type && !msg.contentType.sameAs(type)) continue;
      if (await cb?.(msg)) break;
    }
  }

  return {
    initClient,
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
    relayConvoToConvos,
    sendSwapStatus,
    getMailbox,
    readMailbox,
  };
}
