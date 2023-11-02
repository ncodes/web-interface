import axios from "axios";
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
    signature: string
  ): Promise<{ token: string; user: User }> {
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

  return {
    auth,
  };
}
