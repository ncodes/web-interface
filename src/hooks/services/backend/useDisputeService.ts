import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

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
  const { getChainInfo } = useConnectorContext();

  /**
   * List disputes
   * @param ctx
   */
  async function listDisputes(
    ctx: QueryFunctionContext<[ListDisputeIDs, ListDisputeParams]>,
  ): Promise<{ disputes: Dispute[]; meta: { queryCount: number } }> {
    try {
      const [id, params] = ctx.queryKey;
      const { network, limit, disputeFilter, offset } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${getChainInfo().apiUrl}/v1/disputes`,
        params: {
          ...disputeFilter,
          net: network,
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
