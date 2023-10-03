import moment from "moment";
import { isEqlStr } from "./helpers.ts";

enum AssetType {
  SYNTH,
  ERC20,
  ERC721,
  ERC1155,
}

/**
 * Checks if an asset is an ERC20
 * @param assetType The asset type
 */
export function isERC20(assetType: AssetType) {
  return assetType == AssetType.ERC20;
}

/**
 * Checks if an asset is an ERC721
 * @param assetType The asset type
 */
export function isERC721(assetType: AssetType) {
  return assetType == AssetType.ERC721;
}

/**
 * Checks if an asset is a synthetic
 * @param assetType The asset type
 */
export function isSynth(assetType: AssetType) {
  return assetType == AssetType.SYNTH;
}

/**
 * Checks if an asset is fungible
 * @param assetType The asset type
 */
export function isFungible(assetType: AssetType) {
  return assetType == AssetType.ERC20 || assetType == AssetType.SYNTH;
}

/**
 * Checks if an asset is an NFT
 * @param assetType The asset type
 */
export function isNFT(assetType: AssetType) {
  return assetType == AssetType.ERC721 || assetType == AssetType.ERC1155;
}

/**
 * Determines who between the provider or the taker is expected to make off-chain payment
 * @param swap The swap object
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

/**
 * Check if an address is creator of the recent dispute of a swap
 * @param swap The swap object
 * @param address The address to check
 */
export function isDisputer(swap: Swap, address: string) {
  return (
    swap.disputes[0].creator.toLowerCase().trim() ==
    address.toLowerCase().trim()
  );
}

/**
 * Checks if the swap is in an ongoing dispute
 * @param swap The swap object
 */
export function isInDispute(swap: Swap) {
  return swap.disputes.length > 0 && !isSwapDisputeEnded(swap);
}

/**
 * Check if the last dispute of the swap is stalled
 * @param swap The swap object
 */
export function isLastDisputeStalled(swap: Swap) {
  return (
    swap.disputes.length > 0 &&
    (swap.disputes[0].executed ||
      moment(swap.disputes[0].revealEndAt).isBefore(moment())) &&
    getDisputeOutcome(swap.disputes[0]) == "stalled"
  );
}

/**
 * Check if a swap's dispute is abandoned
 * @param swap The swap object
 */
export function isDisputeAbandoned(swap: Swap) {
  return swap.disputes.length > 0 && swap.disputes[0].abandoned;
}

/**
 * Checks if the offer is pending
 * @param offer The offer object
 */
export function isOfferPending(offer: Offer) {
  return (
    !offer.accepted &&
    !offer.cancelled &&
    !offer.executed &&
    moment(offer.deadline).isAfter(moment())
  );
}

/**
 * Checks if the offer has expired
 * @param offer The offer object
 */
export function isOfferExpired(offer: Offer) {
  return (
    !offer.cancelled &&
    !offer.executed &&
    moment().isAfter(moment(offer.deadline))
  );
}

/**
 * Checks if the address is the offer's creator
 * @param offer The offer object
 * @param address The address to check
 */
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

/**
 * Returns the status of the dispute
 * @param dispute
 */
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

  // Stalled after dispute
  if (executed && getDisputeOutcome(dispute) == DisputeState.Stalled)
    return DisputeState.Stalled;

  // Cancelled after dispute
  if (executed && getDisputeOutcome(dispute) == DisputeState.Cancelled)
    return DisputeState.Cancelled;

  // Released after dispute
  if (executed && getDisputeOutcome(dispute) == DisputeState.Released)
    return DisputeState.Released;

  // Released (swap released before dispute execution)
  if (!executed && orderReleased) return DisputeState.Abandoned;

  // Abandoned (executed)
  if (executed && abandoned) return DisputeState.Abandoned;

  // Released without dispute
  if (!executed && released) return DisputeState.Released;

  // Draft phase
  if (!executed && !orderReleased && numMediators > numMediatorsDrafted) {
    return DisputeState.Draft;
  }

  // Evidence phase
  if (
    !executed &&
    !orderReleased &&
    numMediators == numMediatorsDrafted &&
    moment(evidenceEndAt).isAfter(moment())
  ) {
    return DisputeState.Evidence;
  }

  // Commit phase
  if (
    !executed &&
    !orderReleased &&
    numMediators == numMediatorsDrafted &&
    moment(evidenceEndAt).isBefore(moment()) &&
    moment(commitEndAt).isAfter(moment())
  ) {
    return DisputeState.Commit;
  }

  // Reveal phase
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

  // Awaiting dispute execution
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

  return "unknown";
}

/**
 * Checks if the address is one of the dispute's draftees.
 * @param dispute The dispute object
 * @param address The address to check
 */
export function isDisputeDraftee(dispute: Dispute, address: string) {
  return dispute.draftees.some((d) => isEqlStr(d.owner, address));
}

