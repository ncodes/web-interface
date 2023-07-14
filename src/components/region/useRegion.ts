import { IconGlobeColor } from "../icons/IconGlobeColor.tsx";
import { IconFlagUSA } from "../icons/IconFlagUSA.tsx";
import { IconFlagUK } from "../icons/IconFlagUK.tsx";
import { IconFlagNigeria } from "../icons/IconFlagNigeria.tsx";
import { IconFlagFrance } from "../icons/IconFlagFrance.tsx";
import { IconFlagChina } from "../icons/IconFlagChina.tsx";
import useStore from "../../hooks/store/useStore.ts";

export const defaultRegion = "ALL";

const regions = [
  { name: "ALL", icon: IconGlobeColor },
  { name: "US", icon: IconFlagUSA },
  { name: "UK", icon: IconFlagUK },
  { name: "NG", icon: IconFlagNigeria },
  { name: "FR", icon: IconFlagFrance },
  { name: "CN", icon: IconFlagChina },
];

/**
 * Get the icon for a region
 * @param region
 */
function getRegionIcon(region: string) {
  const found = regions.find((r) => r.name === region);
  if (!found) throw new Error(`Region ${region} not found`);
  return found.icon;
}

/**
 * Hook for managing the region
 */
export default function useRegion() {
  const store = useStore();
  const setCurrentRegion = store((state) => state.setCurrentRegion);

  function setRegion(region: string) {
    setCurrentRegion(region);
    localStorage.setItem("region", region);
  }

  /**
   * Get the regions excluding the ones in ignore
   * @param ignore The regions to ignore
   */
  function getRegion(ignore: string[]) {
    return regions.filter((r) => !ignore.includes(r.name));
  }

  return {
    regions,
    getRegion,
    getRegionIcon,
    currentRegion: store((state) => state.currentRegion),
    setRegion,
  };
}
