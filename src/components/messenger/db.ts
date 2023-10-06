import Dexie from "dexie";
import { isDev } from "../../libs/helpers.ts";

// Define a conversation interface
export interface Conversation {
  id?: number;
  topic: string;
  title: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentType {
  authorityId: string;
  typeId: string;
  versionMajor: number;
  versionMinor: number;
}

// Define a message interface
export interface Message<T = unknown> {
  id?: number;
  msgId: string;
  from: string;
  to: string;
  conversationId: string;
  sentAt: number;
  receivedAt?: number;
  contentType?: ContentType;
  content: T;
  contentHash: string;
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  readers?: string[];
  receivers?: string[];
}

// Define a copied message interface
export interface CopiedMessage {
  id?: number;
  contentHash: string;
  createdAt: Date;
}

// Define a message attachment interface
export interface MessageAttachment {
  id?: number;
  messageID: number;
  filename: string;
  mimeType: string;
  data: Uint8Array;
}

// Define a message reaction interface
export interface MessageReaction {
  id?: number;
  reactor: string;
  messageXMTPID: string;
  name: string;
}

// Create a class for the database
class DB extends Dexie {
  // Define tables for the database
  conversations!: Dexie.Table<Conversation, number>;
  messages!: Dexie.Table<Message, number>;
  copiedMessages!: Dexie.Table<CopiedMessage, number>;
  attachments!: Dexie.Table<MessageAttachment, number>;
  reactions!: Dexie.Table<MessageReaction, number>;

  constructor() {
    super("messenger_db" + (isDev() ? "_dev" : ""));
    // this.delete();
    this.version(isDev() ? 100 : 1).stores({
      // Define the structure and indexes for each table
      conversations: `
      ++id,
      topic,
      title,
      createdAt,
      updatedAt`,

      messages: `
      ++id,
      msgId,
      from,
      to,
      content,
      contentType,
      conversationId,
      contentHash,
      sentAt,
      &[conversationId+contentHash+sentAt],
      status,
      [msgId+status],
      readers,
      receivers
      `,

      copiedMessages: `
      ++id,
      contentHash,
      createdAt
      `,

      attachments: `
      ++id,
      messageID,
      filename,
      mimeType,
      data
    `,

      reactions: `
      ++id,
      [messageXMTPID+reactor+name],
      messageXMTPID,
      reactor,
      name
    `,
    });
  }
}

// Initialize the database and export it
const db = new DB();
export default db;
