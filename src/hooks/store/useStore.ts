import create from "zustand";
import { defaultRegion } from "../../components/region/constants.ts";
import {
  DefaultSettingsSheetTab,
  SettingsSheetTab,
} from "../../components/SettingsSheet.tsx";

export interface IStore {
  user: User | null;
  setUser: (user: User) => void;

  currentRegion?: string;
  setCurrentRegion?: (region: string) => void;

  // Search sheet state
  searchSheetOpen?: boolean;
  toggleSearchSheetOpen?: () => void;

  // Notification sheet state
  notifSheetOpen?: boolean;
  toggleNotifSheetOpen?: () => void;

  // Settings sheet state
  settingsSheetOpen?: boolean;
  toggleSettingsSheetOpen?: (tab?: SettingsSheetTab) => void;
  settingsSheetActiveTab?: SettingsSheetTab;

  // LoadingBar state
  loaderProgress?: number;
  setLoaderProgress?: (progress: number) => void;
}

const useStore = create<IStore>((set, get) => ({
  user: null,
  setUser: (user: User) => set({ user }),

  loaderProgress: 0,
  setLoaderProgress: (progress: number) => set({ loaderProgress: progress }),

  currentRegion: localStorage.getItem("region") || defaultRegion,
  setCurrentRegion: (region: string) => set({ currentRegion: region }),

  searchSheetOpen: false,
  toggleSearchSheetOpen: () => set({ searchSheetOpen: !get().searchSheetOpen }),

  notifSheetOpen: false,
  toggleNotifSheetOpen: () => set({ notifSheetOpen: !get().notifSheetOpen }),

  settingsSheetOpen: false,
  settingsSheetActiveTab: "balances",
  toggleSettingsSheetOpen: (tab?: SettingsSheetTab) => {
    set({
      settingsSheetOpen: !get().settingsSheetOpen,
      settingsSheetActiveTab: tab || DefaultSettingsSheetTab,
    });
  },
}));

export default useStore;
