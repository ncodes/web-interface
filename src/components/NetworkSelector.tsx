import { ChainInfo, getChain, getChainsID } from '@jointlabs/chains-info';
import { ChevronDown } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { cn } from '../libs/utils.ts';
import {
	DropdownArrow,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu.tsx';

import { hardhat } from 'viem/chains';
import { useConnectorContext } from '../hooks/connectors/useConnectorContext.tsx';
import { isProd } from '../libs/helpers.ts';

function DropdownMenuItemCustom({
	children,
	className,
	onSelect,
}: {
	children: ReactNode;
	className?: string;
	onSelect: (event: Event) => void;
}) {
	return (
		<DropdownMenuItem
			onSelect={onSelect}
			className={cn(
				'flex items-center gap-2 font-normal text-[13px] px-2 py-2 transition-all duration-300 focus:scale-x-105 focus:bg-chinese-green cursor-pointer rounded-xl',
				className,
			)}
		>
			{children}
		</DropdownMenuItem>
	);
}

export function NetworkSelector() {
	const [open, setOpen] = useState(false);
	const { switchNetwork, chainId, defaultNetwork } = useConnectorContext();
	const [curChain, setCurChain] = useState<ChainInfo | undefined>(getChain(defaultNetwork));
	const [testnetChainsID, setTestnetChainsID] = useState<number[]>([]);
	const [mainChainsID, setMainChainsID] = useState<number[]>([]);

	useEffect(() => {
		if (!chainId) return;
		setCurChain(getChain(chainId));
	}, [chainId]);

	useEffect(() => {
		const chains = getChainsID(true, false, curChain?.chainId ? [curChain?.chainId] : []);

		if (isProd()) {
			const index = chains.indexOf(hardhat.id);
			if (index > -1) {
				chains.splice(index, 1);
			}
		}

		setTestnetChainsID(chains);
	}, [curChain]);

	useEffect(() => {
		const chains = getChainsID(false, true, curChain?.chainId ? [curChain?.chainId] : []);
		setMainChainsID(chains);
	}, [curChain]);

	const changeNetwork = useCallback(
		async (chainId: number) => {
			await switchNetwork(chainId);
		},
		[switchNetwork],
	);

	return (
		<div>
			<DropdownMenu onOpenChange={setOpen}>
				<DropdownMenuTrigger disabled={!mainChainsID.length && !testnetChainsID.length} className='outline-0 ring-0'>
					<div
						className={cn(
							'md:w-[152px] flex gap-2 justify-between border items-center transition-all duration-500 hover:cursor-pointer hover:bg-gray-800 hover:scale-x-105 hover:border-chinese-green p-2 px-2 pr-1 rounded-full border-gray-600',
							{
								'scale-105 border-chinese-green bg-gray-800': open,
							},
						)}
					>
						{curChain?.logoPath({
							width: 25,
							height: 25,
						})}
						<span className='hidden md:inline'>{curChain?.altDisplayName || curChain?.displayName}</span>

						<span
							className={cn('relative -left-1 top-[0px] transition-all duration-300', {
								'rotate-180': open,
							})}
						>
							<ChevronDown />
						</span>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-[170px] tracking-wide shadow-xl drop-shadow-2xl rounded-2xl bg-modal-background border-gray-600 text-gray-200 py-1 px-2'>
					{mainChainsID.map((chainId) => (
						<DropdownMenuItemCustom
							key={chainId}
							onSelect={async () => {
								await changeNetwork(chainId);
							}}
						>
							{getChain(chainId)?.logoPath({
								width: 25,
								height: 25,
							})}
							{getChain(chainId)?.displayName}
						</DropdownMenuItemCustom>
					))}
					{testnetChainsID.length > 0 && (
						<>
							<DropdownMenuSeparator className='bg-gray-800' />
							<DropdownMenuLabel className='font-extralight tracking-wider text-gray-300 text-xs'>
								Testnets
							</DropdownMenuLabel>
							{testnetChainsID.map((chainId) => (
								<DropdownMenuItemCustom
									key={chainId}
									onSelect={async () => {
										await changeNetwork(chainId);
									}}
								>
									{getChain(chainId)?.logoPath({
										width: 25,
										height: 25,
									})}
									{getChain(chainId)?.displayName}
								</DropdownMenuItemCustom>
							))}
						</>
					)}
					<DropdownArrow className='fill-white' />
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
