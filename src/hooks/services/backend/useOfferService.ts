import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";
import { OfferFilter } from "../../store/useStore.ts";
import moment from "moment";

export interface ListOfferParams {
  network: string;
  limit: number;
  offset: number;
  connectedAddress?: string;
  offerFilter: OfferFilter;
}

export type ListOfferIDs = "getOffersAsParticipant";

/**
 * useOfferService provides access to v1/offers endpoints
 */
export function useOfferService() {
  /**
   * List offers
   * @param ctx
   */
  async function listOffers(
    ctx: QueryFunctionContext<[ListOfferIDs, ListOfferParams]>
  ): Promise<{ offers: Offer[]; meta: { queryCount: number } }> {
    try {
      const [id, params] = ctx.queryKey;
      const { network, limit, offerFilter, offset } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/offers`,
        params: {
          ...offerFilter,
          net: network,
          offset,
          limit,
          creatorOrProvider:
            id == "getOffersAsParticipant" && params.connectedAddress
              ? params.connectedAddress
              : undefined,
        },
        headers,
      });

      // resp.data.data[0].creator = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      // resp.data.data[0].accepted = true;
      // resp.data.data[0].deadline = moment().add(20, "s").toISOString();

      return Promise.resolve({
        offers: resp.data.data,
        meta: resp.data.meta,
      });
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    listOffers,
  };
}
