import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

/**
 * Providers utilities for reading and writing to the native token contract
 */
export default function useNativeTokenContract() {
  const { simulateAndWriteContract, readContract } = useConnectorContext();

  /**
   * Create a dispute
   * @param orderId The order ID
   * @param wantRelease Whether to release the order or not
   */
  // async function createDispute(orderId: bigint, wantRelease: boolean) {
  //   return simulateAndWriteContract("disputeManager", "createDispute", [
  //     orderId,
  //     wantRelease,
  //   ]);
  // }

  /**
   * Parse transaction error into human-friendly message
   * @param error The error object
   */
  function humanizeErrors(error: { message: string } | unknown): string {
    // if (error instanceof Error) {
    //   if (error.message.includes("DM: NOT_ALLOWED"))
    //     return "Cannot start a dispute at this time";
    // }

    return "Transaction failed";
  }

  return {
    humanizeErrors,
  };
}
