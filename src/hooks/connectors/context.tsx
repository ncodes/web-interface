import { hardhat } from '@wagmi/chains';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { createContext, useContext } from 'react';
import {Chain, createClient, goerli, mainnet, WagmiConfig} from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import useConnector, { IConnector } from './useConnector';

export const ConnectorContext = createContext<IConnector| null>(null);

export function useConnectorContext() {
  return useContext<IConnector | null>(ConnectorContext);
}

interface ConnectorProviderProps {
  appName: string;
  infuraId: string;
  children: any;
}

function ConnectorContextWrapper({ children }) {
  const connector = useConnector();
  return (
    <>
      <ConnectorContext.Provider value={connector}>
        {children}
      </ConnectorContext.Provider>
    </>
  );
}

export default function ConnectorProvider({
  children,
  appName,
  infuraId,
}: ConnectorProviderProps) {
  const chains: Chain[] = [mainnet];
  if (process.env.VITE_ENV !== 'production') {
    chains.push(...[hardhat, goerli]);
  }

  const defaultClient = getDefaultClient({
    appName,
    infuraId,
    chains,
  });

  const connectors = defaultClient.connectors;
  defaultClient.connectors = [];

  connectors.forEach((connection) => {
    if (connection.id === 'walletConnect') {
      defaultClient.connectors.push(
        new WalletConnectConnector({
          chains: connection.chains,
          options: {
            projectId: process.env.VITE_WALLECT_CONNECT_PROJECT_ID,
            metadata: {
              name: appName,
              description: 'Joint',
              url: process.env.VITE_APP_URL,
              icons: [
                'https://storage.googleapis.com/joint-images/thumb_joint.jpg',
              ],
            },
          },
        })
      );
    } else {
      defaultClient.connectors.push(connection);
    }
  });

  const client = createClient(defaultClient);

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <ConnectorContextWrapper>{children}</ConnectorContextWrapper>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
