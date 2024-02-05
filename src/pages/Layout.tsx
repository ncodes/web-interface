import * as Sentry from '@sentry/browser';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { useInterval, useMediaQuery } from 'usehooks-ts';
import { AccountLinker } from '../components/AccountLinker.tsx';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { LeftSidebar } from '../components/LeftSidebar.tsx';
import { NotificationSheet } from '../components/NotificationSheet.tsx';
import { ReviewViewerSheet } from '../components/ReviewViewerSheet.tsx';
import { SearchSheetBox } from '../components/search/SearchSheetBox.tsx';
import { useConnectorContext } from '../hooks/connectors/useConnectorContext.tsx';
import { useMiscService } from '../hooks/services/backend/useMiscService.ts';
import { useNotificationService } from '../hooks/services/backend/useNotificationService.ts';
import { useUserService } from '../hooks/services/backend/useUserService.ts';
import useNFTContract from '../hooks/services/contracts/useNFTContract.ts';
import useStore from '../hooks/store/useStore.ts';
import useMounted from '../hooks/useMounted.ts';
import { useSession } from '../hooks/useSession.ts';
import useWindowFocus from '../hooks/useWindowFocus.ts';
import { logError } from '../libs/helpers.ts';
import { cn } from '../libs/utils.ts';

ReactGA.initialize('G-4HPN7GNCG6');

