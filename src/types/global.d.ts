import TokenInfo from "../hooks/connectors/token_info.ts";
import React from "react";

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
  testnet?: boolean;
  symbol: string;
  rpcUrl: string;
  blockExplorer: string;
  logoPath: React.Element;
  tokenInfo: TokenInfo;
  contracts?: Contracts;
}

declare global {
  type ContractNames = "energon" | "nft";

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

  interface TransactionResponse {}

  export enum AssetType {
    SYNTH,
    ERC20,
    ERC721,
    ERC1155,
  }

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
    allowZeroPrice: boolean;
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
    disputeDelayTime: number;
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
    released: boolean;
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
  }

  interface Dispute {
    network: string;
    creator: string;
    defendant: string;
    marketAddress: string;
    orderId: number;
    disputeId: number;
    numMediators: number;
    numMediatorsDrafted: number;
    wantRelease: boolean;
    redispute: boolean;
    evidenceEndAt: string;
    commitEndAt: string;
    revealEndAt: string;
    predictEndAt: string;
    executed: boolean;
    released: boolean;
    abandoned: boolean;
    orderReleased: boolean;
    notifiedOnEvidenceEndAt: boolean;
    notifiedOnCommitEndAt: boolean;
    notifiedOnRevealEndAt: boolean;
    swap: Swap;
  }
}
