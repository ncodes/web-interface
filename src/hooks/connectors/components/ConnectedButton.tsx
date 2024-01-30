import { useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import EmojiAvatar from '../../../components/avatar/EmojiAvatar.tsx';
import { AvatarSize } from '../../../components/avatar/useAvatar';
import { IconSettingsOutline } from '../../../components/icons/IconSettingsOutline.tsx';
import { SettingsSheet } from '../../../components/settings/SettingsSheet.tsx';
import { cn, shortenAddress, shortenAddress2 } from '../../../libs/helpers.ts';
import useStore from '../../store/useStore.ts';

interface ConnectedProps {
	openWalletModal?: () => void;
}

export const ConnectedButton = (props: ConnectedProps) => {
	const { address } = useAccount();
	const toggleOpenState = useStore((state) => state.toggleOpenState);
	const loc = useLocation();
	const isConnectPage = loc.pathname.includes('/connect');

	return (
		<div>
			<div
				className='flex [&>*]:cursor-pointer justify-between items-center h-[37px]  bg-chinese-green rounded-full hover:shadow-[0px_11px_24px_-6px_rgba(131,164,34,1)] gap-1 pr-1'
				onClick={() => {
					toggleOpenState && toggleOpenState('settingsSheet');
				}}
			>
				{!isConnectPage && (
					<>
						<p
							className={cn('hidden lg:flex py-[6px] px-[8px] ml-[4px] text-[#001029] tracking-[0.19px]  rounded-full')}
						>
							<IconSettingsOutline width='17' />
						</p>
						<p className='hidden address lg:inline-block font-normal text-[14px] tracking-[0.22px] text-black'>
							<span className='hidden lg:inline-block'>{shortenAddress(address as string)}</span>
							<span className='lg:hidden'>{shortenAddress2(address as string)}</span>
						</p>
					</>
				)}

				{/* REMOVE WHEN CONNECT PAGE IS REMOVED */}
				{isConnectPage && (
					<>
						<p className={cn('lg:flex py-[6px] px-[8px] ml-[4px] text-[#001029] tracking-[0.19px]  rounded-full')}>
							<IconSettingsOutline width='17' />
						</p>
						<p className='address lg:inline-block font-normal text-[14px] tracking-[0.22px] text-black'>
							<span className='inline-block'>{shortenAddress(address as string)}</span>
							<span className='hidden'>{shortenAddress2(address as string)}</span>
						</p>
					</>
				)}

				<div className='pl-1 md:pl-2'>
					<EmojiAvatar size={AvatarSize.Small} randomStr={address as string} />
				</div>
			</div>
			<div className='absolute'>
				<SettingsSheet openWalletManager={props.openWalletModal} />
			</div>
		</div>
	);
};
