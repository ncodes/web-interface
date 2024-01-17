import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import '../polyfills.ts';
import App from './App.tsx';
import ConnectorProvider from './hooks/connectors/components/ConnectorProvider.tsx';
import './hooks/store/useStore.ts';
import './i18n/i18n.ts';
import ConnectPage from './pages/Connect.tsx';
import Disputes from './pages/Disputes.tsx';
import Liquidities from './pages/Liquidities.tsx';
import Liquidity from './pages/Liquidity.tsx';
import Market from './pages/Market.tsx';
import Markets from './pages/Markets.tsx';
import Mediation from './pages/Mediation.tsx';
import Offer from './pages/Offer.tsx';
import Offers from './pages/Offers.tsx';
import Points from './pages/Points.tsx';
import Swap from './pages/Swap.tsx';
import Swaps from './pages/Swaps.tsx';
import { RootErrorBoundary } from './pages/errors/root.tsx';
import ConnectExample from './pages/play/ConnectExample.tsx';
import './styles/app.css';
import './styles/fonts.css';

function makePath(path: string) {
	return `:locale?/${path}`;
}

const router = createBrowserRouter([
	{
		path: makePath(`play/connect-wallet`),
		element: <App page={<ConnectExample />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath(''),
		// element: <App page={<Timeline />} />,
		element: <App page={<Markets defaultTab='markets' />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/markets'),
		element: <App page={<Markets defaultTab='markets' />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/markets/watching'),
		element: <App page={<Markets defaultTab='watched-markets' />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/my/markets'),
		element: <App page={<Markets defaultTab='my-markets' />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/market/:id'),
		element: <App page={<Market />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/my/liquidity'),
		element: <App page={<Liquidities defaultTab='my-liquidities' />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/liquidity/watched'),
		element: <App page={<Liquidities defaultTab='watched-liquidities' />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/liquidity/:market/:provider/:lid'),
		element: <App page={<Liquidity />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/liquidity/:market/:provider/:lid/offers'),
		element: <App page={<Liquidity defaultTab='offers' />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/my/swaps'),
		element: <App page={<Swaps />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/swap/:orderId'),
		element: <App page={<Swap />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/my/disputes'),
		element: <App page={<Disputes />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/my/tickets'),
		element: <App page={<Mediation defaultTab='my-tickets' />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/tickets/stats'),
		element: <App page={<Mediation defaultTab='ticket-stats' />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/my/offers'),
		element: <App page={<Offers />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/offer/:id'),
		element: <App page={<Offer />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/points'),
		element: <App page={<Points defaultTab='leaderboard' />} />,
		errorElement: <RootErrorBoundary />,
	},
	{
		path: makePath('/connect'),
		element: <App page={<ConnectPage />} />,
		errorElement: <RootErrorBoundary />,
	},
	// {
	// 	path: makePath('/referrals'),
	// 	element: <App page={<Points defaultTab='referrals' />} />,
	// 	errorElement: <RootErrorBoundary />,
	// },
	// {
	// 	path: makePath('/energon'),
	// 	element: <App page={<Points defaultTab='energon' />} />,
	// 	errorElement: <RootErrorBoundary />,
	// },
	// {
	// 	path: makePath('/r/:code'),
	// 	element: <App page={<RefPage />} />,
	// 	errorElement: <RootErrorBoundary />,
	// },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<QueryClientProvider client={queryClient}>
		<ConnectorProvider appName={import.meta.env.NEXT_PUBLIC_APP_NAME} infuraId={import.meta.env.NEXT_PUBLIC_INFURA_ID}>
			<RouterProvider router={router} />
		</ConnectorProvider>
	</QueryClientProvider>,
);
