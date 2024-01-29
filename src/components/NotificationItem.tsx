import { useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { useConnectorContext } from '../hooks/connectors/useConnectorContext.tsx';
import { useNotificationService } from '../hooks/services/backend/useNotificationService.ts';
import { cn } from '../libs/helpers.ts';
import { NotificationType } from '../types/enums.ts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';

const humanizedNoteType = {
	'swap:instant': 'Instant Swap',
	'swap:interactive': 'Interactive Swap',
	'order:cancellation': 'Order Cancelled',
	'order:paid': 'Order Paid',
	'order:released': 'Order Released',
	'market:perm:put:approved': 'LP Permission Approved',
	'market:perm:put:revoked': 'LP Permission Revoked',
	'market:perm:swap:approved': 'Swap Permission Approved',
	'market:perm:swap:revoked': 'Swap Permission Revoked',
	'market:liquidity-manager:updated': 'Liquidity Manager Updated',
	'market:liquidity-manager:removed': 'Liquidity Manager Removed',
	'dispute:created': 'New Dispute',
	'dispute:ticket-drafted': 'Ticket Draft',
	'dispute:evidence-submission': 'Evidence Submission Started',
	'dispute:evidence-phase-started': 'Evidence Submission Started',
	'dispute:ticket-slashed': 'Ticket Slashed',
	'dispute:evidence-phase-ended': 'Commit Phase Started',
	'dispute:commit-phase-ended': 'Commit Phase Ended',
	'dispute:reveal-phase-ended': 'Reveal Phase Ended',
	'dispute:executed': 'Dispute Executed',
	'offer:new': 'New Offer',
	'offer:updated': 'Offer Updated',
	'offer:accepted': 'Offer Accepted',
	'offer:unaccepted': 'Offer Unaccepted',
	'offer:cancelled': 'Offer Cancelled',
	'offer:executed': 'Offer Executed',
	'chat:new-message': 'New Message Interaction',
};

function getLink({ body, type }: Notification) {
	if (type == NotificationType.InstantSwap) return '#';
	const match = body.match(/<\/?a[^>].*>.*?/g);
	if (!match) return;
	const href = match[0].match(/href="([^"]*)/);
	if (!href) return;
	return href[1];
}

export function NotificationItem({ note }: { note: Notification }) {
	const link = getLink(note);
	const { getChainInfo } = useConnectorContext();
	const { markNotificationsAsRead } = useNotificationService();
	const queryClient = useQueryClient();

	const markAsReadMutation = useMutation({
		mutationFn: markNotificationsAsRead,
	});

	async function doMarkAsRead() {
		if (note.read) return;
		await markAsReadMutation.mutateAsync({
			id: note.id,
			net: getChainInfo().queryName,
		});
		queryClient.refetchQueries(['getNotifications', 'countNotifications']);
	}

	// Remove links from body but replace the links with the inner text.
	function cleanBody(body: string) {
		return body.replace(/<\/?a[^>].*>.*?/g, (match) => {
			const href = match.match(/href="([^"]*)/);
			if (!href) return match;
			const innerText = match.match(/>([^<]*)/);
			if (!innerText) return match;
			return innerText[1];
		});
	}

	function wrapLink(link) {
		const card = (
			<Card
				className={cn(
					'w-full shrink-0 border   border-gray-900 cursor-pointer bg-card-background shadow-gray-900 shadow-lg border-b-gray-800 hover:border-gray-700 transition-all duration-500',
					{
						'border-chinese-green hover:border-chinese-green': !note.read,
					},
				)}
			>
				<CardHeader className='p-0 '>
					<CardTitle
						className={cn('text-gray-300 text-[13px] tracking-wide p-2 px-3 font-normal border-b border-gray-900', {
							'text-chinese-green': !note.read,
						})}
					>
						{humanizedNoteType[note.type]}
					</CardTitle>
				</CardHeader>
				<CardContent className='p-2 px-3 text-gray-300 font-extralight text-xs'>{cleanBody(note.body)}</CardContent>
				<div className='px-3 pb-3'>
					<span className='text-gray-400 font-light text-xs'>{moment(note.createdAt).fromNow()}</span>
				</div>
			</Card>
		);

		if (note.type == NotificationType.InstantSwap) return card;
		return (
			<NavLink
				to={link || '#'}
				className='cursor-pointer'
				onClick={() => {
					doMarkAsRead();
				}}
			>
				{card}
			</NavLink>
		);
	}

	return <>{wrapLink(link)}</>;
}
