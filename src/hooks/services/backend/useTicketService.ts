import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";
import { TicketFilter } from "../../store/useStore.ts";
import moment from "moment";

export interface ListTicketParams {
  network: string;
  limit: number;
  offset: number;
  connectedAddress?: string;
  ticketFilter: TicketFilter;
}

export type ListTicketIDs = "getTicketsOwned";

/**
 * useTicketService provides access to v1/tickets endpoints
 */
export function useTicketService() {
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
        url: `${import.meta.env.VITE_API_URI}/v1/tickets`,
        params: {
          ...ticketFilter,
          net: network,
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

  return {
    listTickets,
  };
}
