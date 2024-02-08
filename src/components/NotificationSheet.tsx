import { Cross2Icon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useConnectorContext } from '../hooks/connectors/useConnectorContext.tsx';
import { useNotificationService } from '../hooks/services/backend/useNotificationService.ts';
import useStore from '../hooks/store/useStore.ts';
import { useSession } from '../hooks/useSession.ts';
import { useSheetInfo } from '../hooks/useSheetInfo.ts';
import { cn } from '../libs/utils.ts';
import { NotificationItem } from './NotificationItem.tsx';
import ScrollOverflowIndicator from './ScrollOverflowIndicator.tsx';
import { ToolTip } from './ToolTip.tsx';
import IconInboxChecked from './icons/IconInboxChecked.tsx';
import IconSpinner from './icons/IconSpinner.tsx';
import { UnreadMessageCount } from './messenger/UnreadMessageCount.tsx';
import { Button } from './ui/Button.tsx';
import { ScrollArea } from './ui/scroll-area.tsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet.tsx';

export function NotificationSheet(props: { children?: React.ReactNode }) {
	const [, sheetSide, styles] = useSheetInfo();
	const user = useStore((state) => state.user);
	const { address, getChainInfo } = useConnectorContext();
	const openState = useStore((state) => state.openState);
	const toggleOpenState = useStore((state) => state.toggleOpenState);
	const { getNotifications, markNotificationsAsRead } = useNotificationService();
	const queryClient = useQueryClient();
	const { hasAccessToken } = useSession();

	const getNotesQuery = useQuery({
		queryKey: [
			'getNotifications',
			{
				net: getChainInfo().queryName,
				limit: 25,
			},
		],
		queryFn: getNotifications,
		enabled: !!address && !!user && hasAccessToken(address) && openState.notificationSheet,
		refetchInterval: 10000,
	});

	const markAsReadMutation = useMutation({
		mutationFn: markNotificationsAsRead,
	});

	async function doMarkAllAsRead() {
		await markAsReadMutation.mutateAsync({ net: getChainInfo().queryName });
		await getNotesQuery.refetch();
		await queryClient.refetchQueries({ queryKey: ['countNotifications'] });
	}

	function hasUnread() {
		if (!getNotesQuery.data) return false;
		return getNotesQuery.data.some((note) => {
			return !note.read;
		});
	}

	return (
		<Sheet
			open={openState.notificationSheet}
			onOpenChange={() => {
				toggleOpenState && toggleOpenState('notificationSheet');
			}}
		>
			<SheetTrigger>{props.children}</SheetTrigger>
			<SheetContent
				className={cn(
					styles,
					'w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0 h-[90svh] md:h-[100svh]',
				)}
				side={sheetSide}
			>
				<SheetHeader className='flex pr-[40px] border-b border-gray-800'>
					<div className='text-white'>
						<SheetTitle className='flex justify-between items-center text-gray-100 tracking-wide p-3 pl-5'>
							<div className='flex items-center gap-2'>
								Notifications
								<UnreadMessageCount disableUnmark />
							</div>
							<div className=''>
								<Button
									variant='link'
									className='h-auto p-0 font-light text-xs relative top-0.5 text-gray-400 transition-all duration-300 hover:text-chinese-green hover:scale-110'
									disabled={!hasUnread() || markAsReadMutation.isPending}
									onClick={() => {
										doMarkAllAsRead();
									}}
								>
									{!markAsReadMutation.isPending && (
										<ToolTip tip='Mark all as read' allowPropagation>
											<IconInboxChecked width='20' />
										</ToolTip>
									)}
									{markAsReadMutation.isPending && (
										<IconSpinner width='20' fill='fill-gray-500' className='animate-spin' />
									)}
								</Button>
							</div>
						</SheetTitle>
					</div>
				</SheetHeader>
				<div className='px-3 text-white h-full  pb-10'>
					<ScrollOverflowIndicator side='bottom' className='h-full'>
						<ScrollArea type='scroll' className='h-full' viewportClassName='[&>div]:h-full'>
							{!getNotesQuery.isLoading && !getNotesQuery.isRefetching && getNotesQuery.data?.length === 0 && (
								<div className='w-full h-full flex justify-center items-center font-light text-gray-400 '>
									Nothing here yet.
								</div>
							)}

							{getNotesQuery.isLoading && (
								<div className='w-full h-full flex justify-center items-center font-light text-gray-400 '>
									<IconSpinner width='20' fill='fill-gray-500' className='animate-spin' />
								</div>
							)}

							{!getNotesQuery.isLoading && getNotesQuery.isSuccess && getNotesQuery.data?.length > 0 && (
								<div className='flex flex-col gap-3 py-3 pb-10'>
									{getNotesQuery.data.map((note) => (
										<NotificationItem key={note.id} note={note} />
									))}
								</div>
							)}
						</ScrollArea>
					</ScrollOverflowIndicator>
				</div>
				<div
					className='absolute text-gray-200 right-4 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary '
					onClick={() => {
						toggleOpenState && toggleOpenState('notificationSheet');
					}}
				>
					<Cross2Icon className='h-6 w-6 transition-all duration-300 hover:text-chinese-green hover:scale-110 cursor-pointer' />
					<span className='sr-only'>Close</span>
				</div>
			</SheetContent>
		</Sheet>
	);
}
