import { getChains } from "@jointlabs/chains-info";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Chain } from "viem";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectorContext } from "../context.tsx";
import useConnector from "../useConnector.tsx";

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
  const config = createConfig(
    getDefaultConfig({
      walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
      appName,
      infuraId,
      chains: getChains() as Chain[],
      appDescription: "Joint is a decentralized P2P exchange protocol",
      appUrl: import.meta.env.VITE_APP_URL,
      appIcon: import.meta.env.VITE_APP_ICON,
    }),
  );

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <ConnectorContextWrapper>{children}</ConnectorContextWrapper>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
