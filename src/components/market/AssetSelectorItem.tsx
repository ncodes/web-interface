import { ReactNode, useState } from 'react';
import { cn } from '../../libs/utils.ts';
import { ToolTip } from '../ToolTip.tsx';
import { Avatar } from '../avatar/Avatar.tsx';
import IconInfoCircle from '../icons/IconInfoCircle.tsx';

export function AssetSelectorItem({
	asset,
	tip,
	onClick,
}: {
	asset: AssetInfo;
	tip?: ReactNode;
	onClick?: (asset: AssetInfo) => void;
}) {
	const [hover, setHover] = useState(false);

	return (
		<div
			onClick={() => {
				onClick && onClick(asset);
			}}
			onMouseEnter={() => {
				setHover(true);
			}}
			onMouseLeave={() => {
				setHover(false);
			}}
			className={cn(
				'asset-item flex p-2 mx-2 gap-3 transition-all duration-150 border-gray-900 items-center cursor-pointer',
				{ 'bg-chinese-green rounded-xl scale-x-[1.03]': hover },
			)}
		>
			<div className='shrink-0'>
				<Avatar
					src={asset.logoURI}
					fallback={asset.symbol}
					className='w-[40px]'
					fallbackClassName='w-[40px] !bg-gray-700 text-xs'
				/>
			</div>
			<div className='flex flex-col select-none'>
				<span className={cn('text-[14px] font-medium tracking-wide', { 'text-gray-800': hover })}>
					{asset.name} ({asset.symbol})
				</span>
				<span
					className={cn('subtitle text-xs text-gray-600', {
						'text-gray-600': hover,
					})}
				>
					{asset.type}
				</span>
			</div>
			<div
				className={cn('flex-1 shrink-0 flex justify-end text-gray-500 cursor-pointer transition-all duration-300', {
					'text-gray-800': hover,
				})}
			>
				<div className='relative w-[22px] h-[20px]'>
					<div className='absolute z-10'>
						<ToolTip tip={tip} side='left' className2='w-[200px]'>
							<IconInfoCircle />
						</ToolTip>
					</div>
				</div>
			</div>
		</div>
	);
}
