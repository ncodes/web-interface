import moment from "moment";
import { isEqlStr } from "./helpers.ts";

enum AssetType {
  SYNTH,
  ERC20,
  ERC721,
  ERC1155,
}

export function isERC20(assetType: AssetType) {
  return assetType == AssetType.ERC20;
}

export function isERC721(assetType: AssetType) {
  return assetType == AssetType.ERC721;
}

export function isSynth(assetType: AssetType) {
  return assetType == AssetType.SYNTH;
}

export function isFungible(assetType: AssetType) {
  return assetType == AssetType.ERC20 || assetType == AssetType.SYNTH;
}

export function isNFT(assetType: AssetType) {
  return assetType == AssetType.ERC721 || assetType == AssetType.ERC1155;
}

/**
 * getPayer determines whether the provider or the taker is
 * expected to make off-chain payment
 */
export function getPayer(swap: Swap) {
  let payer = "";
  const { baseType, quoteType } = swap.market;
  if (isERC20(baseType) && isSynth(quoteType)) {
    payer = swap.taker;
  } else if (isSynth(baseType) && isSynth(quoteType)) {
    payer = swap.taker;
  } else if (isSynth(baseType) && (isERC20(quoteType) || isNFT(quoteType))) {
    payer = swap.provider;
  } else if (isNFT(baseType) && isSynth(quoteType)) {
    payer = swap.taker;
  }
  return payer;
}

export function isDisputer(swap: Swap, address: string) {
  return (
    swap.disputes[0].creator.toLowerCase().trim() ==
    address.toLowerCase().trim()
  );
}

export function canAppeal(swap: Swap) {
  return (
    (swap.disputes.length == 0 && swap.paid && !swap.finalizedAt) || // new dispute
    (swap.disputes.length > 0 && swap.disputes[0].abandoned) // can re-open abandoned dispute
  );
}

export function isDisputed(swap: Swap) {
  return (
    swap.disputes.length > 0 &&
    (!swap.disputes[0].executed || swap.disputes[0].abandoned)
  );
}

export function isDisputeAbandoned(swap: Swap) {
  return swap.disputes.length > 0 && swap.disputes[0].abandoned;
}

export function isOfferPending(offer: Offer) {
  return (
    !offer.accepted &&
    !offer.cancelled &&
    !offer.executed &&
    moment(offer.deadline).isAfter(moment())
  );
}

export function isOfferExpired(offer: Offer) {
  return (
    !offer.cancelled &&
    !offer.executed &&
    moment().isAfter(moment(offer.deadline))
  );
}

export function isOfferer(offer: Offer, address: string) {
  return isEqlStr(offer.creator, address);
}

enum DisputeState {
  Abandoned = "abandoned",
  Executed = "executed",
  Released = "released",
  Cancelled = "cancelled",
  Stalled = "stalled",
  Draft = "draft",
  Evidence = "evidence",
  Commit = "commit",
  Reveal = "reveal",
  AwaitingExec = "awaiting_exec",
}

export function getDisputeStatus(dispute: Dispute) {
  const {
    abandoned,
    executed,
    released,
    orderReleased,
    numMediatorsDrafted,
    numMediators,
    evidenceEndAt,
    commitEndAt,
    revealEndAt,
  } = dispute;

  if (released) return DisputeState.Released;
  if (!released && released != null && executed) return DisputeState.Cancelled;
  if (executed && !abandoned && released == null) return DisputeState.Stalled;
  if (abandoned) return DisputeState.Abandoned;
  if (!executed && !orderReleased && numMediators > numMediatorsDrafted) {
    return DisputeState.Draft;
  }
  if (
    !executed &&
    !orderReleased &&
    numMediators == numMediatorsDrafted &&
    moment(evidenceEndAt).isAfter(moment())
  ) {
    return DisputeState.Evidence;
  }
  if (
    !executed &&
    !orderReleased &&
    numMediators == numMediatorsDrafted &&
    moment(evidenceEndAt).isBefore(moment()) &&
    moment(commitEndAt).isAfter(moment())
  ) {
    return DisputeState.Commit;
  }
  if (
    !executed &&
    !orderReleased &&
    numMediators == numMediatorsDrafted &&
    moment(evidenceEndAt).isBefore(moment()) &&
    moment(commitEndAt).isBefore(moment()) &&
    moment(revealEndAt).isAfter(moment())
  ) {
    return DisputeState.Reveal;
  }
  if (
    !executed &&
    !orderReleased &&
    numMediators == numMediatorsDrafted &&
    moment(evidenceEndAt).isBefore(moment()) &&
    moment(commitEndAt).isBefore(moment()) &&
    moment(revealEndAt).isBefore(moment())
  ) {
    return DisputeState.AwaitingExec;
  }
  if (executed) return DisputeState.Executed;
}

export function isDisputeDraftee(dispute: Dispute, address: string) {
  return dispute.draftees.some((d) => isEqlStr(d.owner, address));
}

export function getDisputeOutcome(dispute: Dispute) {
  if (dispute.numMediators > dispute.reveals.length)
    return DisputeState.Stalled;

  const release = dispute.reveals.filter((r) => r.vote == "0x31");
  const cancel = dispute.reveals.filter((r) => r.vote == "0x30");

  if (Math.round(release.length / dispute.reveals.length) > 0.5)
    return DisputeState.Released;

  if (Math.round(cancel.length / dispute.reveals.length) > 0.5)
    return DisputeState.Cancelled;

  return DisputeState.Stalled;
}
