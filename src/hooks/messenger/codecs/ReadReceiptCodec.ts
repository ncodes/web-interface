import { decode, encode } from "@msgpack/msgpack";
import { ContentCodec, ContentTypeId } from "@xmtp/xmtp-js";
import { ContentType } from "../../../components/messenger/db.ts";

const JointAuthorityId = "joint.exchange";
export const ReadReceiptTypeId = "read-receipt";
export const ContentTypeReadReceipt = new ContentTypeId({
  authorityId: JointAuthorityId,
  typeId: ReadReceiptTypeId,
  versionMajor: 1,
  versionMinor: 0,
});

export default class ReadReceiptCodec implements ContentCodec<any> {
  get contentType() {
    return ContentTypeReadReceipt;
  }

  encode(data: { msgId: string; timestamp: number }) {
    return {
      type: ContentTypeReadReceipt,
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

export function isReadReceipt(contentType: ContentType) {
  return (
    contentType.typeId === ContentTypeReadReceipt.typeId &&
    contentType.authorityId === ContentTypeReadReceipt.authorityId
  );
}
