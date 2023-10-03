import { ContentCodec, ContentTypeId } from "@xmtp/xmtp-js";
import { JointAuthorityId } from "./common.ts";

export const MessageRelayTypeId = "msg-relay";
export const ContentTypeMessageRelay = new ContentTypeId({
  authorityId: JointAuthorityId,
  typeId: MessageRelayTypeId,
  versionMajor: 1,
  versionMinor: 0,
});

export default class MessageRelayCodec implements ContentCodec<any> {
  get contentType() {
    return ContentTypeMessageRelay;
  }

  encode(data: { from: string; to: string; sentAt: number; content: string }) {
    return {
      type: ContentTypeMessageRelay,
      parameters: {},
      content: new TextEncoder().encode(JSON.stringify(data)),
    };
  }

  decode(content: { content: any }) {
    return JSON.parse(new TextDecoder().decode(content.content));
  }

  fallback(): string | undefined {
    return undefined;
  }
}
