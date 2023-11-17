import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectorContext } from "../context.tsx";
import { chains } from "../networks.ts";
import useConnector from "../useConnector.tsx";

interface ConnectorProviderProps {
  appName: string;
  infuraId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const config = createConfig(
    getDefaultConfig({
      walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
      appName,
      infuraId,
      chains: chains,
      appDescription: "Joint is a decentralized P2P exchange protocol",
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
