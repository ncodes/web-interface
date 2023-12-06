import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

export interface GetCryptoRateParams {
  net: string;
  symbolOrAddress: string;
  symbol: string;
}

export interface GetMediatorPoolsParams {
  network: string;
}

interface GetSynthRateParams {
  symbol: string;
}

export interface GetProtocolFeesParams {
  network: string;
}

export interface GetTokenInfoParams {
  network?: string;
  address: string;
}

/**
 * useMiscService provides access to v1/misc endpoint
 */
export function useMiscService() {
  const { getChainInfo } = useConnectorContext();

  /**
   * Get crypto USD rate
   */
  async function getCryptoRate(
    ctx: QueryFunctionContext<[string, GetCryptoRateParams]>,
  ): Promise<number> {
    try {
      const [, params] = ctx.queryKey;
      const headers = {};

      const resp = await axios({
        method: "get",
        url: `${getChainInfo().apiUrl}/v1/misc/crypto-rate/${params.net}/${
          params.symbolOrAddress
        }`,
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
    ctx: QueryFunctionContext<[string, GetSynthRateParams]>,
  ): Promise<number> {
    try {
      const [, params] = ctx.queryKey;
      const headers = {};

      const resp = await axios({
        method: "get",
        url: `${getChainInfo().apiUrl}/v1/misc/synth-rate/${params.symbol}`,
        headers,
      });

      return Promise.resolve(resp.data.data.price);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get protocol fees
   * @param ctx The query function context
   * @returns
   */
  async function getProtocolFees(
    ctx: QueryFunctionContext<[string, GetProtocolFeesParams]>,
  ): Promise<ProtocolFees> {
    try {
      const [, params] = ctx.queryKey;
      const { network } = params;
      const headers = {};

      const apiUrl = getChainInfo().apiUrl;
      const resp = await axios({
        method: "get",
        url: `${apiUrl}/v1/misc/${network}/protocol-fees`,
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get token information
   * @param ctx The query function context
   * @returns
   */
  async function getTokenInfo(
    ctx: QueryFunctionContext<[string, GetTokenInfoParams]>,
  ): Promise<TokenInfo> {
    try {
      const [, params] = ctx.queryKey;
      const { network, address } = params;
      const headers = {};

      const apiUrl = getChainInfo().apiUrl;
      const resp = await axios({
        method: "get",
        url: `${apiUrl}/v1/misc/token-info/${network || "-"}/${address}`,
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
    getProtocolFees,
    getTokenInfo,
  };
}
