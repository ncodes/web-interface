import { Address } from "viem";

export type GrantBadgeSignatureParams = [
  badge: string,
  path: string,
  grantee: Address,
  badgeExpireAt: bigint,
  metaKeys: string[],
  metaValues: string[],
  sigExpireAt: bigint,
];

export type GrantBadgeSignatureMessage = {
  badge: string;
  signature: `0x${string}`;
  values: GrantBadgeSignatureParams;
};
