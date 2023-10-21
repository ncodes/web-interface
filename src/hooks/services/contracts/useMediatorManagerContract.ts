import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

/**
 * Providers utilities for reading and writing to the Mediator Manager contract
 */
export default function useMediatorManagerContract() {
  const { simulateAndWriteContract, readContract } = useConnectorContext();

  /**
   * Purchase a ticket
   * @param poolId The pool ID
   */
  async function purchaseTicket(poolId: bigint) {
    return simulateAndWriteContract("mediatorManager", "purchaseTicket", [
      poolId,
    ]);
  }

  /**
   * Get the current price of a ticket
   * @returns The price of a ticket
   */
  async function getTicketPrice(): Promise<bigint> {
    return readContract("mediatorManager", "getTicketPrice", []);
  }

  /**
   * Parse transaction error into human-friendly message
   * @param error The error object
   */
  function humanizeErrors(error: { message: string } | unknown): string {
    return "Transaction failed";
  }

  return {
    purchaseTicket,
    getTicketPrice,
    humanizeErrors,
  };
}
