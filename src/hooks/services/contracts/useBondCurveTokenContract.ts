import { TransactionExecutionError } from "viem";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

/**
 * Providers utilities for reading and writing to the free token contract
 */
export default function useBondCurveTokenContract() {
  const { readContract, simulateAndWriteContract } = useConnectorContext();

  async function claim(
    proof: string[],
    address: string,
    claimId: bigint,
    amount: bigint,
  ) {
    const res = await simulateAndWriteContract("token", "claim", [
      proof,
      address,
      claimId,
      amount,
    ]);
    return res[0];
  }

  async function claimMulti(
    proofs: string[][],
    address: string,
    claimIds: bigint[],
    amounts: bigint[],
  ) {
    return simulateAndWriteContract("token", "claimMulti", [
      proofs,
      address,
      claimIds,
      amounts,
    ]);
  }

  async function claims(address: string): Promise<bigint> {
    return readContract("token", "claims", [address]);
  }

  async function getCirculatingSupply() {
    return readContract("token", "circulatingSupply", []);
  }

  async function getBuyPrice(): Promise<bigint> {
    const supply = await getCirculatingSupply();
    return readContract("token", "buyPrice", [supply]);
  }

  async function getBondCurveAllocation(): Promise<bigint> {
    return readContract("token", "bondingCurveAlloc", []);
  }

  async function getTotalClaimed(): Promise<bigint> {
    return readContract("token", "claimedBalance", []);
  }

  async function buy(amount: bigint, maxPrice: bigint) {
    return simulateAndWriteContract(
      "token",
      "buy",
      [maxPrice],
      false,
      1,
      amount,
    );
  }

  async function withdrawClaim() {
    return simulateAndWriteContract("token", "withdrawClaim", []);
  }

  async function getInitialBondCurveAlloc(): Promise<bigint> {
    return readContract("token", "initialBondingCurveAlloc", []);
  }

  async function getBondingCurveTokenAlloc(): Promise<bigint> {
    return readContract("token", "bondingCurveAlloc", []);
  }

  async function getTotalBought(): Promise<bigint> {
    const initialAlloc = await getInitialBondCurveAlloc();
    const bondingCurveAlloc = await getBondingCurveTokenAlloc();
    return initialAlloc - bondingCurveAlloc;
  }

  /**
   * Parse transaction error into human-friendly message
   * @param error The error object
   */
  function humanizeErrors(error: { message: string } | unknown) {
    const execError = error instanceof TransactionExecutionError;
    if (execError && error.message.includes("User rejected the request")) {
      return "Transaction was rejected";
    }

    if (
      execError &&
      error.message.includes("replacement transaction underpriced")
    ) {
      return "Rejected: Not enough gas to replace pending tx";
    }

    if (error instanceof Error) {
      if (error.message.includes("CLAIM_USED"))
        return "One or more of the claims have already been used. Buy more tokens from the liquidity market to reset claim.";

      if (error.message.includes("WITHDRAW_NOT_ALLOWED"))
        return "Withdrawal is currently not allowed";

      if (error.message.includes("CLAIM_NOT_ALLOWED"))
        return "Claiming is not currently allowed";
    }

    return "Transaction failed";
  }

  return {
    claim,
    claimMulti,
    claims,
    withdrawClaim,
    getBuyPrice,
    getBondCurveAllocation,
    getTotalClaimed,
    getTotalBought,
    humanizeErrors,
    buy,
  };
}
