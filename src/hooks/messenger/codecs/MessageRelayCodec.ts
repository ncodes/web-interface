import { decode, encode } from "@msgpack/msgpack";
import { ContentCodec, ContentTypeId } from "@xmtp/xmtp-js";
import { ContentType } from "../../../components/messenger/db.ts";

const JointAuthorityId = "joint.exchange";
export const MessageRelayTypeId = "msg-relay";
export const ContentTypeMessageRelay = new ContentTypeId({
  authorityId: JointAuthorityId,
  typeId: MessageRelayTypeId,
  versionMajor: 1,
  versionMinor: 0,
});

export type MessageRelayPayload = {
  from: string;
  to: string;
  sentAt: number;
  content: unknown;
  originalContentType: ContentType | undefined;
};

export default class MessageRelayCodec implements ContentCodec<any> {
  get contentType() {
    return ContentTypeMessageRelay;
  }

  encode(data: MessageRelayPayload) {
    return {
      type: ContentTypeMessageRelay,
      parameters: {},
      content: encode(data),
    };
  }

  decode(content: { content: any }) {
    return decode(content.content);
  }

  fallback(): string | undefined {
    return undefined;
  }
}

export function isMessageRelayType(contentTypeId: ContentType | undefined) {
  return (
    contentTypeId &&
    contentTypeId.authorityId == JointAuthorityId &&
    contentTypeId.typeId == MessageRelayTypeId
  );
}
