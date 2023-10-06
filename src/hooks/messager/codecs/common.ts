import { ContentTypeText } from "@xmtp/xmtp-js";
import { ContentType, Message } from "../../../components/messenger/db.ts";
import { ContentTypeRemoteAttachment } from "@xmtp/content-type-remote-attachment";
import { isMessageRelayType } from "./MessageRelayCodec.ts";
import { FileMeta } from "./RemoteFileCodec.ts";
export const JointAuthorityId = "joint.exchange";

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
