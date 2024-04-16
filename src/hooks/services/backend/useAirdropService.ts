import axios from "axios";
import { handleAxiosError } from "../../../libs/helpers.ts";
import { useConnectorContext } from "../../connectors/useConnectorContext.tsx";
import { useSession } from "../../useSession.ts";

export interface LinkTwitterUserParams {
  code: string;
}

/**
 * useAirdropService provides access to v1/airdrop endpoint
 */
export function useAirdropService() {
  const { getChainInfo, address } = useConnectorContext();
  const { getAccessToken } = useSession();

  /**
   * Link twitter user to an account
   * @param code The twitter auth code
   */
  async function linkTwitterUser(code: string): Promise<{ ok: true }> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        url: `${getChainInfo().apiUrl}/v1/airdrop/link-twitter/${code}`,
        method: "put",
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Unlink twitter user to an account
   */
  async function unlinkTwitter(): Promise<{ ok: true }> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        url: `${getChainInfo().apiUrl}/v1/airdrop/unlink-twitter`,
        method: "put",
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Link discord user to an account
   * @param code The discord auth code
   */
  async function linkDiscordUser(code: string): Promise<{ ok: true }> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        url: `${getChainInfo().apiUrl}/v1/airdrop/link-discord/${code}`,
        method: "put",
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Unlink discord user to an account
   */
  async function unlinkDiscord(): Promise<{ ok: true }> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        url: `${getChainInfo().apiUrl}/v1/airdrop/unlink-discord`,
        method: "put",
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Apply a lucky code
   * @param code The lucky code
   * @returns
   */
  async function applyLuckyCode(code: string): Promise<string> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        url: `${getChainInfo().apiUrl}/v1/airdrop/lucky-codes/claim/${code}`,
        method: "post",
        headers,
      });

      return Promise.resolve(resp.data.data.amount);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Claim NFT allocation
   * @returns
   */
  async function claimNFTAllocation(): Promise<string> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        url: `${getChainInfo().apiUrl}/v1/airdrop/claim-alloc/nft`,
        method: "post",
        headers,
      });

      return Promise.resolve(resp.data.data.amount);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Claim early member allocation
   * @returns
   */
  async function claimEarlyMemberAllocation(): Promise<string> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        url: `${getChainInfo().apiUrl}/v1/airdrop/claim-alloc/early-member`,
        method: "post",
        headers,
      });

      return Promise.resolve(resp.data.data.amount);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Claim points allocation
   * @returns
   */
  async function claimPointsAllocation(): Promise<string> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        url: `${getChainInfo().apiUrl}/v1/airdrop/claim-alloc/points`,
        method: "post",
        headers,
      });

      return Promise.resolve(resp.data.data.amount);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Get quests
   */
  async function getQuests(): Promise<Quest[]> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      const resp = await axios({
        method: "get",
        url: `${getChainInfo().apiUrl}/v1/airdrop/get-quests`,
        headers,
      });

      return Promise.resolve(resp.data.data);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Create quest verification request.
   * @param questId The quest id
   * @param link The link to verify
   * @returns
   */
  async function createQuestVerifyRequest({
    questId,
    link,
  }: {
    questId: string;
    link: string;
  }): Promise<void> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      await axios({
        url: `${getChainInfo().apiUrl}/v1/airdrop/request-verify/${questId}`,
        method: "post",
        data: {
          link,
        },
        headers,
      });

      return Promise.resolve(undefined);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Vote on a quest verification request.
   * @param questId The quest id
   * @param link The link to verify
   * @returns
   */
  async function voteQuest({
    questId,
    vote,
  }: {
    questId: string;
    vote: 0 | 1;
  }): Promise<void> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      await axios({
        url: `${getChainInfo().apiUrl}/v1/airdrop/vote-quest/${questId}`,
        method: "post",
        data: { questId, vote },
        headers,
      });

      return Promise.resolve(undefined);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Apply for pre-sale
   * @param param0
   * @returns
   */
  async function applyForPresale({ countryCode }: { countryCode: string }) {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      await axios({
        url: `${getChainInfo().apiUrl}/v1/airdrop/apply-presale`,
        method: "post",
        data: { country: countryCode },
        headers,
      });

      return Promise.resolve(undefined);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  /**
   * Verify a swap quest
   * @param questId The quest id
   * @returns
   */
  async function verifySwap({ questId }: { questId: string }): Promise<void> {
    try {
      const headers = {};
      const token = getAccessToken(address);
      headers["authorization"] = token ? `Bearer ${token}` : undefined;

      await axios({
        url: `${getChainInfo().apiUrl}/v1/airdrop/verify-swap/${questId}`,
        method: "post",
        data: { questId },
        headers,
      });

      return Promise.resolve(undefined);
    } catch (e) {
      return Promise.reject(handleAxiosError(e as never));
    }
  }

  return {
    linkTwitterUser,
    unlinkTwitter,
    linkDiscordUser,
    unlinkDiscord,
    applyLuckyCode,
    claimNFTAllocation,
    claimEarlyMemberAllocation,
    claimPointsAllocation,
    getQuests,
    createQuestVerifyRequest,
    voteQuest,
    applyForPresale,
    verifySwap,
  };
}
