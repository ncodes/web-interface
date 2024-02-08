import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { ErrorIcon } from 'react-hot-toast';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import { useLiquidityService } from '../../hooks/services/backend/useLiquidityService.ts';
import useStore from '../../hooks/store/useStore.ts';
import useMounted from '../../hooks/useMounted.ts';
import { RequestError } from '../../libs/RequestError.ts';
import { getPaginationInfo } from '../../libs/api_utils.ts';
import { isEqlStr } from '../../libs/helpers.ts';
import { MainContainerConnectButton } from '../MainContainerConnectButton.tsx';
import { Paginator } from '../Paginator.tsx';
import { RowSkeleton } from '../RowSkeleton.tsx';
import { TabsContent } from '../ui/Tabs.tsx';
import { LiquidityRow } from './LiquidityRow.tsx';

export function MyLiquidityTabContent() {
	const { getChainInfo, address } = useConnectorContext();
	const { listLiquidities } = useLiquidityService();
	const liquidityFilter = useStore((state) => state.liquidityFilter);
	const setLoaderProgress = useStore((state) => state.setLoaderProgress);
	const [offset, setOffset] = useState(0);
	const [limit] = useState(10);
	const mounted = useMounted(1000);

	const { isLoading, isSuccess, isRefetching, isError, fetchStatus, isRefetchError, data, error } = useQuery({
		queryKey: [
			'getLiquidityByCreator',
			{
				network: getChainInfo().queryName,
				limit,
				offset,
				connectedAddress: address,
				liquidityFilter,
			},
		],
		queryFn: listLiquidities,
		placeholderData: keepPreviousData,
		enabled: mounted && !!address,
	});

	useEffect(() => {
		if ((fetchStatus != 'idle' && isLoading) || isRefetching) setLoaderProgress && setLoaderProgress(50);
		else setLoaderProgress && setLoaderProgress(100);
	}, [isError, isLoading, setLoaderProgress, isRefetching, isRefetchError, fetchStatus]);

	return (
		<TabsContent value='my-liquidities' className='p-0 m-0 flex flex-col flex-1 gap-3'>
			<Helmet>
				<title>{`My Liquidity - Joint`}</title>
			</Helmet>

			{address && isLoading && <RowSkeleton className='h-[300px] xl:h-[610px]' />}

			{isError && (
				<div className='flex items-center gap-2 text-red-300 justify-center font-light h-[300px] xl:h-[610px]'>
					<ErrorIcon className='w-[20px]' /> {(error as RequestError)?.message}
				</div>
			)}

			{!address && <MainContainerConnectButton />}

			{address && !isLoading && isSuccess && data?.liquidities?.length > 0 && (
				<div className='flex flex-col flex-1 gap-3 min-h-[610px]'>
					<div className='flex flex-col flex-1 gap-3'>
						<Paginator
							curPage={getPaginationInfo(data, limit, offset).currentPage}
							total={getPaginationInfo(data, limit, offset).totalResults}
							limit={limit}
							onNext={() => setOffset(offset + limit)}
							onPrev={() => setOffset(offset - limit)}
						/>
						<div className='flex flex-col gap-3 p-3 pt-0'>
							{data?.liquidities.map((liq: Liquidity) => (
								<LiquidityRow
									liquidity={liq}
									key={`${liq.marketAddress}:${liq.lid}`}
									ownerMode={isEqlStr(liq.provider, address)}
								/>
							))}
						</div>
					</div>
					<div className='flex-1 flex flex-col justify-end'>
						<Paginator
							className='border-t rounded-b-3xl'
							curPage={getPaginationInfo(data, limit, offset).currentPage}
							total={getPaginationInfo(data, limit, offset).totalResults}
							limit={limit}
							onNext={() => setOffset(offset + limit)}
							onPrev={() => setOffset(offset - limit)}
						/>
					</div>
				</div>
			)}

			{!isLoading && data?.liquidities?.length == 0 && (
				<div className='flex items-center justify-center font-light text-gray-400 h-[300px] lg:h-[480px] xl:h-[610px]'>
					No liquidity found
				</div>
			)}
		</TabsContent>
	);
}
