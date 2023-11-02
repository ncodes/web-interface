import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { StoreAccessTokenKey } from "../../../constants.ts";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

export interface SubscribeForWebPushParams {
  subscription: PushSubscription;
  address: string;
  net: string;
}

export interface CountParams {
  net: string;
  type?: string;
  read?: boolean;
  offerId?: number;
  orderId?: number;
}

export interface MarkReadParams {
  net: string;
  type?: string;
  id?: string;
  offerId?: number;
  orderId?: number;
}

export interface NotificationParams {
  net: string;
  type?: string;
  read?: boolean;
  orderId?: number;
  offerId?: number;
  limit?: number;
  offset?: number;
}

/**
 * useNotificationService provides access to v1/notifications endpoint
 */
export function useNotificationService() {
  const { getChainInfo } = useConnectorContext();

  /**
   * Subscribe for web push notifications
   * @param ctx The query function context
   * @returns
   */
  async function subscribeForWebPush(
    params: SubscribeForWebPushParams
  ): Promise<void> {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      await axios({
        method: "post",
        url: `${getChainInfo().apiUrl}/v1/notifications/web-push/subscribe`,
        data: params,
        headers,
      });

      return Promise.resolve(undefined);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get notifications
   * @param ctx The query function context
   * @returns
   */
  async function getNotifications(
    ctx: QueryFunctionContext<[string, NotificationParams]>
  ): Promise<Notification[]> {
    const [, params] = ctx.queryKey;
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem(StoreAccessTokenKey);
    headers["authorization"] = token ? `Bearer ${token}` : undefined;

    const resp = await axios({
      method: "get",
      url: `${getChainInfo().apiUrl}/v1/notifications`,
      params,
      headers,
    });

    return Promise.resolve(resp.data.data);
  }

  /**
   * Count notifications
   * @param ctx The query function context
   * @returns
   */
  async function countNotifications(
    ctx: QueryFunctionContext<[string, CountParams]>
  ): Promise<number> {
    try {
      const [, params] = ctx.queryKey;
      const headers = { "Content-Type": "application/json" };
      const token = localStorage.getItem(StoreAccessTokenKey);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        method: "get",
        url: `${getChainInfo().apiUrl}/v1/notifications`,
        params: { ...params, count: true },
        headers,
      });

      return Promise.resolve(parseInt(resp.data.data.count));
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Mark notifications as read
   * @param params The request params
   * @returns
   */
  async function markNotificationsAsRead(
    params: MarkReadParams
  ): Promise<void> {
    try {
      const headers = { "Content-Type": "application/json" };
      const token = localStorage.getItem(StoreAccessTokenKey);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      await axios({
        method: "put",
        url: `${getChainInfo().apiUrl}/v1/notifications/mark-read`,
        data: params,
        headers,
      });
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    subscribeForWebPush,
    countNotifications,
    getNotifications,
    markNotificationsAsRead,
  };
}
