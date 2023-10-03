import { ContentCodec, ContentTypeId } from "@xmtp/xmtp-js";
import { JointAuthorityId } from "./common.ts";

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
