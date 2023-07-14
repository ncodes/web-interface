import useStore from "../../hooks/store/useStore.ts";
import { regions } from "./constants.ts";

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
  const setCurrentRegion = useStore((state) => state.setCurrentRegion);

  function setRegion(region: string) {
    setCurrentRegion?.(region);
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
    currentRegion: useStore((state) => state.currentRegion),
    setRegion,
  };
}
