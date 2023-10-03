import { ContentCodec, ContentTypeId } from "@xmtp/xmtp-js";
import { JointAuthorityId } from "./common.ts";
import { ContentType } from "../../../components/messenger/db.ts";

export const DeliveryReceiptTypeId = "delivery-receipt";
export const ContentTypeDeliveryReceipt = new ContentTypeId({
  authorityId: JointAuthorityId,
  typeId: DeliveryReceiptTypeId,
  versionMajor: 1,
  versionMinor: 0,
});

export default class DeliveryReceiptCodec implements ContentCodec<any> {
  get contentType() {
    return ContentTypeDeliveryReceipt;
  }

  encode(data: { msgId: string; timestamp: number }) {
    return {
      type: ContentTypeDeliveryReceipt,
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

export function isDeliveryReceipt(contentType: ContentType) {
  return (
    contentType.typeId === DeliveryReceiptTypeId &&
    contentType.authorityId === JointAuthorityId
  );
}
