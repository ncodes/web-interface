import { decode, encode } from "@msgpack/msgpack";
import { ContentCodec, ContentTypeId } from "@xmtp/xmtp-js";

const JointAuthorityId = "joint.exchange";
export const SwapStatusTypeId = "swap-status";
export const ContentTypeSwapStatus = new ContentTypeId({
  authorityId: JointAuthorityId,
  typeId: SwapStatusTypeId,
  versionMajor: 1,
  versionMinor: 0,
});

export default class SwapStatusCodec implements ContentCodec<any> {
  get contentType() {
    return ContentTypeSwapStatus;
  }

  encode(data: {
    id: string;
    status: string;
    metadata: { [key: string]: string };
  }) {
    return {
      type: ContentTypeSwapStatus,
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

export function isSwapStatusType(contentTypeId: ContentTypeId) {
  return (
    contentTypeId.authorityId == JointAuthorityId &&
    contentTypeId.typeId == SwapStatusTypeId
  );
}
