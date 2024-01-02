import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";
import { useSession } from "../../useSession.ts";

export interface SubscribeToChatConvoParams {
  topics: string[];
  peerAddresses: string[];
  net: string;
  orderId?: number;
  offerId?: number;
}

export interface AreConvosMutedParams {
  network: string;
  topics: string[];
}

export interface ToggleConvosMuteStateParams {
  network: string;
  topics: string[];
}

/**
 * useConvoService provides access to v1/convos endpoint
 */
export function useConvoService() {
  const { getChainInfo, address } = useConnectorContext();
  const { getAccessToken } = useSession();

  /**
   * Subscribe to a chat conversation to receive notifications
   * @param params The request params
   * @returns
   */
  async function subscribeToConvosNotifications(
    params: SubscribeToChatConvoParams,
  ) {
    try {
      const token = getAccessToken(address);
      const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      };

      await axios({
        method: "post",
        url: `${getChainInfo().apiUrl}/v1/convos/subscribe`,
        data: params,
        headers,
      });

      return Promise.resolve(undefined);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Check if a set of conversations are all muted
   * @param ctx The query function context
   * @returns
   */
  async function areConvosMuted(
    ctx: QueryFunctionContext<[string, AreConvosMutedParams]>,
  ): Promise<boolean> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const [, params] = ctx.queryKey;
      const net = params.network;

      let muted = 0;
      for (let topic of params.topics) {
        topic = topic.replaceAll("/", "_");
        const resp = await axios({
          url: `${getChainInfo().apiUrl}/v1/convos/${net}/${topic}`,
          method: "get",
          headers,
        });

        if (resp.data.data.muted) muted++;
      }

      return Promise.resolve(muted == params.topics.length);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Toggle mute status for a set of conversations
   * @param params The request params
   * @returns
   */
  async function toggleConvosMuteStatus(params: ToggleConvosMuteStateParams) {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      for (let topic of params.topics) {
        topic = topic.replaceAll("/", "_");
        await axios({
          url: `${getChainInfo().apiUrl}/v1/convos/${
            params.network
          }/${topic}/toggle-mute`,
          method: "put",
          headers,
        });
      }

      return Promise.resolve(undefined);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    subscribeToConvosNotifications,
    areConvosMuted,
    toggleConvosMuteStatus,
  };
}
