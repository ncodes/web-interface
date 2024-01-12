import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ErrorIcon } from 'react-hot-toast';
import { isAddress } from 'viem';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import { useMiscService } from '../../hooks/services/backend/useMiscService.ts';
import { RequestError } from '../../libs/RequestError.ts';
import { shortenAddress } from '../../libs/helpers.ts';
import { cn } from '../../libs/utils.ts';
import ScrollOverflowIndicator from '../ScrollOverflowIndicator.tsx';
import { ToolTip } from '../ToolTip.tsx';
import { Avatar } from '../avatar/Avatar.tsx';
import IconInfoCircle from '../icons/IconInfoCircle.tsx';
import { IconPlus } from '../icons/IconPlus.tsx';
import IconSpinner from '../icons/IconSpinner.tsx';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.tsx';
import { ScrollArea } from '../ui/scroll-area.tsx';
import { Skeleton } from '../ui/skeleton.tsx';
import { AssetSelectorItem } from './AssetSelectorItem.tsx';

function AssetSelectorRowSkeleton() {
	return (
		<div className='flex gap-1 p-3'>
			<Skeleton className='shrink-0 w-[35px] h-[35px] rounded-full' />
			<div className='flex flex-col gap-1 w-full'>
				<Skeleton className='w-full h-[20px]' />
				<Skeleton className='w-6/12 h-[10px]' />
			</div>
		</div>
	);
}

/**
 * Asset selector
 * @param props The component's props
 * @param props.assetsQuery The query result for the assets
 * @param props.side The side of the selector ("BASE" or "QUOTE")
 * @param props.symbol The default symbol of the selector
 * @param props.image The default image of the selector
 * @constructor
 */
