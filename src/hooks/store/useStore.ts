import create from "zustand";
import { defaultRegion } from "../../components/region/useRegion.ts";

export interface IStore {
  currentRegion?: string;
  setCurrentRegion?: (region: string) => void;
}

const useStore = create<IStore>((set) => ({
  currentRegion: localStorage.getItem("region") || defaultRegion,
  setCurrentRegion: (region: string) => set({ currentRegion: region }),
}));

export default useStore;
