import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Conversation } from '@xmtp/xmtp-js';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext';
import { useConvoService } from '../../hooks/services/backend/useConvoService';
import useStore from '../../hooks/store/useStore';
import { useToast } from '../../hooks/useToast';
import { ToolTip } from '../ToolTip';
import IconSpinner from '../icons/IconSpinner';
import { Button } from '../ui/Button';

export function MuteMessenger({ convos }: { convos: Conversation[] }) {
	const { areConvosMuted, toggleConvosMuteStatus } = useConvoService();
	const { getChainInfo } = useConnectorContext();
	const user = useStore((state) => state.user);
	const { notifySuccess, notifyError } = useToast();

	const mutedQuery = useQuery({
		queryKey: ['areConvosMuted', { network: getChainInfo().queryName, topics: convos.map((c) => c.topic) }],
		queryFn: areConvosMuted,
		enabled: !!user && !!convos.length,
	});

	const toggleMuteMutation = useMutation({
		mutationFn: toggleConvosMuteStatus,
	});

	async function toggleMute() {
		try {
			await toggleMuteMutation.mutateAsync({
				network: getChainInfo().queryName,
				topics: convos.map((c) => c.topic),
			});
			notifySuccess(mutedQuery.data ? 'Chat unmuted' : 'Chat muted', {
				duration: 3000,
				position: 'bottom-right',
			});
			mutedQuery.refetch();
		} catch (error) {
			notifyError('Failed to mute', {
				duration: 5000,
				position: 'bottom-right',
			});
		}
	}

	return (
		<Button variant='ghost' className='p-1 h-auto transition-all duration-300' onClick={toggleMute}>
			{toggleMuteMutation.isPending && <IconSpinner width='15' className='animate-spin' fill='fill-gray-500' />}
			{!toggleMuteMutation.isPending && (
				<div>
					{mutedQuery.isSuccess && !mutedQuery.data && (
						<ToolTip tip='Mute Chat' allowPropagation>
							<SpeakerOffIcon width='25' />
						</ToolTip>
					)}
					{mutedQuery.isSuccess && mutedQuery.data && (
						<ToolTip tip='Unmute Chat' allowPropagation>
							<SpeakerLoudIcon width='25' />
						</ToolTip>
					)}
				</div>
			)}
		</Button>
	);
}