/**
 * Returns the outcome of the dispute
 * @param dispute The dispute object
 */
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

/**
 * Returns the number of votes for each outcome
 * @param dispute The dispute object
 */
export function countDisputeVotes(dispute: Dispute) {
  const { draftees, reveals } = dispute;
  const release = reveals.filter((r) => r.vote == "0x31");
  const cancel = reveals.filter((r) => r.vote == "0x30");
  const miss =
    draftees.length > reveals.length ? draftees.length - reveals.length : 0;
  return {
    release: release.length,
    cancel: cancel.length,
    miss,
  };
}

enum TicketState {
  Maturing = "maturing",
  Matured = "matured",
  Joined = "joined",
  Expired = "expired",
  Drafted = "drafted",
  Cancelled = "cancelled",
  Cancelling = "cancelling",
  Drained = "drained",
}

/**
 * Returns the status of the ticket
 * @param ticket The ticket object
 */
export function getTicketStatus(ticket: Ticket) {
  const {
    matureAt,
    joined,
    expired,
    matured,
    drained,
    drafted,
    cancelling,
    cancelled,
  } = ticket;
  if (!joined && drained) return TicketState.Drained;
  if (!joined && moment(matureAt).isAfter(moment()))
    return TicketState.Maturing;
  if (!joined && matured) return TicketState.Matured;
  if (joined && !drafted) return TicketState.Joined;
  if (joined && drafted) return TicketState.Drafted;
  if (!joined && expired) return TicketState.Expired;
  if (!joined && cancelling) return TicketState.Cancelling;
  if (!joined && cancelled) return TicketState.Cancelled;
}

/**
 * Checks if the address is either the provider or the taker or one of the dispute's draftees.
 * @param swap The swap object
 * @param address The address to check
 */
export function isSwapParticipant(swap: Swap, address: string) {
  return (
    isEqlStr(swap.provider, address) ||
    isEqlStr(swap.taker, address) ||
    swap.disputes.some((d) =>
      d.draftees.some((dr) => isEqlStr(dr.owner, address))
    )
  );
}

/**
 * Checks if the address is either the provider or the taker.
 * @param swap The swap object
 * @param address The address to check
 */
export function isSwapCounterparty(swap: Swap, address: string) {
  return isEqlStr(swap.provider, address) || isEqlStr(swap.taker, address);
}

/**
 * Checks if the address is one of the swap's dispute draftees.
 * @param swap The swap object
 * @param address The address to check
 * @param recent If true, only checks the most recent dispute
 */
export function isSwapDraftee(swap: Swap, address: string, recent = false) {
  if (recent) return isDisputeDraftee(swap.disputes[0], address);
  return swap.disputes.some((d) =>
    d.draftees.some((dr) => isEqlStr(dr.owner, address))
  );
}

/**
 * Checks if the swap has any disputes.
 * @param swap
 */
export function isDisputed(swap: Swap) {
  return swap.disputes.length > 0;
}

export function getDrafteeIndex(swap: Swap, address: string) {
  return swap.disputes[0].draftees.findIndex((d) => isEqlStr(d.owner, address));
}

/**
 * Returns the outcome of the swap's latest dispute.
 * @param swap
 */
export function getSwapDisputeOutcome(swap: Swap) {
  if (swap.disputes.length == 0 || !isSwapDisputeEnded(swap)) return "";
  return getDisputeOutcome(swap.disputes[0]);
}

/**
 * Checks if the swap's latest dispute has ended.
 * @param swap
 */
export function isSwapDisputeEnded(swap: Swap) {
  if (swap.disputes.length == 0) return false;
  return (
    swap.disputes[0].executed ||
    moment(swap.disputes[0].revealEndAt).isBefore(moment())
  );
}

/**
 * Checks if the swap's latest dispute has been executed.
 * @param swap The swap object
 */
export function isSwapDisputeExecuted(swap: Swap) {
  if (swap.disputes.length == 0) return false;
  return swap.disputes[0].executed;
}

/**
 * Checks if an address has committed a vote for a given dispute
 * @param dispute The dispute object
 * @param address The address to check
 */
export function isCommitter(dispute: Dispute, address: string) {
  return dispute.commits.some(
    (c) =>
      isEqlStr(c.committer, address) && c.ticketIndex == dispute.ticketIndex
  );
}

/**
 * Checks if an address has revealed a vote for a given dispute
 * @param dispute The dispute object
 * @param address The address to check
 */
export function isRevealer(dispute: Dispute, address: string) {
  return dispute.reveals.some(
    (r) => isEqlStr(r.revealer, address) && r.ticketIndex == dispute.ticketIndex
  );
}

export function getSwapCounterpart(swap: Swap, address: string) {
  if (isEqlStr(swap.provider, address)) return swap.taker;
  return swap.provider;
}

export function isProvider(swap: Swap, address: string) {
  return isEqlStr(swap.provider, address);
}
