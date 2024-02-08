import { ReactNode, useState } from 'react';
import IconInfoCircle from '../icons/IconInfoCircle.tsx';
import { Button } from '../ui/Button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.tsx';

export default function AppealPopOver({
	modal,
	children,
	onActivate,
	isReleaser,
}: {
	modal?: boolean;
	isReleaser: boolean;
	children: ReactNode;
	onActivate?: (wantRelease: boolean) => void;
}) {
	const [openDlg, setOpenDlg] = useState(false);

	return (
		<Popover
			modal={modal}
			open={openDlg}
			onOpenChange={(open) => {
				setOpenDlg(open);
			}}
		>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className='w-[320px] tracking-wider p-0 text-xs rounded-xl bg-card-background border-card-border drop-shadow shadow-xl text-gray-200'>
				<div className='p-3 text-[13px]'>
					You are about to start a dispute. What would you like the mediators to do?
				</div>
				<div className='px-3 pb-3'>
					<span className='p-2 bg-gray-800 font-light text-gray-300 border border-gray-700 rounded-md flex gap-2'>
						<span>
							<IconInfoCircle className='text-yellow-500' />
						</span>
						<span>
							A dispute prolongs the completion of orders and freeze the liquidity until it is resolved. Before
							initiating a dispute, it is advised to try and settle issues with the other party through the chat system.
						</span>
					</span>
				</div>
				<div className='flex gap-2 p-3 pt-0'>
					{!isReleaser && (
						<Button
							size='sm'
							variant='default'
							rounded='lg'
							className='text-xs md:text-sm w-full'
							scale='sm'
							onClick={() => {
								onActivate && onActivate(true);
								setOpenDlg(false);
							}}
						>
							Release
						</Button>
					)}
					<Button
						size='sm'
						variant='destructive'
						rounded='lg'
						className='text-xs md:text-sm w-full'
						scale='sm'
						onClick={() => {
							onActivate && onActivate(false);
							setOpenDlg(false);
						}}
					>
						Cancel
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