export default function Layout({
	body,
	rightSide,
	bodyContainerClassName,
	title,
	description,
}: {
	body?: React.ReactNode;
	rightSide?: React.ReactNode;
	bodyContainerClassName?: string;
	title: string;
	description?: string;
}) {
	const { getAccessToken, delAccessToken, hasAccessToken } = useSession();
	const headerHeight = 55;
	const location = useLocation();
	const [leftSideMenuOpen, setLeftSideMenuOpen] = useState(false);
	const isXl = useMediaQuery('(min-width: 1280px)');
	const { address, ready, getChainInfo } = useConnectorContext();
	const user = useStore((state) => state.user);
	const setContractsParams = useStore((state) => state.setContractsParams);
	const setUserHasNativeNFT = useStore((state) => state.setUserHasNativeNFT);
	const windowFocus = useWindowFocus();
	const setUser = useStore((state) => state.setUser);
	const setProtoFee = useStore((state) => state.setProtoFee);
	const { getUser, logOnlineStatus, registerDevice } = useUserService();
	const accessToken = getAccessToken(address);
	const { subscribeForWebPush } = useNotificationService();
	const { getContractParams } = useMiscService();
	const { getProtocolFees } = useMiscService();
	const ref = useRef(null);
	const { scrollY } = useScroll();
	const [scrollYPos, setScrollYPos] = useState(0);
	const { balanceOf: nativeNftBalance } = useNFTContract();
	const setLoaderProgress = useStore((state) => state.setLoaderProgress);
	const mounted = useMounted(1000);

	// Set loader progress to 100% on mount.
	useEffect(() => {
		setLoaderProgress(100);
	}, []);

	// Sentry: Set address as sentry username
	useEffect(() => {
		if (!address) return;
		Sentry.setUser({ username: address });
	}, [address]);

	const authedUserQuery = useQuery({
		queryKey: ['getUser', { address }],
		queryFn: getUser,
		enabled: !!accessToken && !!address,
		refetchInterval: 180 * 1000,
	});

	const protoFeeQuery = useQuery({
		queryKey: ['getProtocolFees', { network: getChainInfo().queryName }],
		queryFn: getProtocolFees,
		enabled: false,
		refetchInterval: 300 * 1000,
	});

	const contractParamsQuery = useQuery({
		queryKey: ['getContractParams', { network: getChainInfo().queryName }],
		queryFn: getContractParams,
		enabled: mounted && !!address,
		refetchIntervalInBackground: false,
		refetchInterval: false,
	});

	const subscribeMutation = useMutation({
		mutationFn: subscribeForWebPush,
	});

	const logOnlineStatusMutation = useMutation({
		mutationFn: logOnlineStatus,
	});

	const registerDeviceMutation = useMutation({
		mutationFn: registerDevice,
	});

	// Set authed user.
	useEffect(() => {
		if (authedUserQuery.isLoading || authedUserQuery.isRefetching) return;
		if (authedUserQuery.isSuccess && authedUserQuery.data) {
			setUser(authedUserQuery.data);
		} else {
			setUser(undefined);
			delAccessToken(address);
		}
	}, [authedUserQuery, setUser]);

	// Set contract params
	useEffect(() => {
		if (contractParamsQuery.isLoading || contractParamsQuery.isRefetching) return;
		if (contractParamsQuery.isSuccess && contractParamsQuery.data) {
			setContractsParams(contractParamsQuery.data);
		}
	}, [contractParamsQuery]);

	// Set protocol fee
	useEffect(() => {
		if (!protoFeeQuery.data) return;
		setProtoFee(protoFeeQuery.data);
	}, [protoFeeQuery.isSuccess, protoFeeQuery.data]);

	// Set mobile menu open state based on screen size.
	useEffect(() => {
		setLeftSideMenuOpen(isXl);
	}, [isXl]);

	// Check native NFT Ownership on wallet change.
	useEffect(() => {
		if (!ready) return;
		checkNativeNFTOwnership();
	}, [ready, address]);

	// Check native NFT Ownership every 5 minutes.
	useInterval(() => {
		checkNativeNFTOwnership();
	}, 300 * 1000);

	useMotionValueEvent(scrollY, 'change', (val) => {
		setScrollYPos(val);
	});

	// Log online status every 10 seconds.
	useInterval(() => {
		if (!windowFocus || !address || !hasAccessToken(address)) return;

		const orderMatch = location.pathname.match(/\/swap\/([0-9]+)/);
		const orderId = orderMatch ? parseInt(orderMatch[1]) : undefined;
		const offerMatch = location.pathname.match(/\/offer\/([0-9]+)/);
		const offerId = offerMatch ? parseInt(offerMatch[1]) : undefined;

		logOnlineStatusMutation.mutate({
			net: getChainInfo().queryName,
			orderId,
			offerId,
		});
	}, determineOnlineStatusReportDelay());

	// Register user devices
	useEffect(() => {
		if (!address || !hasAccessToken(address)) return;
		registerDeviceMutation.mutate();
	}, [user]);

	// Subscribe for web push notifications.
	useEffect(() => {
		if (!address) return;
		if ('serviceWorker' in navigator) registerServiceWorker().catch(logError);
	}, [address]);

	// Register service worker.
	async function registerServiceWorker() {
		try {
			const { serviceWorker: sw } = navigator;
			const register = await sw.register('/worker.js', { scope: '/' });
			const subscription = await register.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
			});

			subscribeMutation.mutate({
				subscription,
				address,
				net: getChainInfo().queryName,
			});
		} catch (error) {
			logError('Failed to subscribe user for notification: ', error);
		}
	}

	// Determine duration to wait before reporting online status.
	function determineOnlineStatusReportDelay() {
		if (location.pathname.match(/\/swap\/([0-9]+)/)) return 5000;
		if (location.pathname.match(/\/offer\/([0-9]+)/)) return 5000;
		return 10000;
	}

	// Check native NFT ownership.
	async function checkNativeNFTOwnership() {
		try {
			const count = await nativeNftBalance(address);
			setUserHasNativeNFT(count > 0);
		} catch (error) {
			logError('Failed to check native NFT ownership: ', error);
		}
	}

	return (
		<div>
			<Helmet>
				<title>{title}</title>
				<meta
					name='description'
					content={
						description ||
						'Joint is an innovative, simple to use DeFi protocol for peer-to-peer trading. ' +
							'Carry out swaps for crypto to crypto, crypto to fiat, NFT to fiat, and vice versa.'
					}
				/>
				<meta name='theme-color' content='#030507' />
				<body className='bg-background' />
			</Helmet>
			<div ref={ref} className='container-x flex h-screen text-white text '>
				<LeftSidebar
					open={leftSideMenuOpen}
					headerHeight={headerHeight}
					scrollYPos={scrollYPos}
					closeRequested={() => {
						setLeftSideMenuOpen(false);
					}}
				/>
				<div className='flex flex-col flex-1 z-10'>
					<div className='flex flex-col flex-1 pt-3'>
						<div>
							<Header
								onClick={() => {
									setLeftSideMenuOpen(!leftSideMenuOpen);
								}}
								height={`h-[${headerHeight}px]`}
							/>
						</div>
						<div className='flex flex-1'>
							<div className='flex-1 relative flex flex-col mt-3'>
								<AccountLinker />
								<div className='relative flex-1 flex flex-col'>
									<div className='absolute w-full h-full'>
										<div
											className={cn('z-0 border border-gray-800 rounded-3xl bg-vampire-black ', bodyContainerClassName)}
										>
											{body}
										</div>
										<div className='xl:hidden'>
											<Footer />
										</div>
									</div>
								</div>
							</div>
							{rightSide && (
								<div className='w-[400px] relative hidden xl:flex flex-col'>
									<div className={`fixed h-full flex flex-col flex-1`} style={{ paddingBottom: `${headerHeight}px` }}>
										<motion.div
											animate={{
												marginTop: scrollYPos > 50 ? -55 : 0,
											}}
											transition={{ ease: 'linear', duration: 0.1 }}
											className={cn(`flex-1 w-[400px] px-5 pr-0 overflow-auto hidden xl:flex`)}
										>
											{rightSide}
										</motion.div>
									</div>
								</div>
							)}
						</div>
					</div>
					{/* <div className="flex justify-center">
            <Footer />
          </div> */}
				</div>
				<SearchSheetBox />
				<NotificationSheet />
				<ReviewViewerSheet />
			</div>
		</div>
	);
}
