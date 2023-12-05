import useStore from "../../hooks/store/useStore.ts";
import { Region, regions } from "./constants.ts";
import { ReactElement, SVGProps } from "react";

/**
 * Get the icon for a region
 * @param region
 */
function getRegionIcon(
  region: string
): (props: SVGProps<SVGSVGElement>) => ReactElement {
  const found = regions.find((r) => r.name === region || r.value === region);
  if (!found) throw new Error(`Region ${region} not found`);
  return found.icon;
}

/**
 * Get the icon for a region
 * @param region
 */
function getRegion(region: string): Region {
  const found = regions.find((r) => r.name === region || r.value === region);
  if (!found) throw new Error(`Region ${region} not found`);
  return found;
}

/**
 * Hook for managing the region
 */
export default function useRegion() {
  const setCurrentRegion = useStore((state) => state.setCurrentRegion);

  function setRegion(region: string) {
    setCurrentRegion?.(region);
    localStorage.setItem("region", region);
  }

  /**
   * Get the regions excluding the ones in ignore
   * @param ignore The regions to ignore
   */
  function getRegions(ignore: string[]): Region[] {
    return regions.filter((r) => !ignore.includes(r.name));
  }

  return {
    regions,
    getRegions,
    getRegionIcon,
    currentRegion: useStore((state) => state.currentRegion),
    setRegion,
    getRegion,
  };
}
