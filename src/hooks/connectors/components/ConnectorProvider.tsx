import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Chain, http } from "viem";
import { arbitrum, base, hardhat } from "viem/chains";
import { WagmiProvider, createConfig } from "wagmi";
import {
  AppIcon,
  AppName,
  AppUrl,
  WalletConnectId,
} from "../../../constants.ts";
import { isLocal } from "../../../libs/helpers.ts";
import { getSupportedChains } from "../common.ts";
import { ConnectorContext } from "../context.tsx";
import useConnector from "../useConnector.tsx";

interface ConnectorProviderProps {
  children: any;
}

function ConnectorContextWrapper({ children }) {
  const connector = useConnector();
  return (
    <ConnectorContext.Provider value={connector}>
      {children}
    </ConnectorContext.Provider>
  );
}

console.log(import.meta.env.VITE_LOCALHOST_RPC_URL);

const transports = {};
if (isLocal()) {
  transports[hardhat.id] = http(hardhat.rpcUrls.default.http[0]);
} else {
  transports[arbitrum.id] = http(import.meta.env.VITE_ARBITRUM_RPC_URL);
  transports[base.id] = http(import.meta.env.VITE_BASE_RPC_URL);
}

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: WalletConnectId,
    appName: AppName,
    chains: getSupportedChains() as unknown as readonly [Chain, ...Chain[]],
    appDescription:
      "Joint is a peer-to-peer exchange protocol that lets you swap tokens with real people",
    appUrl: AppUrl,
    appIcon: AppIcon,
    transports,
  }),
);

const lastChainId = localStorage.getItem("lastChainId");

const queryClient = new QueryClient();

export default function ConnectorProvider({
  children,
}: ConnectorProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          options={{
            initialChainId: lastChainId ? parseInt(lastChainId) : undefined,
          }}
        >
          <ConnectorContextWrapper>{children}</ConnectorContextWrapper>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
