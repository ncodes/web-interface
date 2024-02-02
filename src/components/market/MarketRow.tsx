import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { ChevronRight } from 'lucide-react';
import { BaseSyntheticEvent, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import { useToast } from '../../hooks/useToast.tsx';
import { approxNumber, formatToHighDenom, shortenAddress } from '../../libs/helpers.ts';
import { cn } from '../../libs/utils.ts';
import ScrollOverflowIndicator from '../ScrollOverflowIndicator.tsx';
import { ToolTip } from '../ToolTip.tsx';
import { USDAmountToolTip } from '../USDAmountToolTip.tsx';
import { PairAvatar } from '../avatar/PairAvatar.tsx';
import { BadgePill } from '../badge/BadgePill.tsx';
import IconCopyFilled from '../icons/IconCopyFilled.tsx';
import IconInfoCircle from '../icons/IconInfoCircle.tsx';
import { IconSettingsOutline } from '../icons/IconSettingsOutline.tsx';
import { Button } from '../ui/Button.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu.tsx';
import { ScrollAreaHorizontal } from '../ui/scroll-area.tsx';
import { AssetTip } from './AssetTip.tsx';
import { FollowMarket } from './FollowMarket.tsx';
import { InfoCard } from './InfoCard.tsx';
import { ManageMarketSheet } from './ManageMarketSheet.tsx';
import { PriceChange } from './PriceChange.tsx';

export function MarketRow({
	market,
	ownerMode,
	noFocus,
	className,
	onFollowUpdate,
}: {
	market: Market;
	className?: string;
	ownerMode?: boolean;
	noFocus?: boolean;
	onFollowUpdate?: () => void;
}) {
	const location = useLocation();
	const { address } = useConnectorContext();
	const [moreMenuOpen, setMoreMenuOpen] = useState(false);
	const [openEditMarketSheet, setOpenEditMarketSheet] = useState(false);
	const { simpleSuccess } = useToast();
	const navigate = useNavigate();

	return (
		<div
			className={cn(
				'border select-none bg-card-background border-card-border border-b-gray-600 transition-all duration-300 rounded-xl ',
				{
					'hover:border-chinese-green cursor-pointer': !noFocus,
				},
				className,
			)}
			onClick={(e: BaseSyntheticEvent) => {
				const canTrigger = e.target.getAttribute('data-click-trigger');
				if (canTrigger && canTrigger == '1' && !noFocus) {
					navigate(`/market/${market.address}`);
				}
			}}
		>
			<div className='flex flex-col md:flex-row h-auto'>
				<div className='md:w-[230px] h-full border-r select-none border-gray-800 shrink-0'>
					<div data-click-trigger='1' className='flex items-center gap-2 md:gap-3 px-3 md:px-3 md:py-4 pt-2 md:pt-4'>
						<PairAvatar
							base={market.base}
							quote={market.quote}
							baseSrc={market.baseLogo}
							quoteSrc={market.quoteLogo}
							baseTip={<AssetTip address={market.baseAddress} />}
							quoteTip={<AssetTip address={market.quoteAddress} />}
							dataClickTrigger={'1'}
						/>
						<div className='flex md:flex-col w-full justify-between md:justify-start'>
							<span className='flex' data-click-trigger='1'>
								<ToolTip tip={<AssetTip address={market.baseAddress} />}>{market.base}</ToolTip>
								<span className='text-gray-500 inline-block mx-1'>/</span>
								<ToolTip tip={<AssetTip address={market.quoteAddress} />}>{market.quote}</ToolTip>
							</span>
							<span className='flex items-center gap-1 text-[11px] font-light text-gray-400'>
								<ToolTip
									tip={
										<>
											<div className='flex gap-2 tracking-wide'>
												<span className='text-gray-400'>Type:</span>
												<span className='font-semibold text-chinese-green tracking-wider'>
													{market.instant ? 'Instant' : 'Interactive'}
												</span>
											</div>
										</>
									}
								>
									<span data-click-trigger='1'>
										ID: &nbsp;
										<span data-click-trigger='1' className='tracking-wide'>
											{shortenAddress(market.address)}
										</span>
									</span>
								</ToolTip>
								<CopyToClipboard
									text={market.address}
									onCopy={() => {
										simpleSuccess('Copied', { position: 'top-center' });
									}}
								>
									<IconCopyFilled
										width='13px'
										height='13px'
										className='opacity-70 hover:opacity-100 hover:text-chinese-green cursor-pointer transition-all duration-300 active:text-white active:scale-50'
									/>
								</CopyToClipboard>
							</span>
						</div>
					</div>
				</div>
				<div className='w-full overflow-hidden mr-[2px]' data-click-trigger='1'>
					<ScrollOverflowIndicator className='[&::before]:rounded-r-none md:[&::before]:rounded-tr-2xl'>
						<ScrollAreaHorizontal type='scroll' className='mx-2 md:mx-0'>
							<div data-click-trigger='1' className='py-[8px] flex gap-2 md:px-2'>
								<InfoCard
									title={`Price (${market.quote})`}
									width='w-auto'
									tip={`The price of 1 ${market.base} in ${market.quote}`}
									title2={<PriceChange priceChange={market.priceChange} />}
								>
									<span className='flex gap-1' data-click-trigger='1'>
										<span data-click-trigger='1'>
											{formatToHighDenom(market.lowestPrice, market.quoteDecimals, undefined, undefined, 99999999)}
										</span>
										<USDAmountToolTip v={parseFloat(market.lowestPriceUsd)} />
									</span>
								</InfoCard>

								<InfoCard title='Total Liquidity' title2='' tip={`The total amount of ${market.base} in the market`}>
									<span className='flex gap-1' data-click-trigger='1'>
										<span className='text-gray-200' data-click-trigger='1'>
											{formatToHighDenom(market.totalLiquidity, market.baseDecimals, undefined, undefined, 99999999)}
										</span>
										<USDAmountToolTip v={parseFloat(market.totalLiquidityUsd)} />
									</span>
								</InfoCard>
								<InfoCard
									title='24hrs Volume'
									title2=''
									tip={`The total volume of ${market.base} traded in the last 24hrs`}
								>
									<span className='text-gray-200' data-click-trigger='1'>
										${approxNumber(parseFloat(market.volume24h), 3)}
									</span>
								</InfoCard>
								<InfoCard title='Commission' title2='(%)' tip={`The commission reserved for the market owner`}>
									<span className='text-gray-200' data-click-trigger='1'>
										{market.commission / 100}
									</span>
								</InfoCard>
								<InfoCard
									title='Offer Only'
									title2=''
									width='w-[125px]'
									tip={`Only offers can be made on this market. No direct swap.`}
								>
									<span className='text-gray-200' data-click-trigger='1'>
										{market.offerOnly ? 'YES' : 'NO'}
									</span>
								</InfoCard>
								<InfoCard
									title='PUT Open'
									title2=''
									width='w-[125px]'
									tip={`Is the market open to the public for adding liquidity?`}
								>
									<span className='text-gray-200' data-click-trigger='1'>
										{market.permPut ? 'NO' : 'YES'}
									</span>
								</InfoCard>
								<InfoCard title='SWAP Open' title2='' tip={`Is the market open to the public for swapping liquidity?`}>
									<span className='text-gray-200' data-click-trigger='1'>
										{market.permSwap ? 'NO' : 'YES'}
									</span>
								</InfoCard>
							</div>
						</ScrollAreaHorizontal>
					</ScrollOverflowIndicator>
				</div>
			</div>
			<div className='flex justify-between border-t border-gray-800'>
				<div className='flex w-full px-3 pr-0 md:px-3 md:pr-0 overflow-hidden'>
					<div className='flex border-r border-gray-800 py-2 pr-2 tracking-wide items-center gap-1 text-sm text-gray-300 font-extralight'>
						{/*<span className="hidden sm:inline">Badges</span>*/}
						<ToolTip
							tip={
								<>
									Market-level badge is used to limit access to market functions or describe a preference. It is set by
									the market creator.
									<br />
									<br />
									A badge prefixed with:
									<br />
									<br />
									<b className='text-chinese-green'>LP</b>: requires the <b>Liquidity Provider</b> to have the badge
									before they can add liquidity to the market (ex: <i>LP: verified</i> means the liquidity provider must
									have the <i>verified</i> badge).
									<br />
									<br />
									<b className='text-chinese-green'>TK</b>: requires the <b>Taker</b> to have the badge before they can
									swap the liquidity in the market (ex: <i>TK: verified</i> means the taker must have the{' '}
									<i>verified</i> badge).
								</>
							}
						>
							<span className='text-gray-400 hover:text-chinese-green cursor-pointer transition-all duration-300'>
								<IconInfoCircle width='22px' />
							</span>
						</ToolTip>
					</div>
					<div className='flex-1 overflow-hidden items-center tracking-wider'>
						<ScrollOverflowIndicator className='[&::before]:rounded-none h-full flex items-center -mt-[1px]'>
							<ScrollAreaHorizontal type='scroll'>
								<div className='flex items-center gap-2 px-2'>
									{market.requiredPutBadges.map((badge) => (
										<BadgePill
											key={badge}
											name={badge.toUpperCase()}
											prefix='LP'
											tip={
												<>
													Liquidity providers must have "<b>{badge.toUpperCase()}</b>" badge to be allowed to add
													liquidity
												</>
											}
											className='bg-cyan-100 text-cyan-800 hover:bg-cyan-400'
											prefixClassName='text-cyan-700 bg-cyan-200'
										/>
									))}
									{market.requiredSwapBadges.map((badge) => (
										<BadgePill
											key={badge}
											name={badge.toUpperCase()}
											prefix='TK'
											tip={
												<>
													Takers must have "<b>{badge.toUpperCase()}</b>" badge to be allowed to swap this liquidity
												</>
											}
											className='bg-yellow-100 text-yellow-800 hover:bg-yellow-400'
											prefixClassName='text-yellow-700 bg-yellow-200'
										/>
									))}
									{market.requiredPutBadges.length == 0 && market.requiredSwapBadges.length == 0 && (
										<span className='text-xs text-gray-500 font-light' data-click-trigger='1'>
											No badge required
										</span>
									)}
								</div>
							</ScrollAreaHorizontal>
						</ScrollOverflowIndicator>
					</div>
				</div>
				<div className='flex items-center  border-gray-800' data-click-trigger='1'>
					{ownerMode && (
						<span className='hidden lg:inline border-l border-gray-800 shrink-0'>
							<Button
								variant='link'
								rounded='none'
								onClick={() => {
									setOpenEditMarketSheet(true);
								}}
								className='text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1'
							>
								<IconSettingsOutline width='15px' /> Manage
							</Button>
						</span>
					)}
					{address && !ownerMode && <FollowMarket marketAddress={market.address} onFollowUpdate={onFollowUpdate} />}
					{ownerMode && (
						<span className='lg:hidden border-l border-gray-800'>
							<DropdownMenu
								onOpenChange={(open) => {
									setMoreMenuOpen(open);
								}}
							>
								<DropdownMenuTrigger className='outline-0 ring-0'>
									<span
										className={cn(
											'outline-0 px-2 py-3 ring-0 flex gap-1  items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green',
											{ 'scale-x-105 text-chinese-green': moreMenuOpen },
										)}
									>
										<DotsVerticalIcon />
									</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent className='shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0'>
									<DropdownMenuItem
										className='flex gap-2'
										onClick={() => {
											setOpenEditMarketSheet(true);
										}}
									>
										<IconSettingsOutline width='15px' /> Manage Market
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</span>
					)}
					{!location.pathname.includes('/market/') && (
						<span className='flex border-l border-gray-800 pl-1'>
							<NavLink to={`/market/${market.address}`}>
								<Button
									title='Open Liquidity'
									variant='link'
									rounded='lg'
									scale='sm'
									className='text-sm px-1 text-gray-300 flex items-center gap-1'
								>
									<ChevronRight />
								</Button>
							</NavLink>
						</span>
					)}
				</div>
			</div>
			<div className='absolute'>
				<ManageMarketSheet
					market={market}
					active={openEditMarketSheet}
					onOpen={(open) => {
						setOpenEditMarketSheet(open);
					}}
				/>
			</div>
		</div>
	);
}
