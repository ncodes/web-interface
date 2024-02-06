import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { Chain, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { WagmiConfig, createConfig } from 'wagmi';
import { getSupportedChains } from '../common.ts';
import { ConnectorContext } from '../context.tsx';
import useConnector from '../useConnector.tsx';

interface ConnectorProviderProps {
	appName: string;
	infuraId: string;
	children: any;
}

function ConnectorContextWrapper({ children }) {
	const connector = useConnector();
	return <ConnectorContext.Provider value={connector}>{children}</ConnectorContext.Provider>;
}

export default function ConnectorProvider({ children, appName, infuraId }: ConnectorProviderProps) {
	const config = createConfig(
		getDefaultConfig({
			walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
			appName,
			chains: getSupportedChains() as unknown as readonly [Chain, ...Chain[]],
			appDescription: 'Joint is a decentralized P2P exchange protocol',
			appUrl: import.meta.env.VITE_APP_URL,
			appIcon: import.meta.env.VITE_APP_ICON,
			transports: {
				[sepolia.id]: http(`https://sepolia.infura.io/v3/${infuraId}`),
				[mainnet.id]: http(`https://mainnet.infura.io/v3/${infuraId}`),
			},
		}),
	);

	const lastChainId = localStorage.getItem('lastChainId');

	return (
		<WagmiConfig config={config}>
			<ConnectKitProvider
				options={{
					initialChainId: lastChainId ? parseInt(lastChainId) : undefined,
				}}
			>
				<ConnectorContextWrapper>{children}</ConnectorContextWrapper>
			</ConnectKitProvider>
		</WagmiConfig>
	);
}
