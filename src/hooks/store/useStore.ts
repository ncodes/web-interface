import create from "zustand";
import { defaultRegion } from "../../components/region/constants.ts";
import {
  DefaultSettingsSheetTab,
  SettingsSheetTab,
} from "../../components/SettingsSheet.tsx";

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
  settingsSheetOpen?: boolean;
  toggleSettingsSheetOpen?: (tab?: SettingsSheetTab) => void;
  settingsSheetActiveTab?: SettingsSheetTab;
}

const useStore = create<IStore>((set, get) => ({
  currentRegion: localStorage.getItem("region") || defaultRegion,
  setCurrentRegion: (region: string) => set({ currentRegion: region }),

  searchSheetOpen: false,
  toggleSearchSheetOpen: () => set({ searchSheetOpen: !get().searchSheetOpen }),

  notifSheetOpen: false,
  toggleNotifSheetOpen: () => set({ notifSheetOpen: !get().notifSheetOpen }),

  settingsSheetOpen: false,
  settingsSheetActiveTab: "balances",
  toggleSettingsSheetOpen: (tab?: SettingsSheetTab) =>
    set({
      settingsSheetOpen: !get().settingsSheetOpen,
      settingsSheetActiveTab: !tab
        ? DefaultSettingsSheetTab
        : tab || get().settingsSheetActiveTab,
    }),
}));

export default useStore;
