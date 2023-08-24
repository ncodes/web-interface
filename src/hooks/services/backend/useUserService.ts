import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { QueryFunctionContext } from "@tanstack/react-query";
import { StoreAccessTokenKey } from "../../../constants.ts";

export type GetUserIDs = "getUser";

export interface GetUserParams {
  address: string;
  noAuth?: boolean;
  net?: string;
}

/**
 * useUserService provides access to v1/users endpoint
 */
export function useUserService() {
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
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/v1/users/${params.address}`,
        headers,
      });

      // resp.data.data.badges = ["merchant"];

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    getUser,
  };
}
