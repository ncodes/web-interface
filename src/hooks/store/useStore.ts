import create from "zustand";
import { defaultRegion } from "../../components/region/constants.ts";

export interface IStore {
  currentRegion?: string;
  setCurrentRegion?: (region: string) => void;

  // Search sheet state
  searchSheetOpen?: boolean;
  toggleSearchSheetOpen?: () => void;

  // Notification sheet state
  notifSheetOpen?: boolean;
  toggleNotifSheetOpen?: () => void;

  // MyWallet sheet state
  myWalletSheetOpen?: boolean;
  toggleMyWalletSheetOpen?: () => void;
}

const useStore = create<IStore>((set, get) => ({
  currentRegion: localStorage.getItem("region") || defaultRegion,
  setCurrentRegion: (region: string) => set({ currentRegion: region }),

  searchSheetOpen: false,
  toggleSearchSheetOpen: () => set({ searchSheetOpen: !get().searchSheetOpen }),

  notifSheetOpen: false,
  toggleNotifSheetOpen: () => set({ notifSheetOpen: !get().notifSheetOpen }),

  myWalletSheetOpen: false,
  toggleMyWalletSheetOpen: () =>
    set({ myWalletSheetOpen: !get().myWalletSheetOpen }),
}));

export default useStore;
