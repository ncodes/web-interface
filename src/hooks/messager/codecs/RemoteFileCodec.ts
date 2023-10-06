import { ContentCodec, ContentTypeId } from "@xmtp/xmtp-js";
import { JointAuthorityId } from "./common.ts";
import { RemoteAttachment } from "@xmtp/content-type-remote-attachment";
import { decode, encode } from "@msgpack/msgpack";

export const RemoteFileTypeId = "remote-attachment";
export const ContentTypeRemoteFile = new ContentTypeId({
  authorityId: JointAuthorityId,
  typeId: RemoteFileTypeId,
  versionMajor: 1,
  versionMinor: 0,
});

export interface FileMeta {
  // Base64 encoding of the file
  data: string;

  // The file type
  type: string;
}

export type ExtendedRemoteAttachment = RemoteAttachment & {
  fileMeta: FileMeta;
};

export default class RemoteFileCodec implements ContentCodec<any> {
  get contentType() {
    return ContentTypeRemoteFile;
  }

  encode(data: ExtendedRemoteAttachment) {
    return {
      type: ContentTypeRemoteFile,
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
