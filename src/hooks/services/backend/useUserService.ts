import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { StoreAccessTokenKey } from "../../../constants.ts";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

export type GetUserIDs = "getUser";

export interface GetUserParams {
  address: string;
  noAuth?: boolean;
  net?: string;
}

interface LogOnlineStatusParams {
  net: string;
  orderId?: number;
  offerId?: number;
}

/**
 * useUserService provides access to v1/users endpoint
 */
export function useUserService() {
  const { getChainInfo } = useConnectorContext();

  /**
   * Get a user
   */
  async function getUser(
    ctx: QueryFunctionContext<[GetUserIDs, GetUserParams]>
  ): Promise<User> {
    try {
      const [, params] = ctx.queryKey;
      const headers = {};

      if (!params.noAuth) {
        const token = localStorage.getItem(StoreAccessTokenKey);
        headers["authorization"] = token ? `Bearer ${token}` : undefined;
      }

      const resp = await axios({
        url: `${getChainInfo().apiUrl}/v1/users/${params.address}`,
        method: "get",
        params: { no404: true },
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Log online status
   * @param params The request params
   * @returns
   */
  async function logOnlineStatus(params: LogOnlineStatusParams) {
    try {
      const headers = {};
      const token = localStorage.getItem(StoreAccessTokenKey);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        url: `${getChainInfo().apiUrl}/v1/users/log-status`,
        method: "post",
        data: {
          ...params,
          net:  params.net, 
        },
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Register device
   * @returns
   */
  async function registerDevice() {
    try {
      const headers = {};
      const token = localStorage.getItem(StoreAccessTokenKey);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      await axios({
        url: `${getChainInfo().apiUrl}/v1/users/register-device`,
        method: "post",
        data: {},
        headers,
      });

      return Promise.resolve(undefined);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    getUser,
    logOnlineStatus,
    registerDevice,
  };
}
