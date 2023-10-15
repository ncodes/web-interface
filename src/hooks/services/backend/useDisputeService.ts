import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { DisputeFilter } from "../../store/useStore.ts";

export interface ListDisputeParams {
  network: string;
  limit: number;
  offset: number;
  connectedAddress?: string;
  disputeFilter: DisputeFilter;
}

export type ListDisputeIDs = "getDisputesAsParticipant";

/**
 * useDisputeService provides access to v1/disputes endpoints
 */
export function useDisputeService() {
  /**
   * List disputes
   * @param ctx
   */
  async function listDisputes(
    ctx: QueryFunctionContext<[ListDisputeIDs, ListDisputeParams]>
  ): Promise<{ disputes: Dispute[]; meta: { queryCount: number } }> {
    try {
      const [id, params] = ctx.queryKey;
      const { network, limit, disputeFilter, offset } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/disputes`,
        params: {
          ...disputeFilter,
          net: "ethereum" || network, // TODO: remove mock
          offset,
          limit,
          participant:
            id == "getDisputesAsParticipant" && params.connectedAddress
              ? params.connectedAddress
              : undefined,
        },
        headers,
      });

      return Promise.resolve({
        disputes: resp.data.data,
        meta: resp.data.meta,
      });
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    listDisputes,
  };
}
