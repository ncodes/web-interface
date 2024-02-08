import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import useMarketContract from '../../hooks/services/contracts/useMarketContract.ts';
import { useToast } from '../../hooks/useToast.tsx';
import { delay, humanizeDur2, logError } from '../../libs/helpers.ts';
import IconSpinner from '../icons/IconSpinner.tsx';
import { Button } from '../ui/Button.tsx';
import { EditFieldWithLabelAndSlider } from './EditFieldWithLabelAndSlider.tsx';
import { EditRow } from './EditRow.tsx';

export function EditDisputeDurations({ market, close }: { market: Market; close?: () => void }) {
	const [disputeDelayDur, setDisputeDelayDur] = useState(market.disputeDelayDur);
	const [evidenceDur, setEvidenceDur] = useState(market.evidenceDur);
	const [votingDur, setVotingDur] = useState(market.predictDur);
	const { getChainInfo } = useConnectorContext();
	const { setDisputeDurations, humanizeErrors } = useMarketContract();
	const [loading, setLoading] = useState(false);
	const { notifySuccess, notifyError } = useToast();
	const queryClient = useQueryClient();

	const doWrite = async () => {
		try {
			setLoading(true);
			const txHash = await setDisputeDurations(market.address, disputeDelayDur, evidenceDur, votingDur);
			const blockExplorer = getChainInfo().blockExplorer;
			await delay(5000);
			notifySuccess('Successfully updated durations', {
				duration: 5000,
				links: [{ label: 'View Transaction', href: `${blockExplorer}/tx/${txHash}` }],
			});
			queryClient.refetchQueries({ queryKey: ['getMarketsByCreator'] }).catch(logError);
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
		<EditRow title='Dispute Durations' tip="Update the market's dispute related durations">
			<div className='flex flex-col gap-2'>
				<EditFieldWithLabelAndSlider
					type='number'
					className='mb-2'
					label={<>Dispute Delay</>}
					tip='The number of seconds to wait before initiating a dispute after a trade is marked as paid.'
					value={0}
					slideMin={0}
					slideMax={86400}
					suffix={humanizeDur2(disputeDelayDur)}
					onChange={(value) => {
						setDisputeDelayDur(parseFloat(value) || 0);
					}}
				/>

				<EditFieldWithLabelAndSlider
					type='number'
					className='mb-2'
					label={<>Evidence Duration</>}
					tip='The number of seconds within which dispute evidece must be collected and analyzing by mediators'
					value={evidenceDur}
					slideMin={1800}
					slideMax={172800}
					suffix={humanizeDur2(evidenceDur)}
					onChange={(value) => {
						setEvidenceDur(parseFloat(value) || 0);
					}}
				/>

				<EditFieldWithLabelAndSlider
					type='number'
					className='mb-2'
					label={<>Voting Duration</>}
					tip='The of seconds within which dispute mediators must vote and reach a verdict. Half of the time is for vote committing and the other half is for vote revealing.'
					value={votingDur}
					slideMin={1800}
					slideMax={172800}
					suffix={humanizeDur2(votingDur)}
					onChange={(value) => {
						setVotingDur(parseFloat(value) || 0);
					}}
				/>

				<Button size='sm' className='mt-2' onClick={doWrite} disabled={loading}>
					{!loading && <>Update</>}
					{loading && (
						<>
							<IconSpinner width='20' fill='fill-[#06060c]' className='animate-spin' />
						</>
					)}
				</Button>
			</div>
		</EditRow>
	);
}
