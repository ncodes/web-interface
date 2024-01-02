import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";
import { useSession } from "../../useSession.ts";

interface IsAllowedAddressParams {
  address: string;
}

/**
 * useAuthService provides access to v1/auth endpoint
 */
export function useAuthService() {
  const { getChainInfo } = useConnectorContext();
  const { getAccessToken } = useSession();

  /**
   * auth registers a new user and links their wallet address to their email
   * @param message - The message that was signed
   * @param signature - The signature derived from the message
   * @param refCode - The referrer code
   */
  async function auth(
    message: string,
    signature: string,
    refCode: string | null,
  ): Promise<{ token?: string; user: User }> {
    try {
      const resp = await axios({
        method: "post",
        url: `${getChainInfo().apiUrl}/v1/auth`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ msg: message, sig: signature, refCode }),
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
      const token = getAccessToken();
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

  /**
   * Check if an address is in the private allowlist
   * @param ctx The query context
   * @returns
   */
  async function isAllowedPrivateTestAddress(
    ctx: QueryFunctionContext<[string, IsAllowedAddressParams]>,
  ): Promise<boolean> {
    try {
      const [, params] = ctx.queryKey;

      const resp = await axios({
        method: "get",
        url: `${getChainInfo().apiUrl}/v1/auth/${params.address}/allowed`,
      });

      return Promise.resolve(resp.data.data.allowed);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    auth,
    verifyEmail,
    deleteSession,
    isAllowedPrivateTestAddress,
  };
}
