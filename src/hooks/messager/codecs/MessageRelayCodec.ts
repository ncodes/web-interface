import { ContentCodec, ContentTypeId } from "@xmtp/xmtp-js";
import { JointAuthorityId } from "./common.ts";
import { ContentType } from "../../../components/messenger/db.ts";
import { encode, decode } from "@msgpack/msgpack";

export const MessageRelayTypeId = "msg-relay";
export const ContentTypeMessageRelay = new ContentTypeId({
  authorityId: JointAuthorityId,
  typeId: MessageRelayTypeId,
  versionMajor: 1,
  versionMinor: 0,
});

interface MessageRelayPayload {
  from: string;
  to: string;
  sentAt: number;
  content: unknown;
  originalContentType: ContentType | undefined;
}

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
