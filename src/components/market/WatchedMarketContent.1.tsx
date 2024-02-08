import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Client, PrivateKey, Signature } from '@xmtp/xmtp-js';
import { useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import { ErrorIcon } from 'react-hot-toast';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import FollowCodec, { ContentTypeFollow, FollowPayload } from '../../hooks/messenger/codecs/FollowCodec.ts';
import useMessenger from '../../hooks/messenger/useMessenger.ts';
import { useMarketService } from '../../hooks/services/backend/useMarketService.ts';
import useStore from '../../hooks/store/useStore.ts';
import useForceUpdate from '../../hooks/useForceUpdate.ts';
import useMounted from '../../hooks/useMounted.ts';
import { RequestError } from '../../libs/RequestError.ts';
import { getPaginationInfo } from '../../libs/api_utils.ts';
import { isEqlStr, logError } from '../../libs/helpers.ts';
import { MainContainerConnectButton } from '../MainContainerConnectButton.tsx';
import { Paginator } from '../Paginator.tsx';
import { RowSkeleton } from '../RowSkeleton.tsx';
import IconSpinner from '../icons/IconSpinner.tsx';
import { Button } from '../ui/Button.tsx';
import { TabsContent } from '../ui/Tabs.tsx';
import { Label } from '../ui/label.tsx';
import { MarketRow } from './MarketRow.tsx';

export function WatchedMarketContent() {
	const { wallet, address, chain, getChainInfo } = useConnectorContext();
	const { loadKeys, initClient, readMailbox, getEnv } = useMessenger();
	const [loading, setLoading] = useState(true);
	const setLoaderProgress = useStore((state) => state.setLoaderProgress);
	const loaderProgress = useStore((state) => state.loaderProgress);
	const [initializing, setInitializing] = useState(false);
	const client = useRef<Client | undefined>();
	const forceUpdate = useForceUpdate();
	const [watchedMarkets, setWatchedMarkets] = useState<string[]>([]);
	const { listMarkets } = useMarketService();
	const marketFilter = useStore((state) => state.marketFilter);
	const [offset, setOffset] = useState(0);
	const [limit] = useState(10);
	const mounted = useMounted(1000);

	const markets = useQuery({
		queryKey: [
			'getMarketsByAddresses',
			{
				network: getChainInfo().queryName,
				marketFilter: { ...marketFilter, address: watchedMarkets.join(',') },
				limit,
				offset,
			},
		],
		queryFn: listMarkets,
		placeholderData: watchedMarkets.length ? keepPreviousData : undefined,
		refetchInterval: 10000,
		enabled: mounted && !!watchedMarkets.length,
	});

	// Auto-initialize client if keys are present.
	useEffect(() => {
		if (!wallet) return;
		const hasKey = !!loadKeys(getEnv(), address);
		if (!hasKey) {
			setLoading(false);
			return;
		}

		initClient(getEnv(), wallet).then((cl) => {
			client.current = cl;
			forceUpdate.forceUpdate();
		});
	}, [wallet, open]);

	// Get list of markets the user is following.
	useEffect(() => {
		const findFollowedMarkets = async () => {
			if (!client.current) return;

			setLoading(true);
			const { keystore } = client.current;
			const key = (await keystore.getPrivateKeyBundle()).identityKey as PrivateKey;
			const markets: { [k: string]: boolean } = {};

			await readMailbox(chain, address, {
				type: ContentTypeFollow,
				reverse: false,
				cb: async (msg) => {
					const content = msg.content as FollowPayload;

					if (content.type == 'market') {
						const sigBytes = Buffer.from(content.signature, 'hex');
						const sig = Signature.fromBytes(sigBytes);
						delete msg.content.signature;
						const digest = new FollowCodec().encode(msg.content);
						const valid = key.publicKey.verify(sig, digest.content);
						if (!valid) return false;

						markets[content.market] = true;
						if (content.unfollow) delete markets[content.market];
					}

					return false;
				},
			});

			setWatchedMarkets(Object.keys(markets));
			setLoading(false);
		};
		findFollowedMarkets?.();
	}, [forceUpdate.forceValue]);

	// Update global progress bar on market fetch
	useEffect(() => {
		if (watchedMarkets.length == 0) return;
		const { isLoading, isRefetching } = markets;
		if (isLoading) setLoaderProgress && setLoaderProgress(50);
		if (!(isRefetching || isLoading) && loaderProgress == 50) setLoaderProgress?.(100);
	}, [markets, loaderProgress, watchedMarkets]);

	// Set loader to 50% when market filter changes.
	useEffect(() => {
		if (watchedMarkets.length == 0) return;
		setLoaderProgress?.(50);
	}, [marketFilter, watchedMarkets]);

	// Initialize the client for messaging.
	async function initialize() {
		try {
			setInitializing(true);
			client.current = await initClient(getEnv(), wallet);
			forceUpdate.forceUpdate();
		} catch (error) {
			logError('Failed to initialize wallet', error);
		} finally {
			setInitializing(false);
		}
	}

	return (
		<TabsContent value='watched-markets' className='p-0 m-0 flex flex-1 flex-col gap-3'>
			<Helmet>
				<title>{`Watched Markets - Joint`}</title>
			</Helmet>

			{((markets.isLoading && !markets.isRefetching && markets.fetchStatus != 'idle') || loading) && client.current && (
				<div className='h-[300px] xl:h-[610px]'>
					<RowSkeleton />
				</div>
			)}

			{markets.isError && (
				<div className='flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]'>
					<ErrorIcon className='w-[20px]' /> {(markets.error as RequestError)?.message}
				</div>
			)}

			{!address && <MainContainerConnectButton />}

			{!markets.isLoading && !loading && markets.isSuccess && markets.data?.markets?.length > 0 && (
				<div className='flex flex-col flex-1 gap-3 min-h-[500px]'>
					<div className='flex flex-col flex-1 gap-3'>
						<Paginator
							curPage={getPaginationInfo(markets.data, limit, offset).currentPage}
							total={getPaginationInfo(markets.data, limit, offset).totalResults}
							limit={limit}
							onNext={() => setOffset(offset + limit)}
							onPrev={() => setOffset(offset - limit)}
						/>
						<div className='flex flex-col gap-3 p-3 pt-0'>
							{markets.data?.markets.map((market: Market) => (
								<MarketRow
									market={market}
									key={market.address}
									ownerMode={isEqlStr(market.creator, address)}
									onFollowUpdate={() => {
										forceUpdate.forceUpdate();
									}}
								/>
							))}
						</div>
					</div>
					<div className='flex-1 flex flex-col justify-end'>
						<Paginator
							className='border-t mb-0 rounded-b-3xl'
							curPage={getPaginationInfo(markets.data, limit, offset).currentPage}
							total={getPaginationInfo(markets.data, limit, offset).totalResults}
							limit={limit}
							onNext={() => setOffset(offset + limit)}
							onPrev={() => setOffset(offset - limit)}
						/>
					</div>
				</div>
			)}

			{client.current && (watchedMarkets.length == 0 || markets.data?.markets.length == 0) && !loading && (
				<div className='flex items-center justify-center font-light text-gray-400 h-[300px] xl:h-[610px]'>
					No market found
				</div>
			)}

			{!client.current && (
				<div className='p-3 pt-0'>
					<div className='w-6/12 m-auto text-center h-[300px] xl:h-[610px] flex flex-col justify-center items-center'>
						<Label className='text-white tracking-wider px-3 pt-2 text-sm'>Initialize Chat</Label>
						<div className='text-gray-300 text-[13px] px-3 py-3 font-light tracking-wide'>
							Market watching relies on the chat system. You need to initialize your wallet for chat before you can see
							the markets you are currently watching.
						</div>
						<Button
							variant='outline'
							className='w-[200px] tracking-wider text-gray-200'
							disabled={initializing}
							onClick={() => {
								initialize();
							}}
						>
							{!initializing && <>Initialize</>}
							{initializing && (
								<>
									<IconSpinner width='20' className='animate-spin' fill='fill-gray-100' />
								</>
							)}
						</Button>
					</div>
				</div>
			)}
		</TabsContent>
	);
}
