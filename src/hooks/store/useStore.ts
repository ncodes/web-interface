import { Socket } from "socket.io-client";
import { create } from "zustand";
import { defaultRegion } from "../../components/region/constants.ts";

type OpenStateKey =
  | "createOfferSheet"
  | "searchSheet"
  | "notificationSheet"
  | "reviewSheet"
  | "settingsSheet"
  | "buyTicketSheet"
  | "messengerSheet";

type OpenState = {
  [key in OpenStateKey]: boolean;
};

type OpenStateContext = {
  [key in OpenStateKey]: unknown;
};

export enum RestrictScope {
  GLOBAL,
  MARKET,
  OFFER,
  MARKET_PERM,
}

export interface IStore {
  // Authenticated user state
  user: User | undefined | null;
  setUser: (user: User | undefined | null) => void;

  // Connected wallet state
  walletHasNativeNFT: boolean;
  setUserHasNativeNFT: (enabled: boolean) => void;

  // Protocol fees
  protoFee: ProtocolFees;
  setProtoFee: (fees: ProtocolFees) => void;

  contractsParams: Partial<ContractsParams>;
  setContractsParams: (params: ContractsParams) => void;

  // Region state
  currentRegion: string;
  setCurrentRegion: (region: string) => void;

  // Safe mode state
  enabledSafeMode: boolean;
  setEnabledSafeMode: (enabled: boolean) => void;

  // Top loading state
  loaderProgress: number;
  fullLoadCount: number;
  setLoaderProgress: (progress: number) => void;

  // Global loading stage
  loading: { [id: string]: LoadingState };
  setLoading: (id: string, updates: LoadingState) => void;

  // Current tab
  currentTab: string;
  setCurrentTab: (tab: string) => void;

  // Open state toggling for sheets and modals
  openStateContext: Partial<OpenStateContext>;
  openState: OpenState;
  toggleOpenState: (
    key: OpenStateKey,
    activeTab?: string,
    ctx?: unknown,
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

  // Country code
  countryCode: string;
  setCountryCode: (countryCode: string) => void;

  restricted: boolean;
  setRestricted: (restricted: boolean) => void;

  restrictedScope: RestrictScope;
  setRestrictedScope: (scope: RestrictScope) => void;

  mousePosition: { x: number; y: number };
  setMousePosition: (x: number, y: number) => void;

  socket?: Socket;
  setSocket: (socket: Socket) => void;
}

const useStore = create<IStore>((set, get) => ({
  user: undefined,
  setUser: (user: User | undefined | null) => set({ user }),

  walletHasNativeNFT: false,
  setUserHasNativeNFT: (enabled: boolean) =>
    set({ walletHasNativeNFT: enabled }),

  protoFee: {
    instantNFTSwapFeeBp: 0,
    instantSwapFeeBp: 0,
    syntheticSwapFeeBp: 0,
    stableSwapFeeBp: 0,
    fixedNFTSwapFee: 0,
    fixedSynthSwapFee: 0,
  },
  setProtoFee: (fees: ProtocolFees) => set({ protoFee: fees }),

  contractsParams: {},
  setContractsParams: (params: ContractsParams) =>
    set({ contractsParams: params }),

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

  enabledSafeMode: JSON.parse(
    localStorage.getItem("enabledSafeMode") || "false",
  ),
  setEnabledSafeMode: (enabled: boolean) => {
    localStorage.setItem("enabledSafeMode", JSON.stringify(enabled));
    set({ enabledSafeMode: enabled });
  },

  openStateContext: {},
  openState: {
    createOfferSheet: false,
    searchSheet: false,
    notificationSheet: false,
    reviewSheet: false,
    settingsSheet: false,
    buyTicketSheet: false,
    messengerSheet: false,
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
        messengerSheet: false,
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

  countryCode: "",
  setCountryCode: (countryCode: string) => set({ countryCode: countryCode }),

  restricted: false,
  setRestricted: (restricted: boolean) => set({ restricted }),

  restrictedScope: RestrictScope.GLOBAL,
  setRestrictedScope: (scope: RestrictScope) => set({ restrictedScope: scope }),

  mousePosition: { x: 0, y: 0 },
  setMousePosition: (x: number, y: number) => set({ mousePosition: { x, y } }),

  socket: undefined,
  setSocket: (socket: Socket) => set({ socket }),
}));

export default useStore;
