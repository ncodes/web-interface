import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";

export interface GetBadgeManifestParams {
  net: string;
  badge: string;
}

export interface BadgeManifest {
  name: string;
  issuer: string;
  issuerAddress: string;
  logoUrl: string;
  shortDescription: string;
  longDescriptions: string[];
  claimPageUrl: string;
}

/**
 * useBadgeService provides access to v1/badges endpoint
 */
export function useBadgeService() {
  const { getChainInfo } = useConnectorContext();

  /**
   * Get badge manifest
   */
  async function getBadgeManifest(
    ctx: QueryFunctionContext<[string, GetBadgeManifestParams]>,
  ): Promise<BadgeManifest> {
    try {
      const [, params] = ctx.queryKey;

      const resp = await axios({
        method: "get",
        url: `${getChainInfo().apiUrl}/v1/badges/${params.net}/${
          params.badge
        }/manifest`,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    getBadgeManifest,
  };
}
