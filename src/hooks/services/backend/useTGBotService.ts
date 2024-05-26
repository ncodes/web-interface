import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";
import { useSession } from "../../useSession.ts";

/**
 * useTGBotService provides access to v1/tgbot endpoint
 */
export function useTGBotService() {
  const { getChainInfo, address } = useConnectorContext();
  const { getAccessToken } = useSession();

  /**
   * Register a TG user to the current authenticated user
   */
  async function linkTGUser(body: {
    initData: string;
    initDataUnsafe: {
      auth_date: string;
      hash: string;
      query_id: string;
      user: {
        id: number;
        first_name: string;
        last_name: string;
        language_code: string;
        username: string;
        allows_write_to_pm: boolean;
      };
    };
  }): Promise<{ user: User }> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        url: `${getChainInfo().apiUrl}/v1/tgbot/link-user`,
        method: "post",
        data: body,
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Create a Telegram linked user account (a.k.a virtual account).
   */
  async function createLinkedUser(body: {
    initData: string;
    initDataUnsafe: {
      auth_date: string;
      hash: string;
      query_id: string;
      user: {
        id: number;
        first_name: string;
        last_name: string;
        language_code: string;
        username: string;
        allows_write_to_pm: boolean;
      };
    };
  }): Promise<{ user: User; token: string }> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        url: `${getChainInfo().apiUrl}/v1/tgbot/linked-user`,
        method: "post",
        data: body,
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    linkTGUser,
    createLinkedUser,
  };
}
