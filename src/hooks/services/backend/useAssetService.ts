import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";

/**
 * useAssetService provides access to v1/assets endpoint
 */
export function useAssetService() {
  /**
   * Get swappable token list
   */
  async function getList(
    ctx: QueryFunctionContext<[string, { network: string }]>
  ): Promise<AssetInfo[]> {
    try {
      const [, params] = ctx.queryKey;
      const headers = {};

      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/assets/${params.network}`,
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    getList,
  };
}
