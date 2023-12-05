import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

/**
 * Providers utilities for reading and writing to the NFT contract
 */
export default function useNFTContract() {
  const { readContract } = useConnectorContext();

  /**
   * Get the token balance of an address
   * @returns The target address to check
   */
  async function balanceOf(address: string): Promise<bigint> {
    return readContract("nft", "balanceOf", [address]);
  }

  /**
   * Parse transaction error into human-friendly message
   * @param _error The error object
   */
  function humanizeErrors(_error: { message: string } | unknown): string {
    return "Transaction failed";
  }

  return {
    balanceOf,
    humanizeErrors,
  };
}
