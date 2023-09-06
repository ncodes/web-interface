import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";
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

      // resp.data.data[0].executed = true;
      // resp.data.data[0].released = null;
      // resp.data.data[0].numMediators = 3;
      // resp.data.data[0].numMediatorsDrafted = 3;
      // resp.data.data[0].evidenceEndAt = moment().add(10, "s").toISOString();
      // resp.data.data[0].commitEndAt = moment().add(20, "s").toISOString();
      // resp.data.data[0].revealEndAt = moment().add(100, "s").toISOString();

      // resp.data.data[0].reveals = [
      //   { vote: "0x31" },
      //   { vote: "0x30" },
      //   { vote: "0x30" },
      // ];

      // resp.data.data[0].draftees[0].owner =
      //   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

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
