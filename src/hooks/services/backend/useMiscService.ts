import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";

export interface GetCryptoRateParams {
  net: string;
  symbolOrAddress: string;
  symbol: string;
}

export interface GetMediatorPoolsParams {
  network: string;
}

/**
 * useMiscService provides access to v1/misc endpoint
 */
export function useMiscService() {
  /**
   * Get crypto USD rate
   */
  async function getCryptoRate(
    ctx: QueryFunctionContext<[string, GetCryptoRateParams]>
  ): Promise<number> {
    try {
      const [, params] = ctx.queryKey;
      const headers = {};

      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/misc/crypto-rate/${
          params.net
        }/${params.symbolOrAddress}`,
        headers,
      });

      return Promise.resolve(resp.data.data.price);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get synthetic USD rate
   */
  async function getSynthRate(
    ctx: QueryFunctionContext<[string, GetSynthRateParams]>
  ): Promise<number> {
    try {
      const [, params] = ctx.queryKey;
      const headers = {};

      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/misc/synth-rate/${
          params.symbol
        }`,
        headers,
      });

      return Promise.resolve(resp.data.data.price);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get mediator pools
   * @param ctx The query function context
   * @returns
   */
  async function getMediatorPools(
    ctx: QueryFunctionContext<[string, GetMediatorPoolsParams]>
  ): Promise<MediatorPool[]> {
    try {
      const [, params] = ctx.queryKey;
      const { network } = params;
      const headers = {};

      const apiUrl = import.meta.env.VITE_API_URI;
      const resp = await axios({
        method: "get",
        url: `${apiUrl}/v1/misc/${network}/mediator-pools`,
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    getCryptoRate,
    getSynthRate,
    getMediatorPools,
  };
}
