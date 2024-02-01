import { ChainInfo } from '@jointlabs/chains-info';
import { QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Location } from 'react-router-dom';
import { Options } from '../../../hooks/useToast.tsx';
import { delay, logError } from '../../../libs/helpers.ts';

/**
 * Mark an order as "Paid" function
 *
 * @param swap The swap object
 * @param markOrderAsPaid The contract function for market an order as 'paid'
 * @param getChainInfo The function for getting the chain info
 * @param queryClient The query client
 * @param location The react router location object
 * @param loading The current loading state
 * @param setLoading The function for setting the loading state
 * @param humanizeErrors The function for humanizing errors from the contract
 * @param notifySuccess The function for notifying success
 * @param notifyError The function for notifying errors
 */
export async function markOrderAsPaidFunc(
	swap: Swap,
	markOrderAsPaid: (orderId: bigint) => Promise<`0x${string}`>,
	getChainInfo: () => ChainInfo,
	queryClient: QueryClient,
	location: Location,
	loading: LoadingState,
	setLoading: (id: string, loading: LoadingState) => void,
	humanizeErrors: (error: { message: string } | unknown) => string,
	notifySuccess: (msg: ReactNode, options?: Options) => void,
	notifyError: (msg: ReactNode, options?: Options) => void,
) {
	try {
		setLoading(swap.orderId.toFixed(), { ...loading, markOrderAsPaid: true });

		const [txHash] = await markOrderAsPaid(BigInt(swap.orderId));
		await delay(10000);

		const explorer = getChainInfo().blockExplorer;
		notifySuccess(`Swap was successfully marked as 'PAID'`, {
			duration: 5000,
			links: [{ label: 'View Transaction', href: `${explorer}/tx/${txHash}` }],
		});

		if (location.pathname.includes('my/swaps')) {
			await queryClient.refetchQueries(['getSwapsAsParticipant']);
		} else if (location.pathname.includes('swap/')) {
			await queryClient.refetchQueries(['getSwap']);
		}
	} catch (error) {
		const msg = humanizeErrors(error);
		notifyError(msg);
		logError(error);
	} finally {
		setLoading(swap.orderId.toFixed(), { ...loading, markOrderAsPaid: false });
	}
}
