import BadgeManagerABI from "../../abi/BadgeManager.json";
import CoreABI from "../../abi/Core.json";
import DisputeManagerABI from "../../abi/DisputeManager.json";
import EnergonABI from "../../abi/Energon.json";
import MarketCoreABI from "../../abi/MarketCore.json";
import NftABI from "../../abi/NFT.json";
import MediatorManagerABI from "../../abi/MediatorManager.json";
import NativeTokenABI from "../../abi/Token.json";
import IconBSC from "../../components/icons/BSC.tsx";
import IconArbitrum from "../../components/icons/IconArbitrum.tsx";
import IconEthereum from "../../components/icons/IconEthereum.tsx";
import IconOptimism from "../../components/icons/IconOptimism.tsx";
import IconPolygon from "../../components/icons/IconPolygon.tsx";
import { ChainInfo } from "../../types/global";
import TokenInfo from "./token_info.ts";

export enum ChainID {
  Ethereum = 1,
  Goerli = 5,
  Hardhat = 31337,
  Polygon = 137,
  Optimism = 10,
  Arbitrum = 42161,
  Binance = 56,
}

/**
 * Mapping of supported networks' information
 */
export const SupportedNetworks: ChainInfo[] = [
  {
    displayName: "Ethereum",
    queryName: "ethereum",
    chainId: ChainID.Ethereum,
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
    contracts: {
      core: {
        address: import.meta.env.VITE_ETHEREUM_CORE_ADDRESS,
        abi: CoreABI,
      },
      token: {
        address: import.meta.env.VITE_ETHEREUM_TOKEN_ADDRESS,
        abi: NativeTokenABI,
      },
      badgeManager: {
        address: import.meta.env.VITE_ETHEREUM_BADGE_MGR_ADDRESS,
        abi: BadgeManagerABI,
      },
      marketCore: {
        address: import.meta.env.VITE_ETHEREUM_MARKET_CORE_ADDRESS,
        abi: MarketCoreABI,
      },
      disputeManager: {
        address: import.meta.env.VITE_ETHEREUM_DISPUTE_MGR_ADDRESS,
        abi: DisputeManagerABI,
      },
      mediatorManager: {
        address: import.meta.env.VITE_ETHEREUM_MEDIATOR_MGR_ADDRESS,
        abi: MediatorManagerABI,
      },
      energon: {
        address: import.meta.env.VITE_ETHEREUM_ENERGON_ADDRESS,
        abi: EnergonABI,
      },
      nft: {
        address: import.meta.env.VITE_ETHEREUM_NFT_ADDRESS,
        abi: NftABI,
      },
    },
  },
  {
    displayName: "Polygon",
    queryName: "polygon",
    chainId: ChainID.Polygon,
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
    displayName: "Optimism",
    queryName: "optimism",
    chainId: ChainID.Optimism,
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
    displayName: "Binance Chain",
    altDisplayName: "BSC",
    queryName: "binance-chain",
    chainId: ChainID.Binance,
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
    displayName: "Arbitrum",
    queryName: "arbitrum",
    chainId: ChainID.Arbitrum,
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
    displayName: "Goerli",
    queryName: "goerli",
    testnet: true,
    chainId: ChainID.Goerli,
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
    displayName: "Hardhat",
    queryName: "localhost",
    testnet: true,
    chainId: ChainID.Hardhat,
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
    contracts: {
      core: {
        address: import.meta.env.VITE_LOCALHOST_CORE_ADDRESS,
        abi: CoreABI,
      },
      token: {
        address: import.meta.env.VITE_LOCALHOST_TOKEN_ADDRESS,
        abi: NativeTokenABI,
      },
      badgeManager: {
        address: import.meta.env.VITE_LOCALHOST_BADGE_MGR_ADDRESS,
        abi: BadgeManagerABI,
      },
      marketCore: {
        address: import.meta.env.VITE_LOCALHOST_MARKET_CORE_ADDRESS,
        abi: MarketCoreABI,
      },
      disputeManager: {
        address: import.meta.env.VITE_LOCALHOST_DISPUTE_MGR_ADDRESS,
        abi: DisputeManagerABI,
      },
      mediatorManager: {
        address: import.meta.env.VITE_LOCALHOST_MEDIATOR_MGR_ADDRESS,
        abi: MediatorManagerABI,
      },
      energon: {
        address: import.meta.env.VITE_LOCALHOST_ENERGON_ADDRESS,
        abi: EnergonABI,
      },
      nft: {
        address: import.meta.env.VITE_LOCALHOST_NFT_ADDRESS,
        abi: NftABI,
      },
    },
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
