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
  }

  interface TransactionResponse {}

  enum AssetType {
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
}
