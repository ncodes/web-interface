import axios from "axios";
import { handleAxiosError } from "../../../libs/utils";

/**
 * useUserService provides access to api/users endpoint
 */
export function useUserService() {
  /**
   * Get the authenticated user
   */
  async function getMe(): Promise<User> {
    try {
      const headers = {};
      headers["authorization"] = `bearer ${localStorage.getItem(
        "access_token"
      )}`;
      const resp = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URI}/users/me`,
        headers,
      });

      return Promise.resolve(resp.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e));
    }
  }

  return {
    getMe,
  };
}
