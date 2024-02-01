import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import useMarketContract from '../../hooks/services/contracts/useMarketContract.ts';
import { useToast } from '../../hooks/useToast.tsx';
import { delay, logError } from '../../libs/helpers.ts';
import Input2 from '../Input2.tsx';
import IconSpinner from '../icons/IconSpinner.tsx';
import { Button } from '../ui/Button.tsx';
import { EditRow } from './EditRow.tsx';

export function EditCommission(props: { market: Market; close?: () => void }) {
	const { getChainInfo } = useConnectorContext();
	const { setCommission: write, humanizeErrors } = useMarketContract();
	const [loading, setLoading] = useState(false);
	const [commission, setCommission] = useState((props.market.commission || 0) / 100);
	const [err, setErr] = useState('');
	const { notifySuccess, notifyError } = useToast();
	const queryClient = useQueryClient();

	const doWrite = async () => {
		try {
			setLoading(true);
			const txHash = await write(props.market.address, commission * 100);
			const blockExplorer = getChainInfo().blockExplorer;
			await delay(10000);
			notifySuccess('Successfully updated market commission', {
				duration: 5000,
				links: [{ label: 'View Transaction', href: `${blockExplorer}/tx/${txHash}` }],
			});
			queryClient.refetchQueries(['getMarketsByCreator']).catch(logError);
			props.close && props.close();
		} catch (error) {
			const msg = humanizeErrors(error);
			notifyError(msg);
			logError(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<EditRow title='Commission' tip="Update the market's commission">
			<div className='w-full flex gap-4 items-center'>
				<Input2
					type='number'
					className='px-3 py-4'
					value={commission.toString()}
					disabled={loading}
					err={err}
					onChange={(e) => {
						setCommission(parseFloat(e.target.value || ''));
						if (e.target.value == undefined) return;
						if (parseFloat(e.target.value) > 30) {
							setErr('Commission must be less than 30%');
						} else {
							setErr('');
						}
					}}
					afterInput={
						<>
							<Button
								size='sm'
								rounded='xl'
								className='mt-[1px] mr-1'
								onClick={doWrite}
								disabled={loading || err.length > 0}
							>
								{!loading && <>Update</>}
								{loading && (
									<>
										<IconSpinner width='20' fill='fill-[#06060c]' className='animate-spin' />
									</>
								)}
							</Button>
						</>
					}
				/>
			</div>
		</EditRow>
	);
}
