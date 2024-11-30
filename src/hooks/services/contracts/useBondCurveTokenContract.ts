import { TransactionExecutionError } from "viem";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

/**
 * Providers utilities for reading and writing to the bond curve distro contract
 */
export default function useBondCurveDistroContract() {
  const { readContract, simulateAndWriteContract } = useConnectorContext();

  async function claim(
    amount: bigint,
    claimId: bigint,
    nonce: bigint,
    signature: string,
  ) {
    const res = await simulateAndWriteContract("bondCurveDistro", "claim", [
      amount,
      claimId,
      nonce,
      signature,
    ]);
    return res[0];
  }

  async function claimMulti(
    signatures: string[],
    claimIds: bigint[],
    nonces: bigint[],
    amounts: bigint[],
  ) {
    return simulateAndWriteContract("bondCurveDistro", "claimMulti", [
      signatures,
      claimIds,
      nonces,
      amounts,
    ]);
  }

  async function claims(address: string): Promise<bigint> {
    return readContract("bondCurveDistro", "claims", [address]);
  }

  async function getCirculatingSupply() {
    return readContract("bondCurveDistro", "circulatingSupply", []);
  }

  async function getBuyPrice(): Promise<bigint> {
    const supply = await getCirculatingSupply();
    return readContract("bondCurveDistro", "buyPrice", [supply]);
  }

  async function getBondCurveAllocation(): Promise<bigint> {
    return readContract("bondCurveDistro", "bondingCurveAlloc", []);
  }

  async function getTotalClaimed(): Promise<bigint> {
    return readContract("bondCurveDistro", "claimedBalance", []);
  }

  async function buy(amount: bigint, maxPrice: bigint) {
    return simulateAndWriteContract(
      "bondCurveDistro",
      "buy",
      [maxPrice],
      false,
      1,
      amount,
    );
  }

  async function withdrawClaim() {
    return simulateAndWriteContract("bondCurveDistro", "withdrawClaim", []);
  }

  async function getInitialBondCurveAlloc(): Promise<bigint> {
    return readContract("bondCurveDistro", "initialBondingCurveAlloc", []);
  }

  async function getBondingCurveTokenAlloc(): Promise<bigint> {
    return readContract("bondCurveDistro", "bondingCurveAlloc", []);
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
      if (
        error.message.includes("CLAIM_USED") ||
        error.message.includes("NONCE_USED")
      )
        return "One or more of the claims have already been used";

      if (error.message.includes("WITHDRAW_NOT_ALLOWED"))
        return "Withdrawal is currently not allowed";

      if (error.message.includes("CLAIM_NOT_ALLOWED"))
        return "Claiming is not currently allowed";

      if (error.message.includes("TRADE_NOT_ALLOWED"))
        return "Market is not currently open";

      if (error.message.includes("INVALID_SIG"))
        return "Invalid claim signature";
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
