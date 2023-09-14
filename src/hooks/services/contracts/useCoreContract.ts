import { useConnectorContext } from "../../connectors/context.tsx";
import { toBN } from "../../../libs/helpers.ts";
import { Address } from "viem";
import { BigNumberish } from "ethers";

/**
 * Providers utilities for reading and writing to the Core contract
 */
export default function useCoreContract() {
  const { simulateAndWriteContract, readContract } = useConnectorContext();

  /**
   * Check if a liquidity exist
   * @param market The market address
   * @param provider The liquidity provider address
   * @param lid The liquidity ID
   */
  async function hasLiquidity(market: string, provider: string, lid: number) {
    return await readContract("core", "hashLiquidity", [market, provider, lid]);
  }

  /**
   * Create a market
   * @param market The market address
   * @param lid The liquidity ID
   * @param deduct Whether to deduct from or add to the liquidity
   * @param target The target address
   * @param amount The amount to add or deduct
   * @param price The price of the liquidity
   * @param wantOrIds The want OR IDs for when quote is NFT
   * @param wantAndIds The want AND IDs for when quote is NFT
   * @param limits Limit parameters
   * @param limits.{0}: minSwap: The minimum swap amount for the sender's liquidity. Must be less than maxSwap.
   * @param limits.{1}: maxSwap: The maximum swap amount for the sender's liquidity. Must be greater than minSwap.
   * @param limits.{2}: timeToPay: The maximum seconds within which payer must make payment.
   * @param limits.{3}: expireAt: The transaction deadline
   * @param limits.{4}: pause: Indicate whether to pause the liquidity
   */
  async function updateFungibleLiquidity(
    market: string,
    lid: BigNumberish,
    deduct: boolean,
    target: Address,
    amount: string,
    price: string,
    wantOrIds: BigNumberish[] = [],
    wantAndIds: BigNumberish[] = [],
    limits: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ] = [0, 0, 0, 0, 0]
  ) {
    return simulateAndWriteContract("core", "updateFungibleLiquidity", [
      market,
      lid,
      deduct,
      target,
      [toBN(amount), toBN(price)],
      wantOrIds,
      wantAndIds,
      limits,
    ]);
  }

  /**
   * Set swap badges for a liquidity
   * @param market The market address
   * @param lid The liquidity ID
   * @param swapBadges The swap badges
   */
  async function setSwapBadgeForLiquidity(
    market: string,
    lid: BigNumberish,
    swapBadges: string[][]
  ) {
    return simulateAndWriteContract("core", "setSwapBadgeForLiquidity", [
      market,
      lid,
      swapBadges,
    ]);
  }

  /**
   * Parse transaction error into human-friendly message
   * @param error The error object
   */
  function humanizeErrors(error: { message: string } | unknown) {
    if (error instanceof Error) {
      // setSwapBadgeForLiquidity
      if (error.message.includes("OC: ZERO_LIQ"))
        return "Cannot perform action on empty liquidity";

      // updateFungibleLiquidity: MKT_BADGE_REQ
      if (error.message.includes("OC: MKT_BADGE_REQ"))
        return "Permission denied: Missing one or more market badges";

      // Common
      if (error.message.includes("ERC20: transfer amount exceeds balance"))
        return "Insufficient balance";
    }

    return "Transaction failed";
  }

  return {
    updateFungibleLiquidity,
    hasLiquidity,
    setSwapBadgeForLiquidity,
    humanizeErrors,
  };
}
