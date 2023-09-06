import axios from "axios";
import { handleAxiosError, powOf } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Events } from "../../../types/enums.ts";
import moment from "moment/moment";

export interface GetParams {
  network: string;
  markets?: string[];
  wallets?: string[];
  liquidities?: { provider: string; lid: number }[];
  limit?: number;
  lastSerial?: number;
}

/**
 * useTimelineService provides access to v1/timelines endpoints
 */
export function useTimelineService() {
  /**
   * Get timeline events
   * @param ctx
   */
  async function get(
    ctx: QueryFunctionContext<[string, GetParams]>
  ): Promise<{ events: Event[]; meta: { queryCount: number } }> {
    try {
      const lastSerial = ctx.pageParam as number;
      const [, params] = ctx.queryKey;
      const { network, liquidities, markets, wallets, limit } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/timelines`,
        params: {
          net: "ethereum" || network, // TODO: remove mock
          markets,
          wallets,
          liquidities,
          lastSerial,
          limit,
        },
        headers,
      });

      // TODO: mock remove
      const market = {
        baseDecimals: 18,
        quoteDecimals: 18,
        base: "BTC",
        quote: "USDT",
      };
      const liquidity = {
        provider: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        marketAddress: "0xMarket",
        lid: 0,
      };
      const offer = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      };
      resp.data.data[0] = {
        action: Events.OfferCreate,
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        amount: powOf(100, 18).toString(),
        price: powOf(10, 18).toString(),
        market,
        offer: { ...offer, liquidity },
        createdAt: moment().subtract(10, "m").toISOString(),
      } as Event;
      resp.data.data[1] = {
        action: Events.OfferUpdate,
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92245",
        amount: powOf(1530, 18).toString(),
        price: powOf(10000, 18).toString(),
        market,
        offer: { ...offer, liquidity },
        createdAt: moment().subtract(20, "m").toISOString(),
      } as Event;
      resp.data.data[2] = {
        action: Events.OfferAccept,
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92223",
        amount: powOf(1530, 18).toString(),
        price: powOf(10000, 18).toString(),
        market,
        offer: { ...offer, liquidity },
        createdAt: moment().subtract(20, "m").toISOString(),
      } as Event;
      resp.data.data[3] = {
        action: Events.OfferUnaccept,
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cxzFb92223",
        amount: powOf(1530, 18).toString(),
        price: powOf(10000, 18).toString(),
        market,
        offer: { ...offer, liquidity },
        createdAt: moment().subtract(20, "m").toISOString(),
      } as Event;
      resp.data.data[4] = {
        action: Events.OfferCancel,
        creator: "0xf39Fd6e51aad88F6F4ce6aBx827279cxzFb92223",
        amount: powOf(1530, 18).toString(),
        price: powOf(10000, 18).toString(),
        market,
        offer: { ...offer, liquidity },
        createdAt: moment().subtract(20, "m").toISOString(),
      } as Event;

      resp.data.data[5] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action: Events.LiquidityAdd,
        amount: "10000000000000000000",
        price: "1531000000000000000000",
        market,
        liquidity,
        createdAt: moment().subtract(1, "day").toISOString(),
      } as unknown as Event;
      resp.data.data[6] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92262",
        action: Events.LiquidityRemove,
        amount: "10000000000000000000",
        price: "1531000000000000000000",
        market,
        liquidity,
        createdAt: moment().subtract(2, "day").toISOString(),
      } as unknown as Event;
      resp.data.data[7] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92263",
        action: Events.LiquiditySwap,
        amount: "10000000000000000000",
        price: "1531000000000000000000",
        market,
        liquidity,
        createdAt: moment().subtract(2, "day").toISOString(),
        swap: {
          amount: powOf(12, 18).toString(),
          price: powOf(3, 18).toString(),
          cost: 34510,
        } as Swap,
      } as unknown as Event;
      resp.data.data[8] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action: Events.LiquidityOffer,
        market,
        liquidity,
        createdAt: moment().subtract(2, "day").toISOString(),
        offer: {
          amount: "10000000000000000000",
          price: "1531000000000000000000",
          deadline: moment().subtract(1, "day").toISOString(),
        } as Offer,
      } as unknown as Event;
      resp.data.data[9] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92263",
        action: Events.LiquidityPause,
        market,
        liquidity,
        createdAt: moment().subtract(2, "day").toISOString(),
        paused: false,
      } as unknown as Event;
      resp.data.data[10] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92261",
        action: Events.LiquidityManagerUpdate,
        market,
        liquidity,
        createdAt: moment().subtract(2, "day").toISOString(),
        manager: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      } as unknown as Event;
      resp.data.data[11] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92223",
        action: Events.LiquidityTargetUpdate,
        market,
        liquidity,
        createdAt: moment().subtract(2, "day").toISOString(),
        target: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92234",
      } as unknown as Event;
      resp.data.data[12] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action: Events.LiquidityPriceUpdate,
        market,
        liquidity,
        createdAt: moment().subtract(2, "day").toISOString(),
        price: powOf(3342, 18).toString(),
      } as unknown as Event;
      resp.data.data[13] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action: Events.LiquiditySwapLimitUpdate,
        market,
        liquidity,
        createdAt: moment().subtract(2, "day").toISOString(),
        minSwap: powOf(100, 18).toString(),
        maxSwap: powOf(200, 18).toString(),
      } as unknown as Event;
      resp.data.data[14] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action: Events.LiquidityTimeToPayUpdate,
        market,
        liquidity,
        createdAt: moment().subtract(2, "day").toISOString(),
        timeToPay: 86400,
      } as unknown as Event;

      resp.data.data[15] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action: Events.SwapPaid,
        createdAt: moment().subtract(1, "day").toISOString(),
      } as unknown as Event;
      resp.data.data[16] = {
        creator: "0x1787BaB2743467E874ee133ADd46884e0A32ccB5",
        action: Events.SwapReleased,
        createdAt: moment().subtract(1, "day").toISOString(),
      } as unknown as Event;
      resp.data.data[17] = {
        creator: "0x349Fd6e51aad88F6F4ce6aB8827279cffFb92263",
        action: Events.SwapCancelled,
        createdAt: moment().subtract(1, "day").toISOString(),
      } as unknown as Event;
      resp.data.data[18] = {
        creator: "0x349Fd6e51aad88F6F4ce6aB8827279cffFb92343",
        action: Events.SwapDisputed,
        dispute: { disputeId: 1 },
        createdAt: moment().subtract(1, "day").toISOString(),
      } as unknown as Event;
      resp.data.data[19] = {
        creator: "0x349Fd6e51aad88F6F4ce6aB8827279cffFb92343",
        action: Events.SwapDrafted,
        dispute: { disputeId: 1 },
        createdAt: moment().subtract(1, "day").toISOString(),
      } as unknown as Event;
      resp.data.data[20] = {
        creator: "0x349Fd6e51aad88F6F4ce6aB8827279cffFb92345",
        action: Events.SwapCommitted,
        dispute: { disputeId: 1 },
        createdAt: moment().subtract(1, "day").toISOString(),
      } as unknown as Event;
      resp.data.data[21] = {
        creator: "0x349Fd6e51axd88F6F4ce6aB8827279cffFb92345",
        action: Events.SwapRevealed,
        dispute: { disputeId: 1 },
        createdAt: moment().subtract(1, "day").toISOString(),
      } as unknown as Event;
      resp.data.data[22] = {
        creator: "0x349Fd6e51axd88F6F4ce6aB8827279cffFb92349",
        action: Events.SwapUndrafted,
        dispute: { disputeId: 1 },
        createdAt: moment().subtract(1, "day").toISOString(),
      } as unknown as Event;

      return Promise.resolve({
        events: resp.data.data,
        meta: resp.data.meta,
      });
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    get,
  };
}
