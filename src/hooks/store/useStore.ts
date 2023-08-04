import create from "zustand";
import { defaultRegion } from "../../components/region/constants.ts";

type OpenStateKey =
  | "createOfferSheet"
  | "searchSheet"
  | "notifSheet"
  | "reviewSheet"
  | "settingsSheet"
  | "buyTicketSheet";

export interface IStore {
  // Authenticated user state
  user: User | null;
  setUser: (user: User) => void;

  // Region state
  currentRegion?: string;
  setCurrentRegion?: (region: string) => void;

  // LoadingBar state
  loaderProgress?: number;
  setLoaderProgress?: (progress: number) => void;

  // Current tab
  currentTab?: string;
  setCurrentTab?: (tab: string) => void;

  // Open state toggling for sheets and modals
  openState: {
    [key in OpenStateKey]: boolean;
  };
  toggleOpenState: (key: OpenStateKey, activeTab?: string) => void;
}

const useStore = create<IStore>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),

  loaderProgress: 0,
  setLoaderProgress: (progress: number) => set({ loaderProgress: progress }),

  currentRegion: localStorage.getItem("region") || defaultRegion,
  setCurrentRegion: (region: string) => set({ currentRegion: region }),

  currentTab: "",
  setCurrentTab: (tab: string) => set({ currentTab: tab }),

  openState: {
    createOfferSheet: false,
    searchSheet: false,
    notifSheet: false,
    reviewSheet: false,
    settingsSheet: false,
    buyTicketSheet: false,
  },
  toggleOpenState: (key: OpenStateKey, activeTab?: string) => {
    set((state) => ({
      currentTab: activeTab || "",
      openState: {
        ...state.openState,
        [key]: !state.openState[key],
      },
    }));
  },
}));

export default useStore;
