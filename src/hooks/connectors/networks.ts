import {
  arbitrum,
  bsc,
  hardhat,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "viem/chains";
import BadgeManagerABI from "../../abi/BadgeManager.json";
import CoreABI from "../../abi/Core.json";
import DisputeManagerABI from "../../abi/DisputeManager.json";
import EnergonABI from "../../abi/Energon.json";
import MarketCoreABI from "../../abi/MarketCore.json";
import MediatorManagerABI from "../../abi/MediatorManager.json";
import NftABI from "../../abi/NFT.json";
import NativeTokenABI from "../../abi/Token.json";
import WETHABI from "../../abi/WETH.json";
import IconBSC from "../../components/icons/BSC.tsx";
import IconArbitrum from "../../components/icons/IconArbitrum.tsx";
import IconEthereum from "../../components/icons/IconEthereum.tsx";
import IconOptimism from "../../components/icons/IconOptimism.tsx";
import IconPolygon from "../../components/icons/IconPolygon.tsx";
import { ChainInfo } from "../../types/global";
import TokenInfo from "./token_info.ts";

/**
 * Mapping of supported networks' information
 */
export const SupportedNetworks: ChainInfo[] = [
  {
    disabled: true,
    displayName: "Ethereum",
    queryName: "ethereum",
    chainId: mainnet.id,
    chain: mainnet,
    symbol: "ETH",
    apiUrl: import.meta.env.VITE_ETHEREUM_API_URI,
    rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL,
    blockExplorer: "https://etherscan.io",
    logoPath: IconEthereum,
    wrappedTokenInfo: new TokenInfo({
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      name: "WETH",
      symbol: "WETH",
      abi: WETHABI,
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
    disabled: true,
    displayName: "Polygon",
    queryName: "polygon",
    chainId: polygon.id,
    chain: polygon,
    symbol: "MATIC",
    apiUrl: import.meta.env.VITE_POLYGON_API_URI,
    rpcUrl: import.meta.env.VITE_POLYGON_RPC_URL ?? "",
    blockExplorer: "https://polygonscan.com",
    logoPath: IconPolygon,
    wrappedTokenInfo: new TokenInfo({
      address: import.meta.env.VITE_POLYGON_WRAPPED_TOKEN_ADDRESS,
      name: "WMATIC",
      symbol: "WMATIC",
      abi: WETHABI,
      decimals: 18,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png",
    }),
  },
  {
    disabled: true,
    displayName: "Optimism",
    queryName: "optimism",
    chainId: optimism.id,
    chain: optimism,
    symbol: "ETH",
    apiUrl: import.meta.env.VITE_OPTIMISM_API_URI,
    rpcUrl: import.meta.env.VITE_OPTIMISM_RPC_URL ?? "",
    blockExplorer: "https://optimistic.etherscan.io",
    logoPath: IconOptimism,
    wrappedTokenInfo: new TokenInfo({
      address: import.meta.env.VITE_OPTIMISM_WRAPPED_TOKEN_ADDRESS,
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      abi: WETHABI,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    }),
  },
  {
    disabled: true,
    displayName: "Binance Chain",
    altDisplayName: "BSC",
    queryName: "binance-chain",
    chainId: bsc.id,
    chain: bsc,
    symbol: "BNB",
    apiUrl: import.meta.env.VITE_BINANCE_API_URI,
    rpcUrl: import.meta.env.VITE_BINANCE_RPC_URL ?? "",
    blockExplorer: "https://bscscan.com",
    logoPath: IconBSC,
    wrappedTokenInfo: new TokenInfo({
      address: import.meta.env.VITE_BINANCE_WRAPPED_TOKEN_ADDRESS,
      name: "WBNB",
      symbol: "WBNB",
      decimals: 18,
      abi: WETHABI,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png",
    }),
  },
  {
    disabled: true,
    displayName: "Arbitrum",
    queryName: "arbitrum",
    chainId: arbitrum.id,
    chain: arbitrum,
    symbol: "ETH",
    apiUrl: import.meta.env.VITE_ARBITRUM_API_URI,
    rpcUrl: import.meta.env.VITE_ARBITRUM_RPC_URL ?? "",
    blockExplorer: "https://arbiscan.io",
    logoPath: IconArbitrum,
    wrappedTokenInfo: new TokenInfo({
      address: import.meta.env.VITE_ARBITRUM_WRAPPED_TOKEN_ADDRESS,
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      abi: WETHABI,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/optimism/assets/0x4200000000000000000000000000000000000006/logo.png",
    }),
  },
  {
    displayName: "Sepolia",
    queryName: "sepolia",
    testnet: true,
    chainId: sepolia.id,
    chain: sepolia,
    symbol: "ETH",
    apiUrl: import.meta.env.VITE_SEPOLIA_API_URI,
    rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL ?? "",
    blockExplorer: "https://sepolia.etherscan.io",
    logoPath: IconEthereum,
    wrappedTokenInfo: new TokenInfo({
      address: import.meta.env.VITE_SEPOLIA_WRAPPED_TOKEN_ADDRESS,
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      abi: WETHABI,
      logoURI:
        "https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    }),
    contracts: {
      core: {
        address: import.meta.env.VITE_SEPOLIA_CORE_ADDRESS,
        abi: CoreABI,
      },
      token: {
        address: import.meta.env.VITE_SEPOLIA_TOKEN_ADDRESS,
        abi: NativeTokenABI,
      },
      badgeManager: {
        address: import.meta.env.VITE_SEPOLIA_BADGE_MGR_ADDRESS,
        abi: BadgeManagerABI,
      },
      marketCore: {
        address: import.meta.env.VITE_SEPOLIA_MARKET_CORE_ADDRESS,
        abi: MarketCoreABI,
      },
      disputeManager: {
        address: import.meta.env.VITE_SEPOLIA_DISPUTE_MGR_ADDRESS,
        abi: DisputeManagerABI,
      },
      mediatorManager: {
        address: import.meta.env.VITE_SEPOLIA_MEDIATOR_MGR_ADDRESS,
        abi: MediatorManagerABI,
      },
      energon: {
        address: import.meta.env.VITE_SEPOLIA_ENERGON_ADDRESS,
        abi: EnergonABI,
      },
      nft: {
        address: import.meta.env.VITE_SEPOLIA_NFT_ADDRESS,
        abi: NftABI,
      },
    },
  },
  {
    displayName: "Hardhat",
    queryName: "localhost",
    testnet: true,
    chainId: hardhat.id,
    chain: hardhat,
    symbol: "ETH",
    apiUrl: import.meta.env.VITE_LOCALHOST_API_URI,
    rpcUrl: import.meta.env.VITE_LOCALHOST_RPC_URL ?? "",
    blockExplorer: "https://etherscan.io",
    logoPath: IconEthereum,
    wrappedTokenInfo: new TokenInfo({
      address: import.meta.env.VITE_LOCALHOST_WRAPPED_TOKEN_ADDRESS,
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      abi: WETHABI,
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
 * Get IDs of all supported networks
 * @param testnetOnly Indicate whether to only return testnet chains
 * @param ignoreTestnet Indicate whether to ignore testnet chains
 * @param ignore - Optionally specify an ID to omit in the result
 */
export function getChainsID(
  testnetOnly = false,
  ignoreTestnet = false,
  ignore: number[] = [],
) {
  let supported = SupportedNetworks;

  if (testnetOnly) {
    supported = supported.filter((s) => s.testnet);
  }

  return supported
    .filter(
      (s) =>
        !s.disabled &&
        !ignore.includes(s.chainId) &&
        (!ignoreTestnet || !s.testnet),
    )
    .map((s) => s.chainId);
}

/**
 * Get chain object of all supported network
 * @param testnetOnly Indicate whether to only return testnet chains
 * @param ignoreTestnet Indicate whether to ignore testnet chains
 * @param ignore - Optionally specify an ID to omit in the result
 */
export function getChains(
  testnetOnly = false,
  ignoreTestnet = false,
  ignore: number[] = [],
) {
  let supported = SupportedNetworks;

  if (testnetOnly) {
    supported = supported.filter((s) => s.testnet);
  }

  return supported
    .filter(
      (s) =>
        !s.disabled &&
        !ignore.includes(s.chainId) &&
        (!ignoreTestnet || !s.testnet),
    )
    .map((s) => s.chain);
}

/**
 * Get a chain by its chain ID
 * @param id - The chain ID
 */
export function getChain(id: number | string) {
  if (!id) return;
  if (typeof id === "string") return getChainByName(id);
  return SupportedNetworks.find((s) => s.chainId === id);
}

/**
 * Get a chain by its query name
 * @param name - The query name
 */
function getChainByName(name: string) {
  return SupportedNetworks.find((s) => s.queryName === name);
}
