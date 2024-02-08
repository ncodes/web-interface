import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { ErrorIcon } from 'react-hot-toast';
import { useTicketService } from '../../hooks/services/backend/useTicketService.ts';
import useStore from '../../hooks/store/useStore.ts';
import { RequestError } from '../../libs/RequestError.ts';
import { Paginator } from '../Paginator.tsx';
import { RowSkeleton } from '../RowSkeleton.tsx';
import { TabsContent } from '../ui/Tabs.tsx';
import { TicketRow } from './TicketRow.tsx';

import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import useMounted from '../../hooks/useMounted.ts';
import { getPaginationInfo } from '../../libs/api_utils.ts';
import { MainContainerConnectButton } from '../MainContainerConnectButton.tsx';

export function MyTicketsTabContent() {
	const { getChainInfo, address } = useConnectorContext();
	const { listTickets } = useTicketService();
	const loaderProgress = useStore((state) => state.loaderProgress);
	const ticketFilter = useStore((state) => state.ticketFilter);
	const setLoaderProgress = useStore((state) => state.setLoaderProgress);
	const [offset, setOffset] = useState(0);
	const [limit] = useState(10);
	const mounted = useMounted(1000);

	const tickets = useQuery({
		queryKey: [
			'getTicketsOwned',
			{
				network: getChainInfo().queryName,
				limit,
				offset,
				connectedAddress: address,
				ticketFilter,
			},
		],
		queryFn: listTickets,
		placeholderData: keepPreviousData,
		enabled: mounted && !!address,
		refetchInterval: 10000,
	});

	useEffect(() => {
		const { isLoading, isRefetching } = tickets;
		if (isLoading) setLoaderProgress && setLoaderProgress(50);
		if (!(isRefetching || isLoading) && loaderProgress == 50) setLoaderProgress?.(100);
	}, [
		tickets.isError,
		tickets.isLoading,
		setLoaderProgress,
		tickets.isRefetching,
		tickets.isRefetchError,
		tickets.fetchStatus,
	]);

	return (
		<TabsContent value='my-tickets' className='p-0 m-0 flex flex-col flex-1 gap-3 '>
			<Helmet>
				<title>{`My Tickets - Joint`}</title>
			</Helmet>
			{address && tickets.isLoading && <RowSkeleton className='h-[300px] xl:h-[610px]' />}

			{tickets.isError && (
				<div className='flex items-center gap-2 text-red-300 justify-center font-light  h-[300px] xl:h-[610px]'>
					<ErrorIcon className='w-[20px]' /> {(tickets.error as RequestError)?.message}
				</div>
			)}

			{!address && <MainContainerConnectButton />}

			{!tickets.isLoading && tickets.isSuccess && tickets.data?.tickets?.length > 0 && (
				<div className='flex flex-col flex-1 gap-3 min-h-[300px] xl:min-h-[610px]'>
					<div className='flex flex-col flex-1 gap-3'>
						<Paginator
							curPage={getPaginationInfo(tickets.data, limit, offset).currentPage}
							total={getPaginationInfo(tickets.data, limit, offset).totalResults}
							limit={limit}
							onNext={() => setOffset(offset + limit)}
							onPrev={() => setOffset(offset - limit)}
						/>
						<div className='flex flex-col gap-3 p-3 pt-0'>
							{tickets.data?.tickets.map((ticket: Ticket) => (
								<TicketRow ticket={ticket} key={`${ticket.owner}:${ticket.index}`} />
							))}
						</div>
					</div>
					<div className='flex-1 flex flex-col justify-end'>
						<Paginator
							className='border-t rounded-b-3xl'
							curPage={getPaginationInfo(tickets.data, limit, offset).currentPage}
							total={getPaginationInfo(tickets.data, limit, offset).totalResults}
							limit={limit}
							onNext={() => setOffset(offset + limit)}
							onPrev={() => setOffset(offset - limit)}
						/>
					</div>
				</div>
			)}

			{!tickets.isLoading && tickets.data?.tickets?.length == 0 && (
				<div className='flex items-center justify-center font-light text-gray-400 h-[300px] xl:h-[610px]'>
					No ticket found
				</div>
			)}
		</TabsContent>
	);
}
