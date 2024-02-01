import { Cross2Icon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import _ from 'lodash';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Address } from 'viem';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import useCoreContract from '../../hooks/services/contracts/useCoreContract.ts';
import { useBaseQuoteRate } from '../../hooks/useBaseQuoteRate.ts';
import { useToast } from '../../hooks/useToast.tsx';
import { isSynth } from '../../libs/api_utils.ts';
import { delay, isEmpty, isZero, logError, powOfD, toBN, toDec, toLD } from '../../libs/helpers.ts';
import IconSpinner from '../icons/IconSpinner.tsx';
import { Button } from '../ui/Button.tsx';
import { TabsContent } from '../ui/Tabs.tsx';
import { Accordion } from '../ui/accordion.tsx';
import { ScrollArea } from '../ui/scroll-area.tsx';
import { ManageLiqEditAmount } from './ManageLiqEditAmount.tsx';
import { ManageLiqEditMaxSwapAmount } from './ManageLiqEditMaxSwapAmount.tsx';
import { ManageLiqEditMinSwapAmount } from './ManageLiqEditMinSwapAmount.tsx';
import { ManageLiqEditPause } from './ManageLiqEditPause.tsx';
import { ManageLiqEditPaymentTime } from './ManageLiqEditPaymentTime.tsx';
import { ManageLiqEditPrice } from './ManageLiqEditPrice.tsx';
import { ManageLiqEditTarget } from './ManageLiqEditTarget.tsx';

interface InputState {
	value?: string | number;
	err?: string;
	setErr?: Dispatch<SetStateAction<string>>;
}

