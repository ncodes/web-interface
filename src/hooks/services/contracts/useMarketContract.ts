import { useConnectorContext } from "../../connectors/context.tsx";
import { toBN } from "../../../libs/helpers.ts";
import { AssetType } from "../../../types/enums.ts";

/**
 * Providers utilities for reading and writing to the market contract
 */
export default function useMarketContract() {
  const { simulateAndWriteContract } = useConnectorContext();

  /**
   * Create a market
   * @param baseAddress The base asset address
   * @param quoteAddress The quote asset address
   * @param baseType The base asset type
   * @param quoteType The quote asset type
   * @param permPut Whether to enable permissioned liquidity provisioning
   * @param permSwap Whether to enable permissioned swaps
   * @param commission The commission rate
   * @param poolId The mediation pool ID
   */
  async function createMarket(
    baseAddress: string,
    quoteAddress: string,
    baseType: AssetType,
    quoteType: AssetType,
    permPut: boolean,
    permSwap: boolean,
    commission: number,
    poolId: number
  ) {
    return simulateAndWriteContract("marketCore", "createMarket", [
      baseAddress,
      quoteAddress,
      baseType,
      quoteType,
      permPut,
      permSwap,
      toBN(commission),
      toBN(poolId),
    ]);
  }

  /**
   * Set the commission rate
   * @param market The market address
   * @param commission The commission rate
   */
  async function setCommission(market: string, commission: number) {
    return simulateAndWriteContract("marketCore", "setCommission", [
      market,
      toBN(commission),
    ]);
  }

  /**
   * Set the dispute durations
   * @param market The market address
   * @param disputeDelayDur The dispute delay duration
   * @param evidenceDur The evidence duration
   * @param predictDur The prediction duration
   */
  async function setDisputeDurations(
    market: string,
    disputeDelayDur: number,
    evidenceDur: number,
    predictDur: number
  ) {
    return simulateAndWriteContract("marketCore", "setDisputeDurations", [
      market,
      toBN(disputeDelayDur),
      toBN(evidenceDur),
      toBN(predictDur),
    ]);
  }

  /**
   * Set the manager
   * @param market The market address
   * @param newMgr The new manager address
   */
  async function setManager(market: string, newMgr: string) {
    return simulateAndWriteContract("marketCore", "setManager", [
      market,
      newMgr,
    ]);
  }

  /**
   * Mark a market as offer-only
   * @param market The market address
   */
  async function markAsOfferOnly(market: string) {
    return simulateAndWriteContract("marketCore", "markAsOfferOnly", [market]);
  }

  /**
   * Allow zero liquidity price
   * @param market
   */
  async function allowZeroOfferPrice(market: string) {
    return simulateAndWriteContract("marketCore", "allowZeroOfferPrice", [
      market,
    ]);
  }

  /**
   * Set required badges
   * @param market The market address
   * @param put The required PUT badges
   * @param swap The required SWAP badges
   */
  async function setRequiredBadges(
    market: string,
    put: string[][],
    swap: string[][]
  ) {
    return simulateAndWriteContract("marketCore", "setRequiredBadges", [
      market,
      put,
      swap,
    ]);
  }

  /**
   * Transfer ownership
   * @param market The market address
   * @param newOwner The new owner address
   */
  async function transferOwnership(market: string, newOwner: string) {
    return simulateAndWriteContract("marketCore", "transferOwnership", [
      market,
      newOwner,
    ]);
  }

  /**
   * Parse transaction error into human-friendly message
   * @param error The error object
   */
  function humanizeErrors(error: { message: string } | unknown) {
    if (error instanceof Error) {
      // Create market errors
      if (error.message.includes("MC: MARKET_EXIST"))
        return "Market already exists";
      if (error.message.includes("MC: ZERO_BASE"))
        return "Base asset cannot be zero address";
      if (error.message.includes("MC: ZERO_QUOTE"))
        return "Quote asset cannot be zero address";

      // Set commission errors
      if (error.message.includes("MC: UNKNOWN_MARKET"))
        return "Market does not exist";
      if (error.message.includes("MC: INVALID"))
        return "Invalid commission rate";

      // Common errors
      if (error.message.includes("MC: NOT_CREATOR"))
        return "Not permitted; User is not the owner";
      if (error.message.includes("User denied transaction signature"))
        return "User denied transaction signature";
    }
    return "Transaction failed";
  }

  return {
    createMarket,
    humanizeErrors,
    setCommission,
    setDisputeDurations,
    setManager,
    markAsOfferOnly,
    allowZeroOfferPrice,
    setRequiredBadges,
    transferOwnership,
  };
}
