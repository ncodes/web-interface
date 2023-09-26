import { useConnectorContext } from "../../connectors/context.tsx";
import { toBN } from "../../../libs/helpers.ts";
import { Address } from "viem";
import { BigNumberish, ethers } from "ethers";
import { Structs } from "../../../typechain/Core.ts";
import OrderStruct = Structs.OrderStruct;

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
    const res = await simulateAndWriteContract(
      "core",
      "updateFungibleLiquidity",
      [
        market,
        lid,
        deduct,
        target,
        [toBN(amount), toBN(price)],
        wantOrIds,
        wantAndIds,
        limits,
      ]
    );
    return res[0];
  }

  /**
   * Initiate a swap
   * @param marketId The market addres
   * @param provider The liquidity provider address
   * @param recipient The recipient address
   * @param lid The liquidity ID
   * @param amount The amount to swap
   * @param maxPrice The maximum price
   * @param ids The NFT IDs
   * @param txDeadline The transaction deadline
   * @param operator The operator ID
   */
  async function swapQuoteForBase(
    marketId: string,
    provider: string,
    recipient = ethers.constants.AddressZero,
    lid: BigNumberish,
    amount: BigNumberish,
    maxPrice: BigNumberish,
    ids: BigNumberish[] = [],
    txDeadline: BigNumberish,
    operator: BigNumberish = 0
  ) {
    return await simulateAndWriteContract("core", "swapQuoteForBase", [
      marketId,
      provider,
      recipient,
      lid,
      amount,
      maxPrice,
      ids,
      txDeadline,
      operator,
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
    const res = await simulateAndWriteContract(
      "core",
      "setSwapBadgeForLiquidity",
      [market, lid, swapBadges]
    );
    return res[0];
  }

  /**
   * Compute swap fee
   * @param mid The market ID
   * @param provider The liquidity provider address
   * @param lid The liquidity ID
   * @param taker The taker address
   * @param orderAmt The order amount
   * @param orderPrice The order price
   */
  async function computeSwapFee(
    mid: string,
    provider: string,
    lid: number,
    taker: string,
    orderAmt: BigNumberish,
    orderPrice: BigNumberish
  ): Promise<{
    protocolFee: bigint;
    marketFee: bigint;
    feeBp: bigint;
    marketFeeBp: bigint;
  }> {
    const res: [bigint, bigint, bigint, bigint] = await readContract(
      "core",
      "computeSwapFee",
      [mid, provider, lid, taker, orderAmt, orderPrice]
    );
    return {
      protocolFee: res[0],
      marketFee: res[1],
      feeBp: res[2],
      marketFeeBp: res[3],
    };
  }

  /**
   * Cancel an order
   * @param orderId The order ID
   */
  async function cancelOrder(orderId: bigint) {
    return (
      await simulateAndWriteContract("core", "cancelOrder", [orderId])
    )[0];
  }

  /**
   * Mark an order as paid
   * @param orderId The order ID
   */
  async function markOrderAsPaid(orderId: bigint) {
    return (
      await simulateAndWriteContract("core", "markOrderAsPaid", [orderId])
    )[0];
  }

  /**
   * Release an order
   * @param orderId The order ID
   */
  async function releaseOrder(orderId: bigint) {
    return (
      await simulateAndWriteContract("core", "releaseOrder", [orderId])
    )[0];
  }

  /**
   * Get an order
   * @param orderId The order ID
   */
  async function getOrder(orderId: number): Promise<OrderStruct> {
    return readContract("core", "getOrder", [orderId]);
  }

  /**
   * Parse transaction error into human-friendly message
   * @param error The error object
   */
  function humanizeErrors(error: { message: string } | unknown): string {
    if (error instanceof Error) {
      // setSwapBadgeForLiquidity
      if (error.message.includes("OC: ZERO_LIQ"))
        return "Cannot perform action on empty liquidity";

      // updateFungibleLiquidity: MKT_BADGE_REQ
      if (error.message.includes("OC: MKT_BADGE_REQ"))
        return "Permission denied: Missing one or more market badges";
      if (error.message.includes("OC: LOW_TTP"))
        return "Payment time is too short";

      // swapQuoteForBase
      if (error.message.includes("OC: OFFER_EXPIRED_TX"))
        return "Transaction expired";

      // cancelOrder
      if (error.message.includes("OC: NOT_CANCEL_TIME"))
        return "Cannot cancel order at this time";

      // Common
      if (error.message.includes("ERC20: transfer amount exceeds balance"))
        return "Insufficient balance";
    }

    return "Transaction failed";
  }

  return {
    updateFungibleLiquidity,
    hasLiquidity,
    getOrder,
    swapQuoteForBase,
    computeSwapFee,
    setSwapBadgeForLiquidity,
    humanizeErrors,
    cancelOrder,
    markOrderAsPaid,
    releaseOrder,
  };
}
