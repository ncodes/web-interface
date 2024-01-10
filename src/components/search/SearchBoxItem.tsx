import { NavLink } from 'react-router-dom';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import useSearchHistory from '../../hooks/useSearchHistory.ts';
import { approxNumber, formatToMoney } from '../../libs/helpers.ts';
import { PairAvatar } from '../avatar/PairAvatar.tsx';
import { PriceChange } from '../market/PriceChange.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';

export function SearchBoxItem({ market }: { market: Market }) {
	const { getChainInfo } = useConnectorContext();
	const { add: addHistory } = useSearchHistory(getChainInfo().queryName);

	return (
		<NavLink
			to={`/market/${market.address}`}
			onClick={() => {
				addHistory({
					type: 'market',
					marketAddress: market.address,
				});
			}}
		>
			<div className='flex py-2 px-3 gap-2 items-center hover:bg-black/70 cursor-pointer'>
				<PairAvatar
					base={market.base}
					quote={market.quote}
					baseSrc={market.baseLogo}
					quoteSrc={market.quoteLogo}
					className2='!-ml-2'
				/>
				<div>
					<div className='text-sm'>
						{market.base} - {market.quote}
					</div>
					<div className='text-xs font-extralight tracking-wider text-gray-400 '>Market</div>
				</div>
				<div className='flex-1 flex gap-2 justify-end'>
					<Card className='w-[130px] text-right shrink-0 border border-card-border/60 border-b-gray-700 bg-card-background shadow-none'>
						<CardHeader className='px-3 py-2 pb-0'>
							<CardTitle className='text-xs tracking-wide font-light text-gray-400 flex justify-end gap-2'>
								<span>Price</span>
								<span className='text-green-400'>
									<PriceChange priceChange={market.priceChange || 0} />
								</span>
							</CardTitle>
						</CardHeader>
						<CardContent className='px-3 py-0 pb-2 tracking-wide text-chinese-green'>
							${formatToMoney(market.lowestPriceUsd || '0')}
						</CardContent>
					</Card>
					<Card className='hidden md:inline w-[83px] shrink-0 text-right border border-card-border/60 border-b-gray-700 bg-card-background shadow-none'>
						<CardHeader className='px-3 py-2 pb-0'>
							<CardTitle className='text-xs tracking-wider font-light text-gray-400'>
								<span>24hr Vol.</span>
							</CardTitle>
						</CardHeader>
						<CardContent className='text-white px-3 py-0 pb-2 tracking-wide'>
							${approxNumber(market.volume24h || '0')}
						</CardContent>
					</Card>
				</div>
			</div>
		</NavLink>
	);
}
