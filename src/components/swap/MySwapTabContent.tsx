import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ErrorIcon } from 'react-hot-toast';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import { useSwapService } from '../../hooks/services/backend/useSwapService.ts';
import useStore from '../../hooks/store/useStore.ts';
import useMounted from '../../hooks/useMounted.ts';
import { RequestError } from '../../libs/RequestError.ts';
import { getPaginationInfo } from '../../libs/api_utils.ts';
import { MainContainerConnectButton } from '../MainContainerConnectButton.tsx';
import { Paginator } from '../Paginator.tsx';
import { RowSkeleton } from '../RowSkeleton.tsx';
import { TabsContent } from '../ui/Tabs.tsx';
import { SwapRow } from './SwapRow.tsx';

export function MySwapTabContent() {
	const { getChainInfo, address } = useConnectorContext();
	const { listSwaps } = useSwapService();
	const swapFilter = useStore((state) => state.swapFilter);
	const fullLoadCount = useStore((state) => state.fullLoadCount);
	const setLoaderProgress = useStore((state) => state.setLoaderProgress);
	const [offset, setOffset] = useState(0);
	const [limit] = useState(10);
	const mounted = useMounted(1000);

	const { isLoading, isSuccess, isRefetching, isError, isRefetchError, data, error } = useQuery({
		queryKey: [
			'getSwapsAsParticipant',
			{
				network: getChainInfo().queryName,
				limit,
				offset,
				connectedAddress: address,
				swapFilter,
			},
		],
		queryFn: listSwaps,
		enabled: mounted && !!address,
		refetchInterval: 10000,
	});

	useEffect(() => {
		if (fullLoadCount > 0) return; // no need to show loader if data is already cached
		if (isLoading || isRefetching) setLoaderProgress && setLoaderProgress(50);
		else setLoaderProgress && setLoaderProgress(100);
	}, [isError, isLoading, setLoaderProgress, isRefetching, isRefetchError]);

	return (
		<TabsContent value='my-swaps' className='p-0 m-0 flex flex-col flex-1 gap-3'>
			{address && isLoading && <RowSkeleton className='h-[300px] xl:h-[610px]' />}

			{isError && (
				<div className='flex items-center gap-2 text-red-300 justify-center font-light h-[300px] xl:h-[610px]'>
					<ErrorIcon className='w-[20px]' /> {(error as RequestError)?.message}
				</div>
			)}

			{!address && <MainContainerConnectButton />}

			{!isLoading && isSuccess && data?.swaps?.length > 0 && (
				<div className='flex flex-col flex-1 gap-3 min-h-[300px] xl:min-h-[610px]'>
					<div className='flex flex-col flex-1 gap-3'>
						<Paginator
							curPage={getPaginationInfo(data, limit, offset).currentPage}
							total={getPaginationInfo(data, limit, offset).totalResults}
							limit={limit}
							onNext={() => setOffset(offset + limit)}
							onPrev={() => setOffset(offset - limit)}
						/>
						<div className='flex flex-col gap-3 p-3 pt-0'>
							{data?.swaps.map((swap: Swap) => <SwapRow swap={swap} key={`${swap.orderId}:${swap.createdAt}`} />)}
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

			{!isLoading && data?.swaps?.length == 0 && (
				<div className='flex items-center justify-center font-light text-gray-400 h-[300px] xl:h-[610px]'>
					No swap found
				</div>
			)}
		</TabsContent>
	);
}
