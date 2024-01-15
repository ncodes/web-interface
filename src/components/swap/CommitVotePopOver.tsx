import { ReloadIcon } from '@radix-ui/react-icons';
import { XCircle } from 'lucide-react';
import { ReactNode, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Address, encodePacked, keccak256 } from 'viem';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import useForceUpdate from '../../hooks/useForceUpdate.ts';
import { useToast } from '../../hooks/useToast.tsx';
import { useVoteSecret } from '../../hooks/useVoteSecret.ts';
import { shortenAddress } from '../../libs/helpers.ts';
import Input2 from '../Input2.tsx';
import { ToolTip } from '../ToolTip.tsx';
import IconCopyFilled from '../icons/IconCopyFilled.tsx';
import IconEdit from '../icons/IconEdit.tsx';
import IconInfoCircle from '../icons/IconInfoCircle.tsx';
import { Button } from '../ui/Button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.tsx';

export default function CommitVotePopOver({
	orderId,
	disputeId,
	ticketIndex,
	modal,
	children,
	onActivate,
}: {
	orderId: number;
	disputeId: number;
	ticketIndex: number;
	modal?: boolean;
	children: ReactNode;
	onActivate?: (hash: string) => void;
}) {
	const { simpleSuccess } = useToast();
	const { address, getChainInfo } = useConnectorContext();
	const [openDlg, setOpenDlg] = useState(false);
	const { genSecret, getSecret, setSecret } = useVoteSecret();
	const [editSecret, setEditSecret] = useState(false);
	const [customSecret, setCustomSecret] = useState('');
	const { forceUpdate } = useForceUpdate();

	function getSecretValue() {
		if (customSecret) return customSecret;
		const net = getChainInfo().queryName;
		const secret = getSecret(net, orderId, disputeId, ticketIndex);
		if (!secret) return genSecret(net, orderId, disputeId, ticketIndex);
		return secret[0];
	}

	function genHash(vote: string) {
		return keccak256(encodePacked(['string', 'address'], [`${vote}${getSecretValue()}`, address as Address]));
	}

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
				<div className='p-3 text-[15px]'>
					What is your verdict? <br />
				</div>
				<div className='px-3 pb-3'>
					<span className='p-2 bg-gray-800 font-light text-gray-300 border border-gray-700 rounded-md flex gap-2'>
						<span>
							<IconInfoCircle className='text-yellow-500' />
						</span>
						<span>Decisions should be based on evidence. Tickets will be slashed for an unpopular verdict.</span>
					</span>
				</div>
				<div className='flex gap-2 p-3 pt-0 mt-0'>
					<Button
						size='sm'
						variant='default'
						rounded='lg'
						className='text-xs md:text-sm w-full'
						scale='sm'
						onClick={() => {
							setSecret(getChainInfo().queryName, orderId, disputeId, ticketIndex, getSecretValue(), '1');
							const hash = genHash('1');
							onActivate && onActivate(hash);
							setOpenDlg(false);
						}}
					>
						Release
					</Button>
					<Button
						size='sm'
						variant='destructive'
						rounded='lg'
						className='text-xs md:text-sm w-full'
						scale='sm'
						onClick={() => {
							setSecret(getChainInfo().queryName, orderId, disputeId, ticketIndex, getSecretValue(), '0');
							const hash = genHash('0');
							onActivate && onActivate(hash);
							setOpenDlg(false);
						}}
					>
						Cancel
					</Button>
				</div>
				<div className='pr-3 py-0 mt-0 border-t border-card-border flex items-center justify-between'>
					{!editSecret && (
						<div className='flex pl-3 items-center gap-1'>
							<span>
								<ToolTip tip="A secret is a random value used to 'encrypt' your vote until you are ready to reveal it in the reveal phase.">
									<IconInfoCircle width='15' />
								</ToolTip>
							</span>
							<span>Secret: </span>
							<span className='text-gray-400'>{shortenAddress(getSecretValue(), 3, 3)}</span>
							<span className='text-gray-400'>
								<CopyToClipboard
									text={getSecretValue()}
									onCopy={() => {
										simpleSuccess('Copied', { position: 'top-center' });
									}}
								>
									<IconCopyFilled
										width='12'
										className='active:scale-[1.5] hover:text-chinese-green transition-all duration-300 cursor-pointer'
									/>
								</CopyToClipboard>
							</span>
						</div>
					)}

					{editSecret && (
						<div className='pl-1'>
							<Input2
								className='!h-[20px] pl-2 rounded'
								autoFocus={true}
								containerClassName='p-0 h-8 !ring-0 !rounded-lg'
								value={customSecret}
								onChange={(e) => {
									setCustomSecret(e.target.value);
								}}
								afterInput={
									<Button
										variant='default'
										size='xs'
										rounded='sm'
										className='mr-1 h-[21px]'
										onClick={() => {
											setSecret(getChainInfo().queryName, orderId, disputeId, ticketIndex, customSecret, '');
											setEditSecret(!editSecret);
											setCustomSecret('');
										}}
									>
										Set
									</Button>
								}
							/>
						</div>
					)}

					<div className='flex gap-2'>
						{!editSecret && (
							<ToolTip tip='Edit Secret (use custom value)'>
								<Button
									variant='link'
									className='p-0'
									onClick={() => {
										setEditSecret(!editSecret);
									}}
								>
									<IconEdit width='15' />
								</Button>
							</ToolTip>
						)}
						{editSecret && (
							<ToolTip tip='Cancel Edit Secret'>
								<Button
									variant='link'
									className='p-0'
									onClick={() => {
										setEditSecret(!editSecret);
										setCustomSecret('');
									}}
								>
									<XCircle width='15' />
								</Button>
							</ToolTip>
						)}
						<ToolTip tip='Regenerate the secret'>
							<Button
								variant='link'
								className='p-0'
								onClick={() => {
									genSecret(getChainInfo().queryName, orderId, disputeId, ticketIndex);
									forceUpdate();
								}}
							>
								<ReloadIcon width='15' />
							</Button>
						</ToolTip>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
