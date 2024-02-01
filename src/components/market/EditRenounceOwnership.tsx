import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import useMarketContract from '../../hooks/services/contracts/useMarketContract.ts';
import { useToast } from '../../hooks/useToast.tsx';
import { delay, logError } from '../../libs/helpers.ts';
import IconSpinner from '../icons/IconSpinner.tsx';
import { Button } from '../ui/Button.tsx';
import { EditRow } from './EditRow.tsx';

export function EditRenounceOwnership({ market, close }: { market: Market; close?: () => void }) {
	const { getChainInfo } = useConnectorContext();
	const { renounceOwnership, humanizeErrors } = useMarketContract();
	const [loading, setLoading] = useState(false);
	const { notifySuccess, notifyError } = useToast();
	const queryClient = useQueryClient();

	const doWrite = async () => {
		try {
			setLoading(true);
			const txHash = await renounceOwnership(market.address);
			const blockExplorer = getChainInfo().blockExplorer;
			await delay(10000);
			notifySuccess('Successfully renounced ownership', {
				duration: 5000,
				links: [{ label: 'View Transaction', href: `${blockExplorer}/tx/${txHash}` }],
			});
			queryClient.refetchQueries(['getMarketsByCreator']).catch(logError);
			close && close();
		} catch (error) {
			const msg = humanizeErrors(error);
			notifyError(msg);
			logError(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<EditRow
			title='Renounce Ownership'
			tip='Renounce your right to configure this market (ossification). Future commisions will still be sent to the market creator. This cannot be undone.'
		>
			<div className='w-full flex gap-4'>
				<Button size='sm' onClick={doWrite} disabled={loading || market.renounced} variant='destructive'>
					{!loading && <>Renounce</>}
					{loading && (
						<>
							<IconSpinner width='20' fill='fill-gray-100' className='animate-spin' />
						</>
					)}
				</Button>
			</div>
		</EditRow>
	);
}
