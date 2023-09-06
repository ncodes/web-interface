import axios from "axios";
import { handleAxiosError, powOf } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";
import { OfferFilter } from "../../store/useStore.ts";
import { StoreAccessTokenKey } from "../../../constants.ts";
import moment from "moment";
import { Events } from "../../../types/enums.ts";

export interface ListOfferParams {
  network: string;
  limit: number;
  offset: number;
  connectedAddress?: string;
  offerFilter?: OfferFilter;
}

export interface GetOfferEventsParams {
  network: string;
  offerId: number;
  limit?: number;
  offset?: number;
}

export interface GetOfferParams {
  network: string;
  offerId: number;
}

interface OfferReadStatusParams {
  network: string;
  marketAddress?: string;
  provider?: string;
  lid?: number;
}

export type ListOfferIDs = "getOffersAsParticipant" | "getOffers";

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
          net: "ethereum" || network, // TODO: remove mock
          offset,
          limit,
          creatorOrProvider:
            id == "getOffersAsParticipant" && params.connectedAddress
              ? params.connectedAddress
              : undefined,
        },
        headers,
      });

      // TODO: remove mock
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

  /**
   * Get offer events
   * @param ctx The query context
   */
  async function getEvents(
    ctx: QueryFunctionContext<[string, GetOfferEventsParams]>
  ): Promise<{ events: Event[]; meta: { queryCount: number } }> {
    try {
      const [, params] = ctx.queryKey;
      const { network, offerId, limit, offset } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/offers/${offerId}/events`,
        params: {
          net: "ethereum" || network, // TODO: remove mock
          offset,
          limit,
        },
        headers,
      });

      // TODO: remove mock
      resp.data.data[0] = {
        action: Events.OfferCreate,
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        amount: powOf(100, 18).toString(),
        price: powOf(10, 18).toString(),
        market: {
          baseDecimals: 18,
          quoteDecimals: 18,
          base: "BTC",
          quote: "USDT",
        },
        createdAt: moment().subtract(10, "m").toISOString(),
      } as Event;
      resp.data.data[1] = {
        action: Events.OfferUpdate,
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92245",
        amount: powOf(1530, 18).toString(),
        price: powOf(10000, 18).toString(),
        market: {
          baseDecimals: 18,
          quoteDecimals: 18,
          base: "BTC",
          quote: "USDT",
        },
        createdAt: moment().subtract(20, "m").toISOString(),
      } as Event;
      resp.data.data[2] = {
        action: Events.OfferAccept,
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92223",
        amount: powOf(1530, 18).toString(),
        price: powOf(10000, 18).toString(),
        market: {
          baseDecimals: 18,
          quoteDecimals: 18,
          base: "BTC",
          quote: "USDT",
        },
        createdAt: moment().subtract(20, "m").toISOString(),
      } as Event;
      resp.data.data[3] = {
        action: Events.OfferUnaccept,
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cxzFb92223",
        amount: powOf(1530, 18).toString(),
        price: powOf(10000, 18).toString(),
        market: {
          baseDecimals: 18,
          quoteDecimals: 18,
          base: "BTC",
          quote: "USDT",
        },
        createdAt: moment().subtract(20, "m").toISOString(),
      } as Event;
      resp.data.data[4] = {
        action: Events.OfferCancel,
        creator: "0xf39Fd6e51aad88F6F4ce6aBx827279cxzFb92223",
        amount: powOf(1530, 18).toString(),
        price: powOf(10000, 18).toString(),
        market: {
          baseDecimals: 18,
          quoteDecimals: 18,
          base: "BTC",
          quote: "USDT",
        },
        createdAt: moment().subtract(20, "m").toISOString(),
      } as Event;
      return Promise.resolve({
        events: resp.data.data,
        meta: resp.data.meta,
      });
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get an offer
   * @param ctx The query context
   */
  async function getOffer(
    ctx: QueryFunctionContext<[string, GetOfferParams]>
  ): Promise<Offer> {
    try {
      const [, params] = ctx.queryKey;
      const { network, offerId } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/offers/${offerId}`,
        params: {
          net: "ethereum" || network, // TODO: remove mock
        },
        headers,
      });

      // TODO: remove mock
      // resp.data.data[0].creator = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      // resp.data.data[0].accepted = true;
      // resp.data.data[0].deadline = moment().add(20, "s").toISOString();

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Count unread offers
   * @param ctx
   */
  async function countUnread(
    ctx: QueryFunctionContext<[string, OfferReadStatusParams]>
  ): Promise<{ asProvider: number; asOfferer: number }> {
    try {
      const [, params] = ctx.queryKey;
      const { network, marketAddress, provider, lid } = params;
      const headers = {};
      const token = localStorage.getItem(StoreAccessTokenKey);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;
      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/offers/count-unread`,
        params: {
          net: "ethereum" || network, // TODO: remove mock
          marketAddress,
          provider,
          lid,
        },
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Mark unread offers as read
   * @param ctx
   */
  async function markAsRead(
    ctx: QueryFunctionContext<[string, OfferReadStatusParams]>
  ): Promise<void> {
    try {
      const [, params] = ctx.queryKey;
      const { network, marketAddress, provider, lid } = params;
      const headers = {};
      const token = localStorage.getItem(StoreAccessTokenKey);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;
      const resp = await axios({
        method: "put",
        url: `${import.meta.env.VITE_API_URI}/v1/offers/mark-read`,
        params: {
          net: "ethereum" || network, // TODO: remove mock
          marketAddress,
          provider,
          lid,
        },
        headers,
      });
      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    listOffers,
    countUnread,
    markAsRead,
    getOffer,
    getEvents,
  };
}
