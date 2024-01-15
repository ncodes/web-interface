import { Globe } from 'lucide-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { NavLink } from 'react-router-dom';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import { useToast } from '../../hooks/useToast.tsx';
import { shortenAddress } from '../../libs/helpers.ts';
import IconCopyFilled from '../icons/IconCopyFilled.tsx';

export function AssetTip(props: { address: string }) {
	const { getChainInfo } = useConnectorContext();
	const { simpleSuccess } = useToast();

	return (
		<span className='flex gap-3 items-center'>
			<span>{shortenAddress(props.address)}</span>
			<div className='flex gap-1 items-center'>
				<CopyToClipboard
					text={props.address}
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
				<NavLink target='_blank' to={`${getChainInfo().blockExplorer}/address/${props.address}`}>
					<Globe
						width='13px'
						className='opacity-70 hover:opacity-100 hover:text-chinese-green cursor-pointer transition-all duration-300 active:text-white active:scale-50'
					/>
				</NavLink>
			</div>
		</span>
	);
}
