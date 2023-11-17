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

export interface SwapStatusCodecContent {
  id: string;
  status: string;
  metadata: { [key: string]: string };
}

export default class SwapStatusCodec implements ContentCodec<unknown> {
  get contentType() {
    return ContentTypeSwapStatus;
  }

  encode(data: SwapStatusCodecContent) {
    return {
      type: ContentTypeSwapStatus,
      parameters: {},
      content: encode(data),
    };
  }

  decode(content: { content: unknown }) {
    return decode(content.content as Uint8Array);
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
