import { decode, encode } from "@msgpack/msgpack";
import { ContentCodec, ContentTypeId } from "@xmtp/xmtp-js";
import { ContentType } from "../../../components/messenger/db.ts";

const JointAuthorityId = "joint.exchange";
export const FollowTypeId = "follow";
export const ContentTypeFollow = new ContentTypeId({
  authorityId: JointAuthorityId,
  typeId: FollowTypeId,
  versionMajor: 1,
  versionMinor: 0,
});

export type FollowPayload = {
  network: string;
  user: string;
  market: string;
  provider: string;
  lid: string;
  follower: string;
  type: "market" | "liquidity" | "user";
  createdAt: number;
  signature: string;
  unfollow?: boolean;
};

export default class FollowCodec implements ContentCodec<any> {
  get contentType() {
    return ContentTypeFollow;
  }

  encode(data: FollowPayload) {
    return {
      type: ContentTypeFollow,
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

export function isFollowType(contentTypeId: ContentType | undefined) {
  return (
    contentTypeId &&
    contentTypeId.authorityId == JointAuthorityId &&
    contentTypeId.typeId == FollowTypeId
  );
}
