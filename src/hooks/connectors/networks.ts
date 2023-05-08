import * as ethers from "ethers";
import TokenInfo from "./token_info.ts";
import { Networks } from "../../types/global";

export enum Nets {
  ethereum = 1,
  goerli = 5,
  localhost = 31337,
}

/**
 * Mapping of supported networks' information
 */
export const SupportedNetworks: Networks = {
  1: {
    name: "Ethereum",
    chainId: ethers.utils.hexValue(1),
    eip1559: true,
    symbol: "ETH",
    rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL ?? "",
    blockExplorer: "https://etherscan.io",
    logoPath: "/images/eth.svg",
    tokenInfo: new TokenInfo({
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    }),
  },
  5: {
    name: "Goerli",
    chainId: ethers.utils.hexValue(5),
    eip1559: true,
    symbol: "ETH",
    rpcUrl: import.meta.env.VITE_GOERLI_RPC_URL ?? "",
    blockExplorer: "https://goerli.etherscan.io",
    logoPath: "/images/eth.svg",
    tokenInfo: new TokenInfo({
      address: "0x00",
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    }),
  },
  31337: {
    name: "Localhost",
    chainId: ethers.utils.hexValue(31337),
    eip1559: true,
    symbol: "ETH",
    rpcUrl: import.meta.env.VITE_LOCALHOST_RPC_URL ?? "",
    blockExplorer: "https://etherscan.io",
    logoPath: "/images/eth.svg",
    tokenInfo: new TokenInfo({
      address: "0x000",
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    }),
  },
  1337: {
    name: "Localhost",
    chainId: ethers.utils.hexValue(31337),
    eip1559: true,
    symbol: "ETH",
    rpcUrl: import.meta.env.VITE_LOCALHOST_RPC_URL ?? "",
    blockExplorer: "https://etherscan.io",
    logoPath: "/images/eth.svg",
    tokenInfo: new TokenInfo({
      address: "0x000",
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    }),
  },
};

/**
 * Get names of all supported networks
 * @param ignore - Optionally specify a name to omit in the result
 */
export function getSupportedNetworks(ignore: string[] = []) {
  return Object.keys(SupportedNetworks).filter((s) => !ignore.includes(s));
}

/**
 * Get a network by its chain ID
 * @param id - The chain ID
 */
export function getNetworkByChainId(id: number) {
  if (!id) return;
  const keys = getSupportedNetworks();
  for (let i = 0; i < keys.length; i++) {
    if (SupportedNetworks[keys[i]].chainId === ethers.utils.hexValue(id)) {
      return SupportedNetworks[keys[i]];
    }
  }
}

/**
 * Check if a chain is supported
 * @param id - The chain ID
 */
export function isChainSupported(id: number) {
  if (!id) return;
  const keys = getSupportedNetworks();
  for (let i = 0; i < keys.length; i++) {
    if (SupportedNetworks[keys[i]].chainId === ethers.utils.hexValue(id)) {
      return true;
    }
  }
  return false;
}
