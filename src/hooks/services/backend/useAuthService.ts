import axios from "axios";
import { StoreAccessTokenKey } from "../../../constants.ts";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

/**
 * useAuthService provides access to v1/auth endpoint
 */
export function useAuthService() {
  const { getChainInfo } = useConnectorContext();

  /**
   * auth registers a new user and links their wallet address to their email
   * @param message - The message that was signed
   * @param signature - The signature derived from the message
   */
  async function auth(
    message: string,
    signature: string,
  ): Promise<{ token?: string; user: User }> {
    try {
      const resp = await axios({
        method: "post",
        url: `${getChainInfo().apiUrl}/v1/auth`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ msg: message, sig: signature }),
      });
      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Verify the email address of a user
   * @param userId The user id
   * @param otp The one time password sent to the user
   * @returns
   */
  async function verifyEmail(
    userId: string,
    otp: string,
  ): Promise<{ token?: string; user: User }> {
    try {
      const resp = await axios({
        method: "put",
        url: `${getChainInfo().apiUrl}/v1/auth/verify-email`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ userId, otp }),
      });
      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Delete current or all sessions
   * @param all If set, deletes all sessions for the user
   */
  async function deleteSession(all: boolean): Promise<void> {
    try {
      const headers = { "Content-Type": "application/json" };
      const token = localStorage.getItem(StoreAccessTokenKey);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      await axios({
        method: "delete",
        url: `${getChainInfo().apiUrl}/v1/auth/session`,
        params: all ? { all: "true" } : undefined,
        headers,
      });

      return Promise.resolve(undefined);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    auth,
    verifyEmail,
    deleteSession,
  };
}
