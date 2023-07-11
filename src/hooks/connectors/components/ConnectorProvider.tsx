import { WagmiConfig, createConfig, Chain } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import useConnector from "../useConnector.tsx";
import { ConnectorContext } from "../context.tsx";
import { goerli, hardhat, mainnet } from "viem/chains";

interface ConnectorProviderProps {
  appName: string;
  infuraId: string;
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

export default function ConnectorProvider({
  children,
  appName,
  infuraId,
}: ConnectorProviderProps) {
  const chains: Chain[] = [];

  switch (import.meta.env.VITE_NETWORK) {
    case "localhost":
      chains.push(hardhat, goerli);
      break;
    case "development":
      chains.push(hardhat);
      break;
    case "production":
      chains.push(mainnet);
  }

  const config = createConfig(
    getDefaultConfig({
      walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
      appName,
      infuraId,
      chains,
      appDescription: "Joint is a decentralized P2P exchange for tokens",
      appUrl: import.meta.env.VITE_APP_URL,
      appIcon: import.meta.env.VITE_APP_ICON,
    })
  );

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <ConnectorContextWrapper>{children}</ConnectorContextWrapper>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
