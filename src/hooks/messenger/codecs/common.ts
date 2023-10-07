import { ContentTypeRemoteAttachment } from "@xmtp/content-type-remote-attachment";
import { ContentTypeText } from "@xmtp/xmtp-js";
import { ContentType, Message } from "../../../components/messenger/db.ts";
import { isMessageRelayType } from "./MessageRelayCodec.ts";
export interface FileMeta {
  type: string;
  data: string;
}

export function isTextType(contentTypeId: ContentType | undefined) {
  if (!contentTypeId) return false;
  return (
    contentTypeId.authorityId == ContentTypeText.authorityId &&
    contentTypeId.typeId == ContentTypeText.typeId
  );
}

export function isRemoteAttachmentType(contentTypeId: ContentType) {
  return (
    contentTypeId.authorityId == ContentTypeRemoteAttachment.authorityId &&
    contentTypeId.typeId == ContentTypeRemoteAttachment.typeId
  );
}

export function isRelayedRemoteAttachmentType(msg: Message<FileMeta>) {
  if (!msg) return false;
  return (
    isMessageRelayType(msg.contentType) && msg.content.data && msg.content.type
  );
}
