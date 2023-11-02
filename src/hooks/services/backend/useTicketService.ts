import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";
import { TicketFilter } from "../../store/useStore.ts";

export interface ListTicketParams {
  network: string;
  limit: number;
  offset: number;
  connectedAddress?: string;
  ticketFilter: TicketFilter;
}

export type ListTicketIDs = "getTicketsOwned";
export type GetStatIDs = "getStats";

export interface GetStatParams {
  net: string;
  owner?: string;
}

/**
 * useTicketService provides access to v1/tickets endpoints
 */
export function useTicketService() {
  const { getChainInfo } = useConnectorContext();

  /**
   * List tickets
   * @param ctx
   */
  async function listTickets(
    ctx: QueryFunctionContext<[ListTicketIDs, ListTicketParams]>
  ): Promise<{ tickets: Ticket[]; meta: { queryCount: number } }> {
    try {
      const [id, params] = ctx.queryKey;
      const { network, limit, ticketFilter, offset } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${getChainInfo().apiUrl}/v1/tickets`,
        params: {
          ...ticketFilter,
          net: "ethereum" || network, // TODO: remove mock
          offset,
          limit,
          owner:
            id == "getTicketsOwned" && params.connectedAddress
              ? params.connectedAddress
              : undefined,
        },
        headers,
      });

      // resp.data.data[0].joined = false;
      // resp.data.data[0].expired = true;
      // resp.data.data[0].drained = true;
      // resp.data.data[0].matured = true;
      // resp.data.data[0].matureAt = moment().add(1, "day").toISOString();
      // resp.data.data[0].cancelAt = moment().add(1, "day").toISOString();
      // resp.data.data[0].drained = true;

      return Promise.resolve({
        tickets: resp.data.data,
        meta: resp.data.meta,
      });
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get ticket stats
   * @param ctx The query object
   */
  async function getStats(
    ctx: QueryFunctionContext<[GetStatIDs, GetStatParams]>
  ): Promise<TicketStats> {
    try {
      const [, params] = ctx.queryKey;
      const { net, owner } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${getChainInfo().apiUrl}/v1/tickets/stats`,
        headers,
        params: {
          net: "ethereum" || net, // TODO: remove mock
          owner,
        },
      });
      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    listTickets,
    getStats,
  };
}
