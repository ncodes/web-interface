import { ContentCodec, ContentTypeId } from "@xmtp/xmtp-js";

export const JointAuthorityId = "joint.exchange";
export const MessageRelayTypeId = "msg-relay";
export const ContentTypeMessageRelayCodec = new ContentTypeId({
  authorityId: JointAuthorityId,
  typeId: MessageRelayTypeId,
  versionMajor: 1,
  versionMinor: 0,
});

export default class MessageRelayCodec implements ContentCodec<any> {
  get contentType() {
    return ContentTypeMessageRelayCodec;
  }

  encode(data: { from: string; to: string; sentAt: number; content: string }) {
    return {
      type: ContentTypeMessageRelayCodec,
      parameters: {},
      content: new TextEncoder().encode(JSON.stringify(data)),
    };
  }

  decode(content: { content: any }) {
    return JSON.parse(new TextDecoder().decode(content.content));
  }

  fallback(_content: any): string | undefined {
    return undefined;
  }
}
