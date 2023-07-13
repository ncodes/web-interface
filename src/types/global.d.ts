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
  name: string;
  shortName?: string;
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

  interface User {}

  interface TransactionResponse {}
}
