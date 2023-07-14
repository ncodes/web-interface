import create from "zustand";
import { createContext } from "react";
import { defaultRegion } from "../../components/region/useRegion.ts";

export const StoreContext = createContext<IStore | null>(null);

export interface IStore {
  currentRegion: string;
  setCurrentRegion: (region: string) => void;
}

export default function useStore() {
  return create<IStore>((set) => ({
    currentRegion: localStorage.getItem("region") || defaultRegion,
    setCurrentRegion: (region: string) => set({ currentRegion: region }),
  }));
}