export function ManageGeneralLiquidityTab({
	onClick,
	liquidity,
	market,
	close,
}: {
	onClick: () => void;
	liquidity: Liquidity;
	market: Market;
	close: () => void;
}) {
	const { updateFungibleLiquidity, humanizeErrors } = useCoreContract();
	const { getChainInfo, getTokenAllowance, getTokenSupply, approveAllowance, humanizeErc20Errors, address } =
		useConnectorContext();
	const { notifyError, notifySuccess } = useToast();
	const [addLoading, setAddLoading] = useState(false);
	const [allowLoading, setAllowLoading] = useState(false);
	const [amount, setAmount] = useState<InputState>({});
	const [price, setPrice] = useState<InputState>({});
	const [minSwapAmount, setMinSwapAmount] = useState<InputState>({});
	const [maxSwapAmount, setMaxSwapAmount] = useState<InputState>({});
	const [paymentTime, setPaymentTime] = useState<InputState>({});
	const [target, setTarget] = useState<InputState>({ value: '', err: '' });
	const [pause, setPause] = useState(false);
	const [ready, setReady] = useState(false);
	const [allowance, setAllowance] = useState(0n);
	const [hasAllowance, setHasAllowance] = useState(false);
	const queryClient = useQueryClient();
	const [accordionToOpen, setAccordionToOpen] = useState<string[]>(['Amount', 'Price']);

	const { baseUsdRate, quoteUsdRate } = useBaseQuoteRate(market, true, true);

	useEffect(() => {
		(async () => {
			if (isSynth(market.baseType)) return;
			setAllowance(
				await getTokenAllowance(
					market.baseAddress as Address,
					address as Address,
					getChainInfo().contracts?.core.address as Address,
				),
			);
		})();
	}, [amount, allowLoading]);

	useEffect(() => {
		validate();
	}, [amount.value, price, minSwapAmount, maxSwapAmount, paymentTime, target, pause]);

	useEffect(() => {
		setHasAllowance(hasEnoughAllowance());
	}, [ready, allowLoading, amount, allowance]);

	// Checks if there is enough allowance to cover the amount
	function hasEnoughAllowance() {
		if (isSynth(market.baseType)) return true;
		const { newAmt, deduct } = getAmountChange();
		if (deduct || newAmt == '0') return true;
		return toDec(allowance).gte(toDec((amount.value as string) || '0').mul(powOfD(1, market.baseDecimals)));
	}

	// Gets the field values.
	function getValues() {
		const { baseDecimals, quoteDecimals } = market;
		return {
			amount: toLD((amount?.value as string) || '0', baseDecimals),
			price: toLD(price?.value || '0', quoteDecimals),
			minSwap: toLD(minSwapAmount?.value || '0', baseDecimals),
			maxSwap: toLD(maxSwapAmount?.value || '0', baseDecimals),
			target: (target.value as string) || ethers.constants.AddressZero,
			paymentTime: !market.instant ? (paymentTime.value as string) : '0',
			paused: pause ? 1 : 0,
		};
	}

	// Validate checks if fields are correct and ready to be submitted.
	function validate() {
		let ready = true;

		if (amount.err || price.err || minSwapAmount.err || maxSwapAmount.err || paymentTime.err || target.err) {
			setReady(false);
			const openAccordions: string[] = [];
			if (minSwapAmount.err) openAccordions.push('Minimum Swap Amount');
			if (maxSwapAmount.err) openAccordions.push('Maximum Swap Amount');
			if (target.err) openAccordions.push('Target');
			setAccordionToOpen([...accordionToOpen, ...openAccordions]);
		}

		if (isEmpty(amount.value) || (isZero(amount.value) && !liquidity)) {
			ready = false;
			amount.setErr && amount.setErr('Amount is required');
		} else {
			amount.setErr && amount.setErr('');
		}

		if (isZero(price.value)) {
			ready = false;
			price.setErr && price.setErr('Price is required');
		} else {
			price.setErr && price.setErr('');
		}

		ready = ready ? (minSwapAmount.err ? false : true) : ready;
		ready = ready ? (maxSwapAmount.err ? false : true) : ready;
		ready = ready ? (paymentTime.err ? false : true) : ready;
		ready = ready ? (target.err ? false : true) : ready;

		// Check if anything changed
		if (ready && liquidity) {
			const values = getValues();
			if (
				values.amount == liquidity.amount &&
				values.price == liquidity.price &&
				values.minSwap == liquidity.minSwap &&
				values.maxSwap == liquidity.maxSwap &&
				parseInt(values.paymentTime) == liquidity.timeToPay &&
				values.target == liquidity.target &&
				!!values.paused == liquidity.paused
			) {
				ready = false;
			}
		}

		setReady(ready);
	}

	// Request and execute token allowance
	async function doRequestAllowance() {
		try {
			setAllowLoading(true);
			await approveAllowance(
				market.baseAddress as Address,
				getChainInfo().contracts?.core.address as Address,
				await getTokenSupply(market.baseAddress as Address),
			);
			notifySuccess('Allowance successfully approved', { duration: 5000 });
		} catch (error) {
			const msg = humanizeErc20Errors(error);
			notifyError(msg);
			logError(error);
		} finally {
			setAllowLoading(false);
		}
	}

	function getAmountChange() {
		const { amount } = getValues();
		let newAmt = amount;
		let deduct = false;
		if (liquidity) {
			if (toBN(newAmt).eq(liquidity.amount)) {
				newAmt = '0';
			} else if (toBN(newAmt).lt(liquidity.amount)) {
				deduct = true;
				newAmt = toBN(liquidity.amount).sub(newAmt).toString();
			} else {
				deduct = false;
				newAmt = toBN(newAmt).sub(liquidity.amount).toString();
			}
		}
		return { newAmt, deduct };
	}

	// Add or modify a liquidity
	async function doAddOrUpdate() {
		try {
			setAddLoading(true);

			const values = getValues();
			const { newAmt, deduct } = getAmountChange();

			await updateFungibleLiquidity(
				market.address,
				!liquidity ? 100000 : liquidity.lid,
				deduct,
				values.target as Address,
				newAmt,
				values.price,
				[],
				[],
				[values.minSwap, values.maxSwap, values.paymentTime, 0, values.paused],
			);

			await delay(10000);
			await queryClient.refetchQueries(['getLiquidityByCreator']);
			await queryClient.refetchQueries(['getLiquidities']);
			await queryClient.refetchQueries(['getMarket']);

			notifySuccess(`Liquidity successfully ${!liquidity ? 'added' : 'updated'}`, { duration: 5000 });

			close && close();
		} catch (error) {
			const msg = humanizeErrors(error);
			notifyError(msg);
			logError(error);
		} finally {
			setAddLoading(false);
		}
	}

	return (
		<TabsContent value='general' className={`flex-1 p-0 mt-0`}>
			<div className='flex flex-col text-white h-full'>
				<div className='flex-1'>
					<ScrollArea viewportClassName='absolute' className='h-full relative'>
						<div className=' text-white h-full '>
							{liquidity && (
								<p className='p-5 py-3 font-light text-gray-300 text-sm'>
									Manage your liquidity. You can add, remove, restrict or pause your liquidity.
								</p>
							)}
							{!liquidity && <p className='p-5 py-3 font-light text-gray-300 text-sm'>Add liquidity to the market.</p>}
							<Accordion
								value={_.uniq(accordionToOpen)}
								onValueChange={(values) => {
									setAccordionToOpen(_.uniq([...values]));
								}}
								type='multiple'
							>
								<ManageLiqEditAmount
									market={market}
									liquidity={liquidity}
									disabled={addLoading}
									baseUsdRate={baseUsdRate.data as number}
									onValueChanged={(value, err, setErr) => {
										setAmount({ value, err, setErr });
									}}
								/>

								<ManageLiqEditPrice
									liquidity={liquidity}
									market={market}
									disabled={addLoading}
									baseUsdRate={baseUsdRate.data as number}
									quoteUsdRate={quoteUsdRate.data as number}
									onValueChanged={(value, err, setErr) => {
										setPrice({ value, err, setErr });
										validate();
									}}
								/>

								<ManageLiqEditMinSwapAmount
									market={market}
									disabled={addLoading}
									baseUsdRate={baseUsdRate.data as number}
									liquidity={liquidity}
									liquidityEdits={{ amount: amount?.value as string }}
									onValueChanged={(value, err, setErr) => {
										setMinSwapAmount({ value, err, setErr });
										validate();
									}}
								/>

								<ManageLiqEditMaxSwapAmount
									market={market}
									disabled={addLoading}
									baseUsdRate={baseUsdRate.data as number}
									liquidity={liquidity}
									liquidityEdits={{
										amount: amount?.value as string,
										minSwap: minSwapAmount.value as string,
									}}
									onValueChanged={(value, err, setErr) => {
										setMaxSwapAmount({ value, err, setErr });
										validate();
									}}
								/>

								{!market.instant && (
									<ManageLiqEditPaymentTime
										market={market}
										disabled={addLoading}
										liquidity={liquidity}
										onValueChanged={(value, err, setErr) => {
											setPaymentTime({ value, err, setErr });
										}}
									/>
								)}

								<ManageLiqEditTarget
									liquidity={liquidity}
									disabled={addLoading}
									market={market}
									onValueChanged={(value, err, setErr) => {
										setTarget({ value, err, setErr });
									}}
								/>

								<ManageLiqEditPause
									liquidity={liquidity}
									disabled={addLoading}
									market={market}
									onValueChanged={(value) => {
										setPause(value);
									}}
								/>
							</Accordion>
						</div>
					</ScrollArea>
				</div>

				<div className='w-full p-3 border-t border-gray-800 flex flex-col gap-2'>
					{amount.value && !hasAllowance && (
						<Button size='full' variant='secondary' disabled={allowLoading} onClick={doRequestAllowance}>
							{!allowLoading && <>Approve</>}
							{allowLoading && (
								<>
									<IconSpinner width='20' fill='fill-gray-900' className='animate-spin' />
								</>
							)}
						</Button>
					)}
					<Button size='full' disabled={!ready || !hasAllowance || addLoading} onClick={doAddOrUpdate}>
						{!addLoading && <>{!liquidity ? 'Add' : 'Update'}</>}
						{addLoading && (
							<>
								<IconSpinner width='20' fill='fill-gray-900' className='animate-spin' />
							</>
						)}
					</Button>
				</div>
				<div
					className='absolute cursor-pointer text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'
					onClick={onClick}
				>
					<Cross2Icon className='h-6 w-6 transition-all duration-300 hover:text-chinese-green hover:scale-110 cursor-pointer' />
					<span className='sr-only'>Close</span>
				</div>
			</div>
		</TabsContent>
	);
}
