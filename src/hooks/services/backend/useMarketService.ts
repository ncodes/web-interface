import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";
import { MarketFilter } from "../../store/useStore.ts";

export type ListMarketsIDs = "getMarkets" | "getMarketsByCreator";
export interface ListMarketsParams {
  network: string;
  marketFilter: MarketFilter;
  limit: number;
  offset: number;
  connectedAddress?: string;
}

type GetMarketID = "getMarket";
export interface GetMarketParams {
  network: string;
  market: string;
}

/**
 * useMarketService provides access to v1/markets endpoints
 */
export function useMarketService() {
  /**
   * Get markets
   */
  async function listMarkets(
    ctx: QueryFunctionContext<[ListMarketsIDs, ListMarketsParams]>
  ): Promise<{ markets: Market[]; meta: { queryCount: number } }> {
    try {
      const [id, params] = ctx.queryKey;
      const { network, marketFilter, limit, offset } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/markets`,
        params: {
          ...marketFilter,
          net: network,
          offset,
          limit,
          creator:
            id == "getMarketsByCreator" && params.connectedAddress
              ? params.connectedAddress
              : undefined,
        },
        headers,
      });

      return Promise.resolve({ markets: resp.data.data, meta: resp.data.meta });
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get market
   */
  async function getMarket(
    ctx: QueryFunctionContext<[GetMarketID, GetMarketParams]>
  ): Promise<Market> {
    try {
      const [, params] = ctx.queryKey;
      const { network, market } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/markets/${market}`,
        params: {
          net: network,
        },
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    listMarkets,
    getMarket,
  };
}
