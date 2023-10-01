import { DisputeStruct } from "../../../typechain/DisputeManager.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

/**
 * Providers utilities for reading and writing to the Dispute Manager contract
 */
export default function useDisputeManagerContract() {
  const { simulateAndWriteContract, readContract } = useConnectorContext();

  /**
   * Create a dispute
   * @param orderId The order ID
   * @param wantRelease Whether to release the order or not
   */
  async function createDispute(orderId: bigint, wantRelease: boolean) {
    return simulateAndWriteContract("disputeManager", "createDispute", [
      orderId,
      wantRelease,
    ]);
  }

  /**
   * Commit a vote
   * @param orderId The order ID
   * @param ticketIdx The ticket index
   * @param hash The vote hash
   */
  async function commitVote(orderId: number, ticketIdx: number, hash: string) {
    return simulateAndWriteContract("disputeManager", "commitVote", [
      orderId,
      ticketIdx,
      hash,
    ]);
  }

  /**
   * Reveal a vote
   * @param orderId The order ID
   * @param ticketIdx The ticket index
   * @param vote The vote
   * @param hash The vote hash from the commit phase
   */
  async function revealVote(
    orderId: number,
    ticketIdx: number,
    vote: string,
    hash: string
  ) {
    return simulateAndWriteContract("disputeManager", "revealVote", [
      orderId,
      ticketIdx,
      vote,
      hash,
    ]);
  }

  /**
   * Get a dispute
   * @param orderId The order ID
   * @param disputeId The dispute ID
   */
  async function getDispute(
    orderId: bigint,
    disputeId: bigint
  ): Promise<DisputeStruct | undefined> {
    try {
      return await readContract("disputeManager", "getDispute", [
        orderId,
        disputeId,
      ]);
    } catch (e: unknown) {
      if ((e as { message: string }).message.includes("out-of-bounds"))
        return undefined;
      throw e;
    }
  }

  /**
   * Count disputes for an order
   * @param orderId The order ID
   */
  async function countDisputes(orderId: bigint): Promise<bigint> {
    return await readContract("disputeManager", "countDisputes", [orderId]);
  }

  /**
   * Get the most recent dispute for an order
   * @param orderId The order ID
   */
  async function getRecentDispute(orderId: bigint) {
    const count = await countDisputes(orderId);
    if (count == BigInt(0)) return undefined;
    return getDispute(orderId, count - BigInt(1));
  }

  /**
   * Parse transaction error into human-friendly message
   * @param error The error object
   */
  function humanizeErrors(error: { message: string } | unknown): string {
    if (error instanceof Error) {
      if (error.message.includes("DM: NOT_ALLOWED"))
        return "Cannot start a dispute at this time";
    }

    return "Transaction failed";
  }

  return {
    createDispute,
    getDispute,
    getRecentDispute,
    countDisputes,
    commitVote,
    revealVote,
    humanizeErrors,
  };
}
