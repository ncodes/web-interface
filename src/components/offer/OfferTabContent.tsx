import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect } from 'react';
import Helmet from 'react-helmet';
import { ErrorIcon } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import { useOfferService } from '../../hooks/services/backend/useOfferService.ts';
import useStore from '../../hooks/store/useStore.ts';
import useMounted from '../../hooks/useMounted.ts';
import { RequestError } from '../../libs/RequestError.ts';
import { RowSkeleton } from '../RowSkeleton.tsx';
import { OfferRow } from '../liquidity/OfferRow.tsx';
import { TabsContent } from '../ui/Tabs.tsx';
import { Label } from '../ui/label.tsx';
import OfferEvent from './OfferEvent.tsx';
import { OfferEventRowSkeleton } from './OfferEventRowSkeleton.tsx';

export function OfferTabContent({ setOffer }: { setOffer: Dispatch<SetStateAction<Offer | undefined>> }) {
	const { getOffer, markAsRead, getEvents } = useOfferService();
	const { getChainInfo, address } = useConnectorContext();
	const queryClient = useQueryClient();
	const { id } = useParams<{ id: string }>();
	const user = useStore((state) => state.user);
	const setLoaderProgress = useStore((state) => state.setLoaderProgress);
	const loaderProgress = useStore((state) => state.loaderProgress);
	const mounted = useMounted(1000);

	const offer = useQuery({
		queryKey: ['getOffer', { network: getChainInfo().queryName, offerId: parseInt(id as string) }],
		queryFn: getOffer,
		enabled: mounted && !!id,
		refetchInterval: 15000,
	});

	const events = useQuery({
		queryKey: ['getOfferEvents', { network: getChainInfo().queryName, offerId: parseInt(id as string) }],
		queryFn: getEvents,
		enabled: offer.isSuccess,
		refetchInterval: 15000,
	});

	useEffect(() => {
		const { isLoading, isRefetching } = offer;
		if (isLoading) setLoaderProgress && setLoaderProgress(50);
		if (!(isRefetching || isLoading) && loaderProgress == 50) setLoaderProgress?.(100);
		if (offer.data) setOffer(offer.data);
	}, [offer.isError, offer.isLoading, offer.isRefetching, offer.isRefetchError]);

	const markAsReadMut = useMutation({
		mutationFn: markAsRead,
    
	});

	useEffect(() => {
		if (!address || !user) return;
		markAsReadMut.mutateAsync({ network: getChainInfo().queryName, offerId: offer.data?.offerId }).then(async () => {
			await queryClient.refetchQueries({ queryKey: ['countUnreadOffer'] });
		});
	}, [address, user]);

	return (
		<TabsContent value='offers' className='p-0 m-0 px-0 flex flex-1 flex-col gap-3'>
			{offer.data && (
				<Helmet>
					<title>{`Offer #${offer.data?.offerId} - Joint`}</title>
				</Helmet>
			)}

			<div className='p-0 m-0'>
				{offer.isLoading && <RowSkeleton />}

				{offer.isError && (
					<div className='flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]'>
						<ErrorIcon className='w-[20px]' /> {(offer.error as RequestError)?.message}
					</div>
				)}

				{!offer.isLoading && offer.isSuccess && (
					<div className=' pr-0 flex-1 '>
						<OfferRow
							offer={offer.data}
							className='rounded-none border-r-0 border-l-0 border-t-0 border-b-gray-800 hover:border-b-gray-800'
						/>
						<div className='flex flex-col md:items-center gap-5 px-3 md:px-5 py-5'>
							{events.isLoading && <OfferEventRowSkeleton />}

							{events.isError && (
								<div className='flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]'>
									<ErrorIcon className='w-[20px]' /> {(events.error as RequestError)?.message}
								</div>
							)}

							{!events.isLoading && events.isSuccess && events.data.events.length == 0 && (
								<div className='flex items-center gap-2 text-gray-300 justify-center font-normal tracking-wide  h-[300px]'>
									No events found
								</div>
							)}

							{!events.isLoading && events.isSuccess && events.data.events.length > 0 && (
								<>
									<Label className='text-xl tracking-wide'>Offer Events</Label>
									<div className='flex flex-col gap-5'>
										{events.data?.events?.map((event) => (
											<OfferEvent event={event} key={`${event.creator}:${event.action}:${event.createdAt}`} />
										))}
									</div>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</TabsContent>
	);
}
