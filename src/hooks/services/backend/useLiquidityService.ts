import axios from "axios";
import { handleAxiosError, powOf } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";
import { LiquidityFilter } from "../../store/useStore.ts";
import { Events } from "../../../types/enums.ts";
import moment from "moment";
export interface ListLiquidityParams {
  provider?: string;
  network: string;
  limit?: number;
  offset?: number;
  connectedAddress?: string;
  liquidityFilter?: LiquidityFilter;
}

type ListLiquidityIDs = "getLiquidities" | "getLiquidityByCreator";
type GetLiquidityIDs = "getLiquidity";
type GetLiquidityEventsIDs = "getLiquidityEvents";

interface GetLiquidityParams {
  network: string;
  market: string;
  provider: string;
  lid: number;
}

/**
 * useLiquidityService provides access to v1/liquidities endpoints
 */
export function useLiquidityService() {
  /**
   * List liquidities
   * @param ctx
   */
  async function listLiquidities(
    ctx: QueryFunctionContext<[ListLiquidityIDs, ListLiquidityParams]>
  ): Promise<{ liquidities: Liquidity[]; meta: { queryCount: number } }> {
    try {
      const [id, params] = ctx.queryKey;
      const { network, limit, liquidityFilter, offset } = params;
      const headers = {};

      const payload = {
        ...liquidityFilter,
        net: "ethereum" || network, // TODO: remove mock
        offset,
        limit,
      };

      if (id == "getLiquidityByCreator" && params.connectedAddress) {
        payload.provider = params.connectedAddress;
      }

      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/liquidities`,
        params: payload,
        headers,
      });

      return Promise.resolve({
        liquidities: resp.data.data,
        meta: resp.data.meta,
      });
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get liquidity
   */
  async function getLiquidity(
    ctx: QueryFunctionContext<[GetLiquidityIDs, GetLiquidityParams]>
  ): Promise<Liquidity> {
    try {
      const [, params] = ctx.queryKey;
      const { network, market, provider, lid } = params;
      const headers = {};
      const resp = await axios({
        method: "get",
        url: `${
          import.meta.env.VITE_API_URI
        }/v1/liquidities/${market}/${provider}/${lid}`,
        params: {
          net: "ethereum" || network, // TODO: remove mock
        },
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get liquidity events
   */
  async function getEvents(
    ctx: QueryFunctionContext<[GetLiquidityEventsIDs, GetLiquidityParams]>
  ): Promise<Event[]> {
    try {
      const [, params] = ctx.queryKey;
      const { network, market, provider, lid } = params;
      const headers = {};
      const resp = await axios<{ data: Event[] }>({
        method: "get",
        url: `${
          import.meta.env.VITE_API_URI
        }/v1/liquidities/${market}/${provider}/${lid}/events`,
        params: {
          net: "ethereum" || network, // TODO: remove mock
        },
        headers,
      });

      // TODO: delete mocks
      resp.data.data = [] as any;
      resp.data.data[0] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action: Events.LiquidityAdd,
        amount: "10000000000000000000",
        price: "1531000000000000000000",
        createdAt: moment().subtract(1, "day").toISOString(),
      } as unknown as Event;
      resp.data.data[1] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92262",
        action: Events.LiquidityRemove,
        amount: "10000000000000000000",
        price: "1531000000000000000000",
        createdAt: moment().subtract(2, "day").toISOString(),
      } as unknown as Event;
      resp.data.data[2] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92263",
        action: Events.LiquiditySwap,
        amount: "10000000000000000000",
        price: "1531000000000000000000",
        createdAt: moment().subtract(2, "day").toISOString(),
        swap: {
          amount: powOf(12, 18).toString(),
          price: powOf(3, 18).toString(),
          cost: 34510,
        } as Swap,
      } as unknown as Event;
      resp.data.data[3] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action: Events.LiquidityOffer,
        createdAt: moment().subtract(2, "day").toISOString(),
        offer: {
          amount: "10000000000000000000",
          price: "1531000000000000000000",
          deadline: moment().subtract(1, "day").toISOString(),
        } as Offer,
      } as unknown as Event;
      resp.data.data[4] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92263",
        action: Events.LiquidityPause,
        createdAt: moment().subtract(2, "day").toISOString(),
        paused: false,
      } as unknown as Event;
      resp.data.data[5] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92261",
        action: Events.LiquidityManagerUpdate,
        createdAt: moment().subtract(2, "day").toISOString(),
        manager: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      } as unknown as Event;
      resp.data.data[6] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92223",
        action: Events.LiquidityTargetUpdate,
        createdAt: moment().subtract(2, "day").toISOString(),
        target: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92234",
      } as unknown as Event;
      resp.data.data[7] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action: Events.LiquidityPriceUpdate,
        createdAt: moment().subtract(2, "day").toISOString(),
        price: powOf(3342, 18).toString(),
      } as unknown as Event;
      resp.data.data[8] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action: Events.LiquiditySwapLimitUpdate,
        createdAt: moment().subtract(2, "day").toISOString(),
        minSwap: powOf(100, 18).toString(),
        maxSwap: powOf(200, 18).toString(),
      } as unknown as Event;
      resp.data.data[9] = {
        creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        action: Events.LiquidityTimeToPayUpdate,
        createdAt: moment().subtract(2, "day").toISOString(),
        timeToPay: 86400,
      } as unknown as Event;

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    listLiquidities,
    getLiquidity,
    getEvents,
  };
}
