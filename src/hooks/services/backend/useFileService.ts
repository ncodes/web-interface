import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { StoreAccessTokenKey } from "../../../constants.ts";

export interface UploadParams {
  net: string;
  orderId: number;
  data: FormData;
}

/**
 * useFileService provides access to v1/files endpoint
 */
export function useFileService() {
  /**
   * Get a user
   */
  async function uploadFile(params: UploadParams): Promise<string> {
    try {
      const { net, orderId, data } = params;
      const headers = { "Content-Type": "multipart/form-data" };

      const token = localStorage.getItem(StoreAccessTokenKey);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        method: "post",
        url: `${
          import.meta.env.VITE_API_URI
        }/v1/files/upload/${net}/${orderId}`,
        headers,
        data,
      });

      return Promise.resolve(resp.data.data.hash);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    uploadFile,
  };
}
