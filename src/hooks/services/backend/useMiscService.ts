import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";

export interface GetCryptoRateParams {
  net: string;
  symbolOrAddress: string;
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

  return {
    getCryptoRate,
  };
}
