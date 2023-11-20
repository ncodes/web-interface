import React from "react";
import { Address } from "viem";
import TokenInfo from "../hooks/connectors/token_info.ts";
import { AssetType, Events } from "./enums.ts";

interface ContractInfo<ABIType> {
  address: string;
  abi: ABIType;
}

type Contracts = {
  [key in ContractNames]: ContractInfo;
};

interface ChainInfo {
  displayName: string; // The primary name of the chain
  altDisplayName?: string; // Used for displaying the chain name in the UI if displayName is too long
  queryName: string; // Used for identifying the chain on the backend
  chainId: number;
  disabled?: boolean;
  testnet?: boolean;
  symbol: string;
  apiUrl: string;
  rpcUrl: string;
  blockExplorer: string;
  logoPath: React.Element;
  wrappedTokenInfo: TokenInfo;
  contracts?: Contracts;
}

declare global {
  type ContractNames =
    | "core"
    | "token"
    | "energon"
    | "nft"
    | "badgeManager"
    | "marketCore"
    | "disputeManager"
    | "mediatorManager";

  interface User {
    email: string;
    address: string;
    locale: string;
    timezone: string;
    role: string;

    totalSwaps: number;
    completionRate: number;
    badges: string[];
    volume: string;
    volumeUsd: number;
    lastActiveAt: string;
  }

  interface LoadingState {
    cancelOrder?: boolean;
    markOrderAsPaid?: boolean;
    releaseOrder?: boolean;
    appealOrder?: boolean;
    commitVote?: boolean;
    revealVote?: boolean;
  }

  interface TransactionResponse {}

  export interface Asset {
    asset: string;
    type: AssetType;
  }

  interface Market {
    address: string;
    creator: string;
    network: string;
    base: string;
    baseAddress: string;
    baseType: AssetType;
    baseDecimals: number;
    quote: string;
    quoteAddress: string;
    quoteDecimals: number;
    quoteType: AssetType;
    instant: boolean;
    enabledZeroOfferPrice: boolean;
    offerOnly: boolean;
    pair: string;
    commission: number;
    lastSwapAt: string;
    amountSwapped: string;
    completionRate: number;
    txHash: string;
    mediatorPoolId: number;
    openDisputes: number;
    totalDisputes: number;
    totalSwaps: number;
    disputeRate: number;
    permPut: boolean;
    permSwap: boolean;
    renounced: boolean;
    disputeDelayDur: number;
    evidenceDur: number;
    predictDur: number;
    manager: string;
    totalLiquidity: string;
    requiredPutBadges: string[];
    requiredSwapBadges: string[];
    avgFinalizeDur: number;
    avgPaymentDur: number;
    avgReleaseDur: number;
    lowestPrice: string;
    numDisputes: number;
    baseLogo: string;
    quoteLogo: string;
    numProviders: string;
    lowestPriceUsd: string;
    lowestPrice24h: string;
    highestPrice24h: string;
    priceChange: number;
    totalSwaps24h: string;
    volume24h: string;
    amountSwappedUsd: string;
    totalLiquidityUsd: string;
  }

  interface Liquidity {
    network: string;
    provider: string;
    lid: number;
    marketAddress: string;
    base: string;
    baseAddress: string;
    baseType: AssetType;
    quote: string;
    quoteAddress: string;
    quoteType: AssetType;
    amount: string;
    amountSwapped: string;
    price: string;
    minSwap: string;
    maxSwap: string;
    target: string;
    ids: number[];
    wantOrIds: number[];
    wantAndIds: number[];
    timeToPay: number;
    manager: string;
    paused: boolean;
    swapDisabled: boolean;
    openOrders: number;
    lastSwapAt: string;
    completionRate: number;
    openDisputes: number;
    totalDisputes: number;
    totalSwaps: number;
    disputeRate: number;
    satisfactoryRate: number;
    requiredSwapBadges: string[];
    paymentMethods: string[];
    avgFinalizeDur: number;
    avgPaymentDur: number;
    avgReleaseDur: number;
    totalSwaps24h: string;
    volume24h: string;
    priceChange: number;
    priceUsd: number;
    amountUsd: number;
    minSwapUsd: number;
    maxSwapUsd: number;
    createdAt: string;
    updatedAt: string;
    online: boolean;
    lastTimeOnline: string;
    market: Market;
  }

  interface Swap {
    network: string;
    marketAddress: string;
    base: string;
    baseAddress: string;
    quote: string;
    quoteAddress: string;
    orderId: number;
    lid: number;
    provider: string;
    taker: string;
    offerId: number;
    amount: string;
    valueUsd: string;
    price: string;
    instant: boolean;
    paid: boolean;
    payer: string;
    cancelled: boolean;
    released?: boolean | undefined;
    finalizer: string;
    byDispute: boolean;
    providerIds: number[];
    takerIds: number[];
    protocolFee: string;
    marketCreatorFee: string;
    operator: number;
    cancelAt: string;
    disputeFrom: string;
    txHash: string;
    finalizedAt: string;
    paidAt: string;
    priceUsd: number;
    cost: number;
    costUsd: number;
    amountUsd: number;
    fee: string;
    feeUsd: number;
    feeSymbol: string;
    market: Market;
    liquidity: Liquidity;
    disputes: Dispute[];
    createdAt: string;
    nonce: number;
  }

  interface Offer {
    network: string;
    marketAddress: string;
    provider: string;
    lid: number;
    offerId: number;
    creator: string;
    amount: string;
    price: string;
    priceUsd: number;
    amountUsd: number;
    ids: number[];
    accepted: boolean;
    cancelled: boolean;
    executed: boolean;
    execAt: string;
    deadline: string;
    createdAt: string;
    updatedAt: string;
    market: Market;
    liquidity: Liquidity;
    swap: Swap;
  }

  interface Dispute {
    network: string;
    creator: string;
    defendant: string;
    marketAddress: string;
    orderId: number;
    disputeId: number;
    ticketIndex: number;
    numMediators: number;
    numMediatorsDrafted: number;
    numMediatorsUndrafted: number;
    wantRelease: boolean;
    redispute: boolean;
    evidenceEndAt: string;
    commitEndAt: string;
    revealEndAt: string;
    predictEndAt: string;
    executed: boolean;
    released?: boolean | undefined;
    abandoned: boolean;
    orderReleased: boolean;
    notifiedOnEvidenceEndAt: boolean;
    notifiedOnCommitEndAt: boolean;
    notifiedOnRevealEndAt: boolean;
    createdAt: string;
    updatedAt: string;
    draftees: Draft[];
    swap: Swap;
    reveals: Reveal[];
    commits: Commit[];
  }

  interface Commit {
    network: string;
    committer: string;
    marketAddress: string;
    orderId: number;
    disputeId: number;
    ticketIndex: number;
    hash: string;
    drafted: boolean;
  }

  interface Draft {
    network: string;
    owner: string;
    index: number;
    marketAddress: string;
    ticketId: string;
    orderId: number;
    disputeIndex: number;
    disputeId: string;
  }

  interface Reveal {
    network: string;
    revealer: string;
    marketAddress: string;
    orderId: number;
    disputeId: number;
    ticketIndex: number;
    vote: string;
    drafted: boolean;
  }

  interface Ticket {
    network: string;
    owner: string;
    index: number;
    orderId: number;
    poolId: number;
    disputeId: number;
    bond: string;
    matureAt: string;
    joinBy: string;
    txHash: string;
    joined: boolean;
    drained: boolean;
    drafted: boolean;
    slashed: boolean;
    cancelAt: string;
    drainedAt: string;
    draftedAt: string;
    matured: boolean;
    expired: boolean;
    cancelling: boolean;
    cancelled: boolean;
    bondUsd: number;
    slashedAmt: string;
    slashedAmtUsd: number;
    createdAt: string;
    updatedAt: string;
    market: Market;
    drafts: Draft[];
  }

  interface Notification {
    network: string;
    id: string;
    type: NotificationType;
    userId: string;
    title: string;
    body: string;
    orderId: number;
    offerId: number;
    read: boolean;
    createdAt: string;
  }

  interface TicketStats {
    totalBonds: string;
    totalBondsUsd: number;
    price: string;
    priceUsd: number;
    ticketSupply: number;
    ticketAvailable: number;
    owner?: {
      totalBonds?: string;
      totalBondsUsd?: number;
      total?: string;
    };
  }

  interface Event {
    sn: number;
    network: string;
    marketAddress: string;
    orderId: number;
    action: Events;
    creator: string;
    offerId: number;
    amount: string;
    price: string;
    provider: string;
    lid: number;
    minSwap: string;
    maxSwap: string;
    target: string;
    timeToPay: number;
    manager: string;
    paused: boolean;
    disputeId: number;
    draftee: string;
    vote: string;
    ids: number[];
    createdAt: string;
    offer: Offer;
    swap: Swap;
    dispute: Dispute;
    market: Market;
    liquidity: Liquidity;
  }

  type Instructions = {
    global: string;
    liquidity: { [key: string]: string };
  };

  interface AssetInfo {
    asset?: string;
    type: "ERC20" | "SYNTHETIC";
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    price: number; // Used in dev mode only
    isSynthetic: boolean; // Used to identify synthetic tokens
  }

  interface PaymentMethod {
    badge: string;
    name: string;
    shortName?: string;
    logoUrl: string;
    region?: string;
  }

  interface ButtonEnableState {
    appeal?: boolean;
    cancel?: boolean;
    markAsPaid?: boolean;
    release?: boolean;
  }

  type MediatorPool = {
    name: string;
    description: string;
    id: number;
    reqBond: string;
    draftReward: string;
    winReward: string;
    noVoteSlashBP: number;
    loseVoteSlashBP: number;
    numDraftees: number;
  };

  type CoreContractState = [
    instantSwapFeeBp: {
      fixedNFTSwapFee: bigint;
      fixedSynthSwapFee: bigint;
      instantNFTSwapFeeBp: bigint;
      instantSwapFeeBp: bigint;
      maxOpenDisputes: bigint;
      maxOpenOrders: bigint;
      stableSwapFeeBp: bigint;
      synthSwapFeeBp: bigint;
    },
    minTimeToPay: bigint,
    orderGraceDur: bigint,
    numOrders: bigint,
    feePoolTxInterval: bigint,
    inventor: Address,
    ammSwapRouter: Address,
  ];

  type ProtocolFees = {
    instantSwapFeeBp: number;
    syntheticSwapFeeBp: number;
    stableSwapFeeBp: number;
    fixedSynthSwapFee: number;
    fixedNFTSwapFee: number;
    instantNFTSwapFeeBp: number;
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
    query?: string;
    kycTaker?: boolean;
    offer?: boolean;
    address?: string;
    creator?: string;
    permSwap?: boolean;
    regions?: string;
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
}
