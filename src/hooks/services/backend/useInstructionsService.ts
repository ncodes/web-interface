import { QueryFunctionContext } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { StoreAccessTokenKey } from "../../../constants.ts";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

type UpdateInstructionsBody = {
  net: string;
  content: string;
  marketAddress: string;
  provider: string;
  lid: number;
};

type GetInstructionsBody = {
  net: string;
  address: string;
};

export type NewGrantValues = [
  string,
  string,
  string,
  number,
  string[],
  string[],
  number
][];

export type ExistingGrantValues = [
  string,
  string,
  string,
  string,
  string,
  number
][];

export interface GrantSigInfo {
  sig?: string;
  isNew?: boolean;
  values?: NewGrantValues | ExistingGrantValues;
  network?: string;
}

export interface InstructionsResponse {
  instructions: Instructions;
  hash: string;
}

export type InstructionsWithGrantSigResponse = InstructionsResponse & {
  sigInfo: GrantSigInfo;
};

/**
 * useInstructionsService provides access to v1/instructions endpoint
 */
export function useInstructionsService() {
  const { getChainInfo } = useConnectorContext();

  /**
   * Update instructions for the authenticated user
   * @param body The request body
   */
  async function updateInstructions(
    body: Partial<UpdateInstructionsBody>
  ): Promise<InstructionsWithGrantSigResponse> {
    try {
      const headers = {};
      const token = localStorage.getItem(StoreAccessTokenKey);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        method: "put",
        data: JSON.stringify(body),
        url: `${getChainInfo().apiUrl}/v1/instructions`,
        headers: {
          "content-type": "application/json",
          ...headers,
        },
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get instructions for the given address
   * @param ctx The query context
   */
  async function getInstructions(
    ctx: QueryFunctionContext<[string, GetInstructionsBody]>
  ): Promise<InstructionsResponse | undefined> {
    try {
      const [, body] = ctx.queryKey;
      const headers = {};

      const token = localStorage.getItem(StoreAccessTokenKey);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const { net, address } = body;
      const resp = await axios({
        method: "get",
        url: `${
          import.meta.env.VITE_API_URI
        }/v1/instructions/${net}/${address}`,
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      if (
        (e as { response: AxiosResponse }).response &&
        (e as { response: AxiosResponse }).response.status === 404
      ) {
        return Promise.resolve(undefined);
      }
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    updateInstructions,
    getInstructions,
  };
}
