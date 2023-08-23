import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";
import { SwapFilter } from "../../store/useStore.ts";

export interface ListSwapParams {
  network: string;
  limit: number;
  offset: number;
  connectedAddress?: string;
  swapFilter: SwapFilter;
}

export type ListSwapIDs = "getSwapsAsParticipant";

/**
 * useSwapService provides access to v1/swaps endpoints
 */
export function useSwapService() {
  /**
   * List swaps
   * @param ctx
   */
  async function listSwaps(
    ctx: QueryFunctionContext<[ListSwapIDs, ListSwapParams]>
  ): Promise<{ swaps: Swap[]; meta: { queryCount: number } }> {
    try {
      const [id, params] = ctx.queryKey;
      const { network, limit, swapFilter, offset } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/swaps`,
        params: {
          ...swapFilter,
          net: network,
          offset,
          limit,
          address:
            id == "getSwapsAsParticipant" && params.connectedAddress
              ? params.connectedAddress
              : undefined,
        },
        headers,
      });

      // resp.data.data[0].disputes = [];
      // resp.data.data[0].disputes[0].executed = true;
      // resp.data.data[0].disputes[0].abandoned = true;
      // resp.data.data[0].paid = true;
      // resp.data.data[0].released = false;
      // resp.data.data[0].cancelled = true;
      // resp.data.data[0].cancelled = true;
      // resp.data.data[0].finalizedAt = moment().toISOString();
      // resp.data.data[0].provider = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      // resp.data.data[0].taker = "0x1787BaB2743467E874ee133ADd46884e0A32ccB5";

      return Promise.resolve({
        swaps: resp.data.data,
        meta: resp.data.meta,
      });
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    listSwaps,
  };
}
