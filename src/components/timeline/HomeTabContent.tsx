import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useWindowScroll } from '@uidotdev/usehooks';
import { Fragment, useEffect } from 'react';
import { ErrorIcon } from 'react-hot-toast';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import { useTimelineService } from '../../hooks/services/backend/useTimelineService.ts';
import useMounted from '../../hooks/useMounted.ts';
import { RequestError } from '../../libs/RequestError.ts';
import { logError } from '../../libs/helpers.ts';
import IconSpinner from '../icons/IconSpinner.tsx';
import { TabsContent } from '../ui/Tabs.tsx';
import { RowSkeleton } from './RowSkeleton.tsx';
import TimelineEvent from './TimelineEvent.tsx';

export function HomeTabContent() {
	const { getChainInfo } = useConnectorContext();
	const { get } = useTimelineService();
	const [{ y }] = useWindowScroll();
	const mounted = useMounted(1000);

	const events = useInfiniteQuery({
		queryKey: ['getTimelineEvents', { network: getChainInfo().queryName, limit: 1 }],
		queryFn: get,
		initialPageParam: 0,
		placeholderData: keepPreviousData,
		enabled: mounted,
		getNextPageParam: (lastPage) => {
			return lastPage.events.length > 0 ? lastPage.events[0].sn : undefined;
		},
	});

	useEffect(() => {
		const h = document.documentElement,
			b = document.body,
			st = 'scrollTop',
			sh = 'scrollHeight';
		const percent = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
		if (percent >= 90 && !events.isFetchingNextPage) {
			events.fetchNextPage().catch(logError);
		}
	}, [y]);

	setTimeout(() => {
		events.fetchNextPage().catch(logError);
	}, 5000);

	return (
		<TabsContent value='home' className=''>
			<div className='flex flex-col md:items-center gap-5 md:px-5 py-5'>
				{events.isLoading && <RowSkeleton className='h-[300px] xl:h-[600px]' />}

				{events.isError && (
					<div className='flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]'>
						<ErrorIcon className='w-[20px]' /> {(events.error as RequestError)?.message}
					</div>
				)}

				{events.data?.pages.map((page, i) => (
					<Fragment key={i}>
						{page.events.map((event) => (
							<Fragment key={`${event.creator}:${event.action}:${event.createdAt}`}>
								<TimelineEvent event={event}></TimelineEvent>
							</Fragment>
						))}
					</Fragment>
				))}

				{events.isFetchingNextPage && !events.isLoading && (
					<div className='flex justify-center items-center gap-2 font-light text-sm text-gray-400'>
						<IconSpinner width='20' className='animate-spin' fill='fill-[#3d5226]' />
					</div>
				)}
			</div>
		</TabsContent>
	);
}
