import { useMarketService } from "../services/backend/useMarketService";
import MarketsAllowlist from "./allowlist";

export function useGeofence() {
  const { getMarket } = useMarketService();

  /**
   * Checks if the country code is disallowed for all parts of the website
   * @param countryCode The country code
   * @returns
   */
  function isGlobalDisallowed(countryCode: string) {
    const globalDisallowed = import.meta.env.VITE_GF_DISALLOW;
    if (!globalDisallowed) return false;
    return globalDisallowed.split(",").includes(countryCode);
  }

  /**
   * Checks if the country code is disallowed for interactive markets
   * @param network The network name
   * @param marketAddress The market address
   * @param countryCode The country code
   */
  async function isDisallowedForInteractiveMarket(
    network: string,
    marketAddress: string,
    countryCode: string,
  ) {
    const disallowedCountries = import.meta.env
      .VITE_GF_DISALLOW_INTERACTIVE_MKT;
    if (!disallowedCountries) return false;

    const market = await getMarket({
      queryKey: ["getMarket", { network, market: marketAddress }],
    } as any);

    if (market.instant) return false;

    return disallowedCountries.split(",").includes(countryCode);
  }

  /**
   * Checks if the country code is disallowed for a specific market
   * @param network The network name
   * @param marketAddress The market address
   * @param countryCode The country code
   * @returns
   */
  async function isDisallowedForMarket(
    network: string,
    marketAddress: string,
    countryCode: string,
  ) {
    const disallowedCountries: string =
      import.meta.env.VITE_GF_DISALLOW_MKT || "";

    const parsedRules = disallowedCountries.split(",").map((v) => {
      if (v === "") return {};
      const parts = v.split(":");
      const res = {};
      res[parts[0]] = parts[1].split("|");
      return res;
    });

    // merge into a single object
    const mergedRules = Object.assign({}, ...parsedRules);

    if (mergedRules[`${network}_${marketAddress}`]) {
      return mergedRules[`${network}_${marketAddress}`].includes(countryCode);
    }

    return false;
  }

  /**
   * Check if the user is allowed to access the market
   * @param network The network name
   * @param marketAddress The market address
   * @param userAddress The user address
   */
  async function isAllowedForMarket(
    network: string,
    marketAddress: string,
    userAddress: string,
  ) {
    const allowList = MarketsAllowlist;
    const marketKey = `${network}_${marketAddress}`;
    if (!allowList || !allowList[marketKey]) return true;
    return (
      (allowList[marketKey] as string[]).find(
        (addr) => addr.toLowerCase() === userAddress.toLowerCase(),
      ) != null
    );
  }

  return {
    isGlobalDisallowed,
    isDisallowedForInteractiveMarket,
    isDisallowedForMarket,
    isAllowedForMarket,
  };
}
