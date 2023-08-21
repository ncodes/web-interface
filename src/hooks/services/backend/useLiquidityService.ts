import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";
import { LiquidityFilter } from "../../store/useStore.ts";

export interface ListLiquidityParams {
  network: string;
  limit: number;
  offset: number;
  connectedAddress?: string;
  liquidityFilter: LiquidityFilter;
}

export type ListLiquidityIDs = "getLiquidity" | "getLiquidityByCreator";

/**
 * useLiquidityService provides access to v1/liquidities endpoints
 */
export function useLiquidityService() {
  /**
   * List liquidities
   * @param ctx
   */
  async function listLiquidities(
    ctx: QueryFunctionContext<[ListLiquidityIDs, ListLiquidityParams]>
  ): Promise<{ liquidities: Liquidity[]; meta: { queryCount: number } }> {
    try {
      const [id, params] = ctx.queryKey;
      const { network, limit, liquidityFilter, offset } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/liquidities`,
        params: {
          ...liquidityFilter,
          net: network,
          offset,
          limit,
          provider:
            id == "getLiquidityByCreator" && params.connectedAddress
              ? params.connectedAddress
              : undefined,
        },
        headers,
      });

      return Promise.resolve({
        liquidities: resp.data.data,
        meta: resp.data.meta,
      });
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    listLiquidities,
  };
}
