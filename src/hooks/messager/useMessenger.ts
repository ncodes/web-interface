import { Client, Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import { getSwapCounterpart } from "../../libs/api_utils.ts";
import db, { Message } from "../../components/messenger/db.ts";
import moment from "moment";
import { isDev, isEqlStr, sha1 } from "../../libs/helpers.ts";
import { randomBytes } from "ethers/lib.esm/utils";
import {
  ContentTypeMessageRelayCodec,
  JointAuthorityId,
  MessageRelayTypeId,
} from "./MessageRelayCodec.ts";

export default function useMessenger() {
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
    return `swap_conversation_113:${network}:${orderId}`;
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
    return `mediation_msgs_113:${network}:${orderId}:${address.toLowerCase()}:${draftee.toLowerCase()}`;
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
    return `mediation_msgs_113:${network}:${orderId}:${counterparty.toLowerCase()}:${mediator.toLowerCase()}`;
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
   */
  async function createPreparedMessage(
    conversation: Conversation,
    msg: string
  ) {
    return conversation.prepareMessage(msg, { timestamp: new Date() });
  }

  /**
   * Load messages from a conversation into the database
   * @param client The XMTP client
   * @param conversation The conversation to load messages from
   * @param ignoreOwnMessages Ignore own messages
   */
  async function loadMessagesToDB(
    client: Client,
    conversation: Conversation,
    ignoreOwnMessages = false
  ) {
    if (!conversation) return;

    const lastMsg = await db.messages
      .where("conversationId")
      .equals(getConvoId(conversation))
      .limit(2)
      .reverse()
      .sortBy("sentAt");

    const messages = await conversation.messages({
      startTime: lastMsg.length
        ? moment.unix(lastMsg[0].sentAt).toDate()
        : undefined,
    });

    const { peerAddress } = conversation;
    const { address } = client;
    for (const msg of messages) {
      if (ignoreOwnMessages && isEqlStr(msg.senderAddress, address)) continue;

      const existing = await db.messages
        .where("contentHash")
        .equals(sha1(getStringContent(msg.content).trim()))
        .first();
      if (existing) continue;
      try {
        await db.messages.add(processDecodedMessage(address, peerAddress, msg));
      } catch (e) {
        handleMessageAddError(e);
      }
    }

    return [];
  }

  function getStringContent(content: string | object) {
    return typeof content == "string" ? content : JSON.stringify(content);
  }

  /**
   * Process a message and save it to the database
   * @param clientAddress The client address
   * @param peerAddress The peer address
   * @param msg The message to process
   * @param ignoreOwnMessages Ignore own messages
   */
  async function processMessage(
    clientAddress: string,
    peerAddress: string,
    msg: DecodedMessage,
    ignoreOwnMessages = false
  ) {
    if (ignoreOwnMessages && isEqlStr(msg.senderAddress, clientAddress)) return;
    const existing = await db.messages
      .where({ contentHash: sha1(getStringContent(msg.content).trim()) })
      .first();
    if (existing) return;
    try {
      const decMsg = processDecodedMessage(clientAddress, peerAddress, msg);
      await db.messages.add(decMsg);
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
    const { id, contentType, conversation } = decoded;
    const { authorityId, typeId } = contentType;
    let { content, senderAddress, sent } = decoded;
    let to = "";
    let contentHash = "";

    if (authorityId == JointAuthorityId && typeId == MessageRelayTypeId) {
      contentHash = sha1(getStringContent(content).trim());
      content = decoded.content.content;
      senderAddress = decoded.content.from;
      to = decoded.content.to;
      sent = moment.unix(decoded.content.sentAt).toDate();
    }

    if (authorityId == "xmtp.org" && typeId == "text") {
      contentHash = sha1(content.trim());
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
   * Copy messages from one conversation to another
   * @param from The conversation to copy messages from
   * @param conversations The conversations to copy messages to
   */
  async function relayFromConvoToConvos(
    from: Conversation,
    conversations: Conversation[]
  ) {
    const messages = await getMessagesFromDB([getConvoId(from)]);
    for (const conversation of conversations) {
      for (const message of messages) {
        const contentHash = sha1(message.content);

        // If message is already copied, skip
        const seen = await db.copiedMessages.where({ contentHash }).first();
        if (seen) continue;

        // relay to conversation
        await conversation.send(
          {
            from: message.from,
            to: message.to,
            sentAt: message.sentAt,
            content: message.content,
          },
          {
            contentType: ContentTypeMessageRelayCodec,
          }
        );

        await db.copiedMessages.add({
          contentHash,
          createdAt: new Date(),
        });
      }
    }
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
      const contentHash = sha1(decMsg.content);

      // If message is already copied, skip
      const seen = await db.copiedMessages.where({ contentHash }).first();
      if (seen) continue;

      await conversation.send(
        {
          from: decMsg.from,
          to: conversation.peerAddress,
          sentAt: decMsg.sentAt,
          content: decMsg.content,
        },
        {
          contentType: ContentTypeMessageRelayCodec,
        }
      );

      await db.copiedMessages.add({
        contentHash,
        createdAt: new Date(),
      });
    }
  }

  /**
   * Send a message to a conversation
   * @param client The XMTP client
   * @param conversation The conversation to send the message to
   * @param msg The message to send
   */
  async function send(client: Client, conversation: Conversation, msg: string) {
    let unsentMsgId = 0;
    try {
      if (!conversation) return;
      const message = await createPreparedMessage(conversation, msg);

      // Add message to DB with pending status
      unsentMsgId = await db.messages.add({
        msgId: Buffer.from(randomBytes(16)).toString("hex"),
        from: client.address,
        to: conversation.peerAddress,
        contentHash: sha1(msg),
        content: msg,
        conversationId: getConvoId(conversation),
        status: "sending",
        sentAt: moment().unix(),
      });

      message
        .send()
        .then(() => {
          db.messages
            .update(unsentMsgId, { status: "sent" })
            .catch(console.error);
        })
        .catch(async () => {
          db.messages.update(unsentMsgId, { status: "failed" });
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

  //   function makeFrontMatterMsg(message: Message) {
  //     return `---
  // From: '${message.from}'
  // To: '${message.to}'
  // SentAt: ${message.sentAt}
  // ---
  // ${message.content}
  // `;
  //   }

  return {
    saveKeys,
    loadKeys,
    makeSwapConversationKey,
    createOrGetConvoWithMediator,
    createConversationsWithCounterparts,
    createConversation,
    send,
    getConvoId,
    loadMessagesToDB,
    removeMessageById,
    getMessagesFromDB,
    processMessage,
    relayFromConvoToConvos,
    relayMessageToConvos,
  };
}
