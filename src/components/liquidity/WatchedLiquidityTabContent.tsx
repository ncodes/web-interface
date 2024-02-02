import { useQuery } from '@tanstack/react-query';
import { Client, PrivateKey, Signature } from '@xmtp/xmtp-js';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ErrorIcon } from 'react-hot-toast';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import FollowCodec, { ContentTypeFollow, FollowPayload } from '../../hooks/messenger/codecs/FollowCodec.ts';
import useMessenger from '../../hooks/messenger/useMessenger.ts';
import { useLiquidityService } from '../../hooks/services/backend/useLiquidityService.ts';
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
import { LiquidityRow } from './LiquidityRow.tsx';

interface LiquidityInfo {
	marketAddress: string;
	provider: string;
	lid: number;
}

export function WatchedLiquidityTabContent() {
	const { wallet, address, chain, getChainInfo } = useConnectorContext();
	const client = useRef<Client | undefined>();
	const setLoaderProgress = useStore((state) => state.setLoaderProgress);
	const loaderProgress = useStore((state) => state.loaderProgress);
	const { listLiquidities } = useLiquidityService();
	const [initializing, setInitializing] = useState(false);
	const { loadKeys, initClient, readMailbox, getEnv } = useMessenger();
	const [loading, setLoading] = useState(true);
	const forceUpdate = useForceUpdate();
	const [offset, setOffset] = useState(0);
	const [limit] = useState(10);
	const liquidityFilter = useStore((state) => state.liquidityFilter);
	const mounted = useMounted(1000);
	const [watchedLiquidities, setWatchedLiquidities] = useState<LiquidityInfo[]>([]);

	const liquidities = useQuery({
		queryKey: [
			'getLiquiditiesByLiquidities',
			{
				network: getChainInfo().queryName,
				limit,
				offset,
				liquidityFilter: {
					...liquidityFilter,
					liquidities: watchedLiquidities,
				},
			},
		],
		queryFn: listLiquidities,
		keepPreviousData: !!watchedLiquidities.length,
		refetchInterval: 10000,
		enabled: mounted && !!watchedLiquidities.length,
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

	// Get list of liquidities the user is following.
	useEffect(() => {
		const findFollowedMarkets = async () => {
			if (!client.current) return;

			setLoading(true);
			const { keystore } = client.current;
			const key = (await keystore.getPrivateKeyBundle()).identityKey as PrivateKey;
			const liquidities: { [k: string]: boolean } = {};

			await readMailbox(chain, address, {
				type: ContentTypeFollow,
				reverse: false,
				cb: async (msg) => {
					const content = msg.content as FollowPayload;
					const { signature, market, provider, lid, unfollow } = content;

					if (content.type == 'liquidity' && content.market) {
						const sigBytes = Buffer.from(signature, 'hex');
						const sig = Signature.fromBytes(sigBytes);
						delete msg.content.signature;
						const digest = new FollowCodec().encode(msg.content);
						const valid = key.publicKey.verify(sig, digest.content);
						if (!valid) return false;

						liquidities[`${market}:${provider}:${lid}`] = true;
						if (unfollow) delete liquidities[`${market}:${provider}:${lid}`];
					}

					return false;
				},
			});

			setWatchedLiquidities(
				Object.keys(liquidities).map((v) => {
					const [marketAddress, provider, lid] = v.split(':');
					return { marketAddress, provider, lid: parseInt(lid) };
				}),
			);

			setLoading(false);
		};
		findFollowedMarkets?.();
	}, [forceUpdate.forceValue]);

	// Update global progress bar on liquidity fetch
	useEffect(() => {
		if (watchedLiquidities.length == 0) return;
		const { isLoading, isRefetching } = liquidities;
		if (isLoading) setLoaderProgress && setLoaderProgress(50);
		if (!(isRefetching || isLoading) && loaderProgress == 50) setLoaderProgress?.(100);
	}, [liquidities, loaderProgress, watchedLiquidities]);

	// Set loader to 50% when liquidity filter changes.
	useEffect(() => {
		if (watchedLiquidities.length == 0) return;
		setLoaderProgress?.(50);
	}, [liquidityFilter, watchedLiquidities]);

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
		<TabsContent value='watched-liquidities' className='p-0 m-0 flex flex-col flex-1 gap-3'>
			<Helmet>
				<title>{`Watched Liquidity - Joint`}</title>
			</Helmet>

			{((liquidities.isLoading && !liquidities.isRefetching && liquidities.fetchStatus != 'idle') || loading) &&
				client.current && (
					<div className='h-[300px] xl:h-[610px]'>
						<RowSkeleton />
					</div>
				)}

			{liquidities.isError && (
				<div className='flex items-center gap-2 text-red-300 justify-center font-light h-[300px] xl:h-[610px]'>
					<ErrorIcon className='w-[20px]' /> {(liquidities.error as RequestError)?.message}
				</div>
			)}

			{!address && <MainContainerConnectButton />}

			{!liquidities.isLoading && !loading && liquidities.isSuccess && liquidities.data?.liquidities?.length > 0 && (
				<div className='flex flex-col flex-1 gap-3 min-h-[610px]'>
					<div className='flex flex-col flex-1 gap-3'>
						<Paginator
							curPage={getPaginationInfo(liquidities.data, limit, offset).currentPage}
							total={getPaginationInfo(liquidities.data, limit, offset).totalResults}
							limit={limit}
							onNext={() => setOffset(offset + limit)}
							onPrev={() => setOffset(offset - limit)}
						/>
						<div className='flex flex-col gap-3 p-3 pt-0'>
							{liquidities.data?.liquidities.map((liq: Liquidity) => (
								<LiquidityRow
									key={`${liq.provider}:${liq.lid}`}
									liquidity={liq}
									ownerMode={isEqlStr(liq.provider, address)}
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
							curPage={getPaginationInfo(liquidities.data, limit, offset).currentPage}
							total={getPaginationInfo(liquidities.data, limit, offset).totalResults}
							limit={limit}
							onNext={() => setOffset(offset + limit)}
							onPrev={() => setOffset(offset - limit)}
						/>
					</div>
				</div>
			)}

			{client.current && (watchedLiquidities.length == 0 || liquidities.data?.liquidities.length == 0) && !loading && (
				<div className='flex items-center justify-center font-light text-gray-400 h-[300px] xl:h-[610px]'>
					No liquidity found
				</div>
			)}

			{address && (!liquidities.isLoading || liquidities.fetchStatus == 'idle') && !client.current && (
				<div className='p-3 pt-0'>
					<div className='w-6/12 m-auto text-center h-[300px] xl:h-[610px] flex flex-col justify-center items-center'>
						<Label className='text-white tracking-wider px-3 pt-2 text-sm'>Initialize Chat</Label>
						<div className='text-gray-300 text-[13px] px-3 py-3 font-light tracking-wide'>
							Liquidity watching relies on the chat system. You need to initialize your wallet for chat before you can
							see the liquidities you are currently watching.
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
