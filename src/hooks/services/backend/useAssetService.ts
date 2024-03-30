import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

/**
 * useAssetService provides access to v1/assets endpoint
 */
export function useAssetService() {
  const { getChainInfo } = useConnectorContext();

  /**
   * Get swappable token list
   */
  async function getList(
    ctx: QueryFunctionContext<[string, { network: string }]>,
  ): Promise<AssetInfo[]> {
    try {
      const [, params] = ctx.queryKey;
      const headers = {};

      const resp = await axios({
        method: "get",
        url: `${getChainInfo().apiUrl}/v1/assets/${params.network}`,
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
