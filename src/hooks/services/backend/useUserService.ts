import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";
import { StoreAccessTokenKey } from "../../../constants.ts";

/**
 * useUserService provides access to v1/users endpoint
 */
export function useUserService() {
  /**
   * Get the authenticated user
   */
  async function getUser(
    ctx: QueryFunctionContext<[string, string]>
  ): Promise<User> {
    try {
      const [, address] = ctx.queryKey;
      const headers = {};
      const token = localStorage.getItem(StoreAccessTokenKey);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;
      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/users/${address}`,
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e));
    }
  }

  return {
    getUser,
  };
}
