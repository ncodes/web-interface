import TokenInfo from "./token_info.ts";
import { ChainInfo } from "../../types/global";
import IconEthereum from "../../components/icons/IconEthereum.tsx";
import IconPolygon from "../../components/icons/IconPolygon.tsx";
import IconOptimism from "../../components/icons/IconOptimism.tsx";
import IconBSC from "../../components/icons/BSC.tsx";
import IconArbitrum from "../../components/icons/IconArbitrum.tsx";

export enum Nets {
  ethereum = 1,
  goerli = 5,
  localhost = 31337,
}

/**
 * Mapping of supported networks' information
 */
export const SupportedNetworks: ChainInfo[] = [
  {
    name: "Ethereum",
    chainId: 1,
    symbol: "ETH",
    rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL ?? "",
    blockExplorer: "https://etherscan.io",
    logoPath: IconEthereum,
    tokenInfo: new TokenInfo({
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/optimism/assets/0x4200000000000000000000000000000000000006/logo.png",
    }),
  },
  {
    name: "Polygon",
    chainId: 137,
    symbol: "MATIC",
    rpcUrl: import.meta.env.VITE_POLYGON_RPC_URL ?? "",
    blockExplorer: "https://polygonscan.com",
    logoPath: IconPolygon,
    tokenInfo: new TokenInfo({
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      name: "WMATIC",
      symbol: "WMATIC",
      decimals: 18,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png",
    }),
  },
  {
    name: "Optimism",
    chainId: 10,
    symbol: "ETH",
    rpcUrl: import.meta.env.VITE_OPTIMISM_RPC_URL ?? "",
    blockExplorer: "https://optimistic.etherscan.io",
    logoPath: IconOptimism,
    tokenInfo: new TokenInfo({
      address: "0x4200000000000000000000000000000000000006",
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    }),
  },
  {
    name: "Binance Chain",
    shortName: "BSC",
    chainId: 56,
    symbol: "BNB",
    rpcUrl: import.meta.env.VITE_BINANCE_RPC_URL ?? "",
    blockExplorer: "https://bscscan.com",
    logoPath: IconBSC,
    tokenInfo: new TokenInfo({
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      name: "WBNB",
      symbol: "WBNB",
      decimals: 18,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png",
    }),
  },
  {
    name: "Arbitrum",
    chainId: 42161,
    symbol: "ETH",
    rpcUrl: import.meta.env.VITE_ARBITRUM_RPC_URL ?? "",
    blockExplorer: "https://arbiscan.io",
    logoPath: IconArbitrum,
    tokenInfo: new TokenInfo({
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/optimism/assets/0x4200000000000000000000000000000000000006/logo.png",
    }),
  },
  {
    name: "Goerli",
    testnet: true,
    chainId: 5,
    symbol: "ETH",
    rpcUrl: import.meta.env.VITE_GOERLI_RPC_URL ?? "",
    blockExplorer: "https://goerli.etherscan.io",
    logoPath: IconEthereum,
    tokenInfo: new TokenInfo({
      address: "0x00",
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    }),
  },
  {
    name: "Hardhat",
    testnet: true,
    chainId: 31337,
    symbol: "ETH",
    rpcUrl: import.meta.env.VITE_LOCALHOST_RPC_URL ?? "",
    blockExplorer: "https://etherscan.io",
    logoPath: IconEthereum,
    tokenInfo: new TokenInfo({
      address: "0x000",
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    }),
  },
];

/**
 * Get IDs of all supported chains
 * @param testnetOnly Indicate whether to only return testnet chains
 * @param ignoreTestnet Indicate whether to ignore testnet chains
 * @param ignore - Optionally specify an ID to omit in the result
 */
export function getChains(
  testnetOnly = false,
  ignoreTestnet = false,
  ignore: number[] = []
) {
  let supported = SupportedNetworks;

  if (testnetOnly) {
    supported = supported.filter((s) => s.testnet);
  }

  return supported
    .filter(
      (s) => !ignore.includes(s.chainId) && (!ignoreTestnet || !s.testnet)
    )
    .map((s) => s.chainId);
}

/**
 * Get a chain by its chain ID
 * @param id - The chain ID
 */
export function getChain(id: number) {
  if (!id) return;
  return SupportedNetworks.find((s) => s.chainId === id);
}
