import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";
import { SwapFilter } from "../../store/useStore.ts";
import moment from "moment";

export type ListSwapIDs = "getSwapsAsParticipant";
export interface ListSwapParams {
  network: string;
  limit: number;
  offset: number;
  connectedAddress?: string;
  swapFilter: SwapFilter;
}

interface GetSwapParams {
  network: string;
  orderId: string;
}

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

  /**
   * Get a swap
   * @param ctx The query context
   */
  async function getSwap(
    ctx: QueryFunctionContext<[string, GetSwapParams]>
  ): Promise<Swap> {
    try {
      const [, params] = ctx.queryKey;
      const { network, orderId } = params;
      const headers = {};
      const resp = await axios<{ data: Swap }>({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/swaps/${orderId}`,
        params: {
          net: network,
        },
        headers,
      });

      const swap = resp.data.data;
      // swap.cancelled = true;
      // swap.paid = true;
      // swap.released = true;
      swap.cancelAt = moment().add(10, "d").toISOString();
      // swap.disputeFrom = moment().add(10, "s").toISOString();
      swap.disputes = [];
      // swap.disputes[0].creator = "0x123";
      // swap.disputes[0].draftees[0].owner = "0x123";
      // swap.disputes[0].wantRelease = false;
      // swap.disputes[0].numMediators = 3;
      // swap.disputes[0].numMediatorsDrafted = 3;
      // swap.disputes[0].executed = true;
      // swap.disputes[0].released = undefined;
      // swap.disputes[0].evidenceEndAt = moment().add(10, "s").toISOString();
      // swap.disputes[0].commitEndAt = moment().add(15, "s").toISOString();
      // swap.disputes[0].revealEndAt = moment().add(20, "s").toISOString();
      // swap.disputes[0].reveals = [
      //   { vote: "0x31" },
      //   { vote: "0x30" },
      //   { vote: "0x31" },
      // ];
      // setTimeout(() => {
      //   swap.disputes[0].executed = true;
      //   console.log("EXEC");
      // }, 30000);
      // swap.disputes[0].draftees[0].owner =
      //   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      // swap.disputeFrom = moment().add(10, "s").toISOString();
      // swap.cancelAt = moment().add(10, "s").toISOString();
      // swap.taker = "0x123";
      // swap.provider = "0x1ba";
      // swap.provider = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    listSwaps,
    getSwap,
  };
}