export function AssetSelector(props: {
	assetsQuery: UseQueryResult<AssetInfo[]>;
	disabled?: boolean;
	side: string;
	tip: string;
	symbol: string;
	image: string;
	onSelected: (asset: AssetInfo) => void;
}) {
	const { getTokenName, getTokenSymbol, getTokenDecimals } = useConnectorContext();
	const [open, setOpen] = useState(false);
	const [filter, setFilter] = useState('');
	const [data, setData] = useState<AssetInfo[]>(props.assetsQuery.data || []);
	const pageLimit = 20;
	const [pages, setPages] = useState<AssetInfo[][]>([data.slice(0, pageLimit)]);
	const { getTokenInfo } = useMiscService();
	const [loading, setLoading] = useState(false);
	const [fetchCustomAsset, setFetchCustomAsset] = useState(false);

	const customAssetQuery = useQuery({
		queryKey: ['getCustomAsset', { address: filter }],
		enabled: fetchCustomAsset,
		queryFn: getTokenInfo,
	});

	useEffect(() => {
		if (filter.length) {
			const filtered = applyFilter(props.assetsQuery.data || []);
			setPages([filtered]);
		} else {
			setData(props.assetsQuery.data || []);
			setPages([props.assetsQuery.data?.slice(0, pageLimit) || []]);
		}
	}, [filter, props.assetsQuery.data, open]);

	useEffect(() => {
		if (!open) setPages([[]]);
	}, [open]);

	useEffect(() => {
		if (!filteredAddrNotInList()) {
			setFetchCustomAsset(false);
			return;
		}
		setFetchCustomAsset(true);
	}, [props.assetsQuery.data, filter, pages]);

	function applyFilter(data: AssetInfo[]) {
		return data.filter((asset) => {
			return (
				asset?.symbol?.toLowerCase().includes(filter.toLowerCase()) ||
				asset?.name?.toLowerCase().includes(filter.toLowerCase()) ||
				(asset?.address.startsWith('0x') && asset?.address?.toLowerCase().includes(filter.toLowerCase())) ||
				asset?.type?.toLowerCase().includes(filter.toLowerCase())
			);
		});
	}

	function isEmpty() {
		return pages.length == 0 || pages[0].length == 0;
	}

	function filteredAddrNotInList() {
		return props.assetsQuery.isSuccess && isAddress(filter) && isEmpty();
	}

	async function useUnlisted() {
		try {
			setLoading(true);
			const name = await getTokenName(filter);
			const symbol = await getTokenSymbol(filter);
			const decimals = await getTokenDecimals(filter);
			props?.onSelected({
				name,
				symbol,
				decimals,
				address: filter,
				type: 'ERC20',
				logoURI: 'https://storage.googleapis.com/joint-images/token-logos/unknown.svg',
				price: 0,
			});
		} catch (e) {
			props?.onSelected({
				name: 'UNKNOWN',
				symbol: 'UNKNW',
				decimals: 18,
				address: filter,
				type: 'ERC20',
				logoURI: 'https://storage.googleapis.com/joint-images/token-logos/unknown.svg',
				price: 0,
			});
		} finally {
			setLoading(false);
			setOpen(false);
		}
	}

	return (
		<Popover
			modal={true}
			open={open}
			onOpenChange={(open) => {
				setOpen(open);
			}}
		>
			<PopoverTrigger disabled={props.disabled}>
				<div className='flex gap-2 flex-col'>
					<div className='flex items-center gap-2'>
						<span className='tracking-wide text-sm xxs:text-[16px]'>{props.side}</span>
						<ToolTip tip={props.tip}>
							<IconInfoCircle
								width='15px'
								className='opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer'
							/>
						</ToolTip>
					</div>
					<Button
						variant='ghost'
						className='p-0 h-auto hover:text-gray-100 transition-all hover:border-gray-500 duration-300'
						asChild
					>
						<div
							className={cn(
								'flex gap-2 items-center min-w-[120px] max-w-[170px] pl-3 pr-2 justify-between rounded-full bg-card-background border border-gray-600 cursor-pointer hover:bg-gray-600 hover:scale-105',
								{ 'bg-gray-600 scale-105 border-gray-500': open },
							)}
						>
							<div className='text-xl font-medium overflow-auto scrollbar-hide tracking-wide'>{props.symbol}</div>
							<div className='shrink-0'>
								<Avatar
									src={props.image}
									fallback={props.symbol}
									className='h-[30px] rounded-full'
									fallbackClassName='w-[30px] !bg-gray-700 text-xs'
								/>
							</div>
						</div>
					</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent className='p-0 rounded-3xl bg-modal-background overflow-hidden border-modal-border drop-shadow shadow-xl'>
				<div className='relative flex flex-col scroll-auto '>
					<div className='px-3 py-3'>
						<Input
							type='text'
							className='py-5 px-3 text-gray-200 rounded-xl'
							placeholder='Search token (ex: WETH, 0xAbC)'
							value={filter}
							onChange={(e) => {
								setFilter(e.target.value);
							}}
						/>
					</div>
					<ScrollOverflowIndicator
						side='bottom'
						className={cn({
							'[&>span.grad-indicator]:hidden': isEmpty(),
						})}
						onScroll={(progress) => {
							if (progress < 30) return;
							const newPage = data.slice(pages.length * pageLimit, pages.length * pageLimit + pageLimit);
							if (!newPage.length) return;
							setPages([...pages, newPage]);
						}}
					>
						<ScrollArea
							type='scroll'
							className={cn('text-gray-200 transition-all duration-300 border-t border-gray-700', {
								'h-[200px] md:h-[400px]': !isEmpty(),
								'h-[200px]': isEmpty(),
							})}
						>
							{props.assetsQuery.isSuccess && !isAddress(filter) && isEmpty() && (
								<div className='text-center tracking-wider font-light text-gray-400 text-sm mt-20'>No asset found</div>
							)}

							{filteredAddrNotInList() && !customAssetQuery.data && (
								<div className='flex gap-3 flex-col items-center justify-center font-light text-gray-400 text-sm mt-7'>
									<span className='px-[22px] select-none text-gray-500 text-center leading-5 text-[13px]'>
										This address was not found in the list maintained by Joint Labs or our providers.
									</span>
									<Button onClick={useUnlisted} variant='outline' disabled={loading} className='flex w-[210px] gap-2'>
										{!loading && (
											<span>
												<IconPlus />
											</span>
										)}
										{loading && <IconSpinner width='20' className='animate-spin' fill='fill-gray-400' />}
										<span>Use {shortenAddress(filter)}</span>
									</Button>
								</div>
							)}

							{props.assetsQuery.isLoading && props.assetsQuery.fetchStatus != 'idle' && <AssetSelectorRowSkeleton />}

							{props.assetsQuery.isError && (
								<div className='flex items-center gap-2 text-red-300 justify-center font-light  h-[100px]'>
									<ErrorIcon className='w-[20px]' /> {(props.assetsQuery.error as RequestError)?.message}
								</div>
							)}

							<div className='divide-y pt-2'>
								{props.assetsQuery.isSuccess && props.assetsQuery.data.length > 0 && (
									<>
										{fetchCustomAsset && customAssetQuery.isSuccess && (
											<AssetSelectorItem
												key={`${customAssetQuery.data.symbol}:${filter}`}
												asset={customAssetQuery.data}
												onClick={(asset: AssetInfo) => {
													props.onSelected && props.onSelected(asset);
													setOpen(!open);
												}}
												tip={
													<>
														{customAssetQuery.data.type == 'ERC20' && <>An ERC20 token representing on-chain value</>}
														{customAssetQuery.data.type == 'SYNTHETIC' && (
															<>A synthetic asset representing off-chain value (ex: national currency)</>
														)}
													</>
												}
											/>
										)}

										{pages.map((page) => {
											return page.map((asset) => {
												return (
													<AssetSelectorItem
														key={`${asset.symbol}:${asset.address}`}
														asset={asset}
														onClick={(asset: AssetInfo) => {
															props.onSelected && props.onSelected(asset);
															setOpen(!open);
														}}
														tip={
															<>
																{asset.type == 'ERC20' && <>An ERC20 token representing on-chain value</>}
																{asset.type == 'SYNTHETIC' && (
																	<>A synthetic asset representing off-chain store of value (ex: fiat)</>
																)}
															</>
														}
													/>
												);
											});
										})}
									</>
								)}
							</div>
						</ScrollArea>
					</ScrollOverflowIndicator>
				</div>
			</PopoverContent>
		</Popover>
	);
}
