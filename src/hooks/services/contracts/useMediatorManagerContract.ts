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
   * Join a ticket to it's assigned pool
   * @param ticketId The ticket ID
   * @returns
   */
  async function join(ticketId: bigint) {
    return simulateAndWriteContract("mediatorManager", "join", [ticketId]);
  }

  /**
   * Cancel a ticket
   * @param ticketId The ticket ID
   * @returns
   */
  async function cancelTicket(ticketId: bigint) {
    return simulateAndWriteContract("mediatorManager", "cancelTicket", [
      ticketId,
    ]);
  }

  /**
   * Drain a ticket of its bond
   * @param ticketId The ticket ID
   * @returns
   */
  async function drainTicket(ticketId: bigint) {
    return simulateAndWriteContract("mediatorManager", "drainTicket", [
      ticketId,
    ]);
  }

  /**
   * Parse transaction error into human-friendly message
   * @param _error The error object
   */
  function humanizeErrors(_error: { message: string } | unknown): string {
    return "Transaction failed";
  }

  return {
    purchaseTicket,
    getTicketPrice,
    join,
    cancelTicket,
    drainTicket,
    humanizeErrors,
  };
}
