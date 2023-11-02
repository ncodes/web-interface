import axios, { AxiosProgressEvent } from "axios";
import { StoreAccessTokenKey } from "../../../constants.ts";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

export interface UploadParams {
  net: string;
  orderId: number;
  data: FormData;
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
}

/**
 * useFileService provides access to v1/files endpoint
 */
export function useFileService() {
  const { getChainInfo } = useConnectorContext();

  /**
   * Get a user
   */
  async function uploadFile(params: UploadParams): Promise<string> {
    try {
      const { net, orderId, data, onUploadProgress } = params;
      const headers = { "Content-Type": "multipart/form-data" };

      const token = localStorage.getItem(StoreAccessTokenKey);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        method: "post",
        url: `${getChainInfo().apiUrl}/v1/files/upload/${net}/${orderId}`,
        headers,
        data,
        onUploadProgress,
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
