import { decode, encode } from "@msgpack/msgpack";
import { Client, ContentCodec, ContentTypeId, Signature } from "@xmtp/xmtp-js";
import { ContentType } from "../../../components/messenger/db.ts";

const JointAuthorityId = "joint.exchange";
export const SwapRatingTypeId = "swap-rating";
export const ContentTypeSwapRating = new ContentTypeId({
  authorityId: JointAuthorityId,
  typeId: SwapRatingTypeId,
  versionMajor: 1,
  versionMinor: 0,
});

export type SwapRatingPayload = {
  network: string;
  orderId: string;
  rater: string;
  rated: string;
  comment: string;
  isOk: boolean;
  createdAt: number;
  signature: string;
};

export default class SwapRatingCodec implements ContentCodec<any> {
  get contentType() {
    return ContentTypeSwapRating;
  }

  encode(data: SwapRatingPayload) {
    return {
      type: ContentTypeSwapRating,
      parameters: {},
      content: encode(data),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    contentTypeId.typeId == SwapRatingTypeId
  );
}

export async function verifyReview(client: Client, review: SwapRatingPayload) {
  // Get the public ID key of the rater
  const { rater, signature } = review;
  const raterKey = await client.getUserContact(rater);
  if (!raterKey) return false;
  const key = raterKey.identityKey;

  // Verify signature
  if (!signature) return false;
  const sigBytes = Buffer.from(signature, "hex");
  const sig = Signature.fromBytes(sigBytes);
  delete (review as { signature?: string }).signature;

  const digest = new SwapRatingCodec().encode(review);
  const valid = key.verify(sig, digest.content);
  if (!valid) return false;

  return true;
}
