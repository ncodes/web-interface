import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { Chain, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { WagmiProvider, createConfig } from 'wagmi';
import { AppIcon, AppName, AppUrl, WalletConnectId, infuraId } from '../../../constants.ts';
import { getSupportedChains } from '../common.ts';
import { ConnectorContext } from '../context.tsx';
import useConnector from '../useConnector.tsx';

interface ConnectorProviderProps {
	children: any;
}

function ConnectorContextWrapper({ children }) {
	const connector = useConnector();
	return <ConnectorContext.Provider value={connector}>{children}</ConnectorContext.Provider>;
}

const config = createConfig(
	getDefaultConfig({
		walletConnectProjectId: WalletConnectId,
		appName: AppName,
		chains: getSupportedChains() as unknown as readonly [Chain, ...Chain[]],
		appDescription: 'A decentralized peer-to-peer crypto exchange protocol',
		appUrl: AppUrl,
		appIcon: AppIcon,
		transports: {
			[sepolia.id]: http(`https://sepolia.infura.io/v3/${infuraId}`),
			[mainnet.id]: http(`https://mainnet.infura.io/v3/${infuraId}`),
		},
	}),
);

const lastChainId = localStorage.getItem('lastChainId');

const queryClient = new QueryClient();

export default function ConnectorProvider({ children }: ConnectorProviderProps) {
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
