import { create } from "zustand";
import { defaultRegion } from "../../components/region/constants.ts";

type OpenStateKey =
  | "createOfferSheet"
  | "searchSheet"
  | "notificationSheet"
  | "reviewSheet"
  | "settingsSheet"
  | "buyTicketSheet";

type OpenState = {
  [key in OpenStateKey]: boolean;
};

type OpenStateContext = {
  [key in OpenStateKey]: unknown;
};

export interface MarketFilter {
  base?: string;
  quote?: string;
  price?: string;
  priceUsd?: string;
  liquidity?: string;
  liquidityUsd?: string;
  merchantLp?: boolean;
  kycLp?: boolean;
  kycTaker?: boolean;
  offer?: boolean;
  address?: string;
  creator?: string;
  permSwap?: boolean;
  permPut?: boolean;
  putBadges?: string;
  swapBadges?: string;
}

export interface LiquidityFilter {
  base?: string;
  quote?: string;
  market?: string;
  provider?: string;
  paused?: boolean;
  price?: string;
  liquidities?: { marketAddress: string; provider: string; lid: number }[];
  priceUsd?: string;
  amount?: string;
  amountUsd?: string;
  kycLp?: boolean;
  kycTaker?: boolean;
  swapBadges?: string;
  paymentMethods?: string;
}

export interface SwapFilter {
  base?: string;
  quote?: string;
  marketAddress?: string;
  type?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface OfferFilter {
  marketAddress?: string;
  provider?: string;
  lid?: number;
  creator?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface DisputeFilter {
  marketAddress?: string;
  participant?: string;
  creator?: string;
  defendant?: string;
  orderId?: number;
  disputeId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface TicketFilter {
  poolId?: number;
  orderId?: number;
  disputeId?: number;
  owner?: string;
  status?: string;
}

export interface SwapPageState {
  revealPhaseEnded?: boolean;
}

export interface IStore {
  // Authenticated user state
  user: User | undefined | null;
  setUser: (user: User | undefined | null) => void;

  // Region state
  currentRegion?: string;
  setCurrentRegion?: (region: string) => void;

  // Top loading state
  loaderProgress: number;
  fullLoadCount: number;
  setLoaderProgress: (progress: number) => void;

  // Global loading stage
  loading: { [id: string]: LoadingState };
  setLoading: (id: string, updates: LoadingState) => void;

  // Current tab
  currentTab?: string;
  setCurrentTab?: (tab: string) => void;

  // Open state toggling for sheets and modals
  openStateContext: OpenStateContext;
  openState: OpenState;
  toggleOpenState: (
    key: OpenStateKey,
    activeTab?: string,
    ctx?: unknown
  ) => void;
  resetOpenState: () => void;

  // Swap page state
  swapPageState: SwapPageState;
  setPageSwapState: (state: SwapPageState) => void;

  // Market filter
  marketFilter: MarketFilter;
  setMarketFilter: (filter: Partial<MarketFilter>) => void;

  // Liquidity filter
  liquidityFilter: LiquidityFilter;
  setLiquidityFilter: (filter: Partial<LiquidityFilter>) => void;

  // Swap filter
  swapFilter: SwapFilter;
  setSwapFilter: (filter: Partial<SwapFilter>) => void;

  // Offer filter
  offerFilter: OfferFilter;
  setOfferFilter: (filter: Partial<OfferFilter>) => void;

  // Dispute filter
  disputeFilter: DisputeFilter;
  setDisputeFilter: (filter: Partial<DisputeFilter>) => void;

  // Ticket Filter
  ticketFilter: TicketFilter;
  setTicketFilter: (filter: Partial<TicketFilter>) => void;
}

const useStore = create<IStore>((set, get) => ({
  user: undefined,
  setUser: (user: User | undefined | null) => set({ user }),

  loaderProgress: 0,
  fullLoadCount: 0,
  setLoaderProgress: (progress: number) => {
    set({
      loaderProgress: progress,
      fullLoadCount:
        progress == 100 ? get().fullLoadCount + 1 : get().fullLoadCount,
    });
  },

  loading: {},
  setLoading: (id: string, updates: Partial<LoadingState>) => {
    set((state) => ({
      loading: {
        ...state.loading,
        [id]: { ...state.loading[id], ...updates },
      },
    }));
  },

  currentRegion: localStorage.getItem("region") || defaultRegion,
  setCurrentRegion: (region: string) => set({ currentRegion: region }),

  currentTab: "",
  setCurrentTab: (tab: string) => set({ currentTab: tab }),

  openStateContext: {},
  openState: {
    createOfferSheet: false,
    searchSheet: false,
    notificationSheet: false,
    reviewSheet: false,
    settingsSheet: false,
    buyTicketSheet: false,
  },
  toggleOpenState: (key: OpenStateKey, activeTab?: string, ctx?: unknown) => {
    set((state) => ({
      currentTab: activeTab || "",
      openStateContext: {
        ...state.openStateContext,
        [key]: ctx,
      },
      openState: {
        ...state.openState,
        [key]: !state.openState[key],
      },
    }));
  },
  resetOpenState: () => {
    set({
      currentTab: "",
      openStateContext: {},
      openState: {
        createOfferSheet: false,
        searchSheet: false,
        notificationSheet: false,
        reviewSheet: false,
        settingsSheet: false,
        buyTicketSheet: false,
      },
    });
  },

  marketFilter: {},
  setMarketFilter: (filter: Partial<MarketFilter>) => {
    set((state) => ({
      marketFilter: {
        ...state.marketFilter,
        ...filter,
      },
    }));
  },

  swapPageState: {},
  setPageSwapState: (updates: Partial<SwapPageState>) => {
    set((state) => ({
      swapPageState: {
        ...state.swapPageState,
        ...updates,
      },
    }));
  },

  liquidityFilter: {},
  setLiquidityFilter: (filter: Partial<LiquidityFilter>) => {
    set((state) => ({
      liquidityFilter: {
        ...state.liquidityFilter,
        ...filter,
      },
    }));
  },

  swapFilter: {},
  setSwapFilter: (filter: Partial<SwapFilter>) => {
    set((state) => ({
      swapFilter: {
        ...state.swapFilter,
        ...filter,
      },
    }));
  },

  offerFilter: {},
  setOfferFilter: (filter: Partial<OfferFilter>) => {
    set((state) => ({
      offerFilter: {
        ...state.offerFilter,
        ...filter,
      },
    }));
  },

  disputeFilter: {},
  setDisputeFilter: (filter: Partial<DisputeFilter>) => {
    set((state) => ({
      disputeFilter: {
        ...state.disputeFilter,
        ...filter,
      },
    }));
  },

  ticketFilter: {},
  setTicketFilter: (filter: Partial<TicketFilter>) => {
    set((state) => ({
      ticketFilter: {
        ...state.ticketFilter,
        ...filter,
      },
    }));
  },
}));

export default useStore;
