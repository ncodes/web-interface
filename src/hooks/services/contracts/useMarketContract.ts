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
    return await simulateAndWriteContract("marketCore", "createMarket", [
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
   * Parse transaction error into human-friendly message
   * @param error The error object
   */
  function humanizeErrors(error: { message: string } | unknown) {
    if (error instanceof Error) {
      if (error.message.includes("MARKET_EXIST"))
        return "Market already exists";
      if (error.message.includes("ZERO_BASE"))
        return "Base asset cannot be zero address";
      if (error.message.includes("ZERO_QUOTE"))
        return "Quote asset cannot be zero address";
      if (error.message.includes("User denied transaction signature"))
        return "User denied transaction signature";
    }
    return "Transaction failed";
  }

  return {
    createMarket,
    humanizeErrors,
  };
}
