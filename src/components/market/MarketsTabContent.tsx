import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { ErrorIcon } from 'react-hot-toast';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import { useMarketService } from '../../hooks/services/backend/useMarketService.ts';
import useStore from '../../hooks/store/useStore.ts';
import useMounted from '../../hooks/useMounted.ts';
import { RequestError } from '../../libs/RequestError.ts';
import { getPaginationInfo } from '../../libs/api_utils.ts';
import { isEqlStr } from '../../libs/helpers.ts';
import { Paginator } from '../Paginator.tsx';
import { RowSkeleton } from '../RowSkeleton.tsx';
import { TabsContent } from '../ui/Tabs.tsx';
import { MarketRow } from './MarketRow.tsx';

export function MarketsTabContent() {
	const { getChainInfo, address } = useConnectorContext();
	const { listMarkets } = useMarketService();
	const currentRegion = useStore((state) => state.currentRegion);
	const enabledSafeMode = useStore((state) => state.enabledSafeMode);
	const setLoaderProgress = useStore((state) => state.setLoaderProgress);
	const loaderProgress = useStore((state) => state.loaderProgress);
	const marketFilter = useStore((state) => state.marketFilter);
	const [offset, setOffset] = useState(0);
	const mounted = useMounted(1000);
	const [limit] = useState(60);
	const regionBadge = import.meta.env.VITE_REGION_BADGE;
	const markets = useQuery({
		queryKey: [
			'getMarkets',
			{
				network: getChainInfo().queryName,
				marketFilter: {
					...marketFilter,
					creator: import.meta.env.VITE_OPERATOR_MARKET_CREATOR,
					regions: currentRegion ? `${regionBadge}/${currentRegion}` : undefined,
					kycLp: enabledSafeMode ? true : marketFilter.kycLp,
					kycTaker: enabledSafeMode ? true : marketFilter.kycTaker,
				},
				limit,
				offset,
			},
		],
		queryFn: listMarkets,
		keepPreviousData: true,
		enabled: mounted,
		refetchInterval: 10000,
	});

	useEffect(() => {
		setOffset(0);
	}, [marketFilter]);

	// Update global progress bar on market fetch
	useEffect(() => {
		const { isLoading, isRefetching } = markets;
		if (isLoading) setLoaderProgress && setLoaderProgress(50);
		if (!(isRefetching || isLoading) && loaderProgress == 50) setLoaderProgress?.(100);
	}, [markets.isLoading, markets.isRefetching, loaderProgress]);

	// Set loader to 50% when market filter changes.
	useEffect(() => {
		setLoaderProgress?.(50);
	}, [marketFilter]);

	return (
		<TabsContent value='markets' className='p-0 m-0 flex flex-1 flex-col gap-3'>
			<Helmet>
				<title>{`Markets - Joint`}</title>
			</Helmet>

			{markets.isLoading && <RowSkeleton className='h-[300px] xl:h-[610px]' />}

			{markets.isError && (
				<div className='flex items-center gap-2 text-red-300 justify-center font-light h-[300px] xl:h-[610px]'>
					<ErrorIcon className='w-[20px]' /> {(markets.error as RequestError)?.message}
				</div>
			)}

			{!markets.isLoading && markets.isSuccess && markets.data?.markets?.length > 0 && (
				<div className='flex flex-col flex-1 gap-3 min-h-[300px] xl:min-h-[610px]'>
					<div className='flex flex-col flex-1 gap-3'>
						<Paginator
							curPage={getPaginationInfo(markets.data, limit, offset).currentPage}
							total={getPaginationInfo(markets.data, limit, offset).totalResults}
							limit={limit}
							onNext={() => setOffset(offset + limit)}
							onPrev={() => setOffset(offset - limit)}
						/>
						<div className='flex flex-col gap-3 p-3 pt-0 pb-0'>
							{markets.data?.markets.map((market: Market) => (
								<MarketRow market={market} key={market.address} ownerMode={isEqlStr(market.creator, address)} />
							))}
						</div>
					</div>
					<div className='flex-1 flex flex-col justify-end'>
						<Paginator
							className='border-t rounded-b-3xl'
							curPage={getPaginationInfo(markets.data, limit, offset).currentPage}
							total={getPaginationInfo(markets.data, limit, offset).totalResults}
							limit={limit}
							onNext={() => setOffset(offset + limit)}
							onPrev={() => setOffset(offset - limit)}
						/>
					</div>
				</div>
			)}

			{!markets.isLoading && markets.data?.markets?.length == 0 && (
				<div className='flex items-center justify-center font-light text-gray-400 h-[300px] xl:h-[610px]'>
					No market found
				</div>
			)}
		</TabsContent>
	);
}
