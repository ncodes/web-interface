import create from "zustand";
import { defaultRegion } from "../../components/region/constants.ts";

export interface IStore {
  currentRegion?: string;
  setCurrentRegion?: (region: string) => void;
  searchSheetOpen?: boolean;
  toggleSearchSheetOpen?: () => void;
}

const useStore = create<IStore>((set, get) => ({
  currentRegion: localStorage.getItem("region") || defaultRegion,
  setCurrentRegion: (region: string) => set({ currentRegion: region }),
  searchSheetOpen: false,
  toggleSearchSheetOpen: () => set({ searchSheetOpen: !get().searchSheetOpen }),
}));

export default useStore;
