import { AwardIcon, LinkIcon, Users } from 'lucide-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import useStore from '../../hooks/store/useStore';
import { useToast } from '../../hooks/useToast';
import EmojiAvatar from '../avatar/EmojiAvatar';
import { AvatarSize } from '../avatar/useAvatar';
import IconCopyFilled from '../icons/IconCopyFilled';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function ReferralInfo({ referralInfo }: { referralInfo: GetReferralInfo }) {
	const { simpleSuccess } = useToast();
	const { toggleOpenState } = useStore((state) => ({
		user: state.user,
		toggleOpenState: state.toggleOpenState,
	}));

	return (
		<div className='grid gap-4 md:grid-cols-3'>
			<Card className='bg-card-background tracking-wider border-card-border'>
				<CardHeader className='flex p-3 pb-0 px-4 flex-row gap-2 items-center space-y-0'>
					<LinkIcon className='w-4 h-4 text-gray-300' />
					<CardTitle className='text-sm font-medium text-gray-100 tracking-wider'>Referral Link</CardTitle>
				</CardHeader>
				<CardContent className='flex text-sm items-center gap-1 text-orange-400 p-2 px-4 font-light'>
					{!referralInfo.refCode && (
						<span className='flex w-full flex-col gap-2 text-gray-300 font-extralight'>
							<span className='text-xs'>Link your wallet to create a referral link!</span>
							<Button
								size='sm'
								rounded='md'
								className='w-full'
								onClick={() => {
									toggleOpenState && toggleOpenState('settingsSheet', 'account');
								}}
							>
								Link
							</Button>
						</span>
					)}

					{referralInfo.refCode && (
						<span className='flex items-center gap-1'>
							https://jntl.ink/{referralInfo?.refCode}
							<CopyToClipboard
								text={`https://jntl.ink/${referralInfo?.refCode}`}
								onCopy={() => {
									simpleSuccess('Copied', { position: 'top-center' });
								}}
							>
								<IconCopyFilled className='w-4 h-4 text-gray-500 hover:text-gray-400 cursor-pointer active:text-orange-500  active:scale-110 transition-all duration-300' />
							</CopyToClipboard>
						</span>
					)}
				</CardContent>
			</Card>

			<Card className='bg-card-background tracking-wider border-card-border'>
				<CardHeader className='flex p-3 pb-0 px-4 flex-row gap-2 items-center space-y-0'>
					<Users className='w-4 h-4 text-gray-300' />
					<CardTitle className='text-sm font-medium text-gray-100 tracking-wider'>No. of Referred</CardTitle>
				</CardHeader>
				<CardContent className='flex text-sm items-center gap-2 text-gray-400 p-2 px-4 pl-2 font-light'>
					<span className='flex gap-1'>
						{referralInfo?.referred.map((ref) => (
							<span key={ref}>{<EmojiAvatar size={AvatarSize.Small} randomStr={ref} />}</span>
						))}
					</span>
					<span>{referralInfo?.numReferred}</span>
				</CardContent>
			</Card>

			<Card className='bg-card-background tracking-wider border-card-border'>
				<CardHeader className='flex p-3 pb-0 px-4 flex-row gap-2 items-center space-y-0'>
					<AwardIcon className='w-4 h-4 text-gray-300' />
					<CardTitle className='text-sm font-medium text-gray-100 tracking-wider'>Total Points</CardTitle>
				</CardHeader>
				<CardContent className='flex text-sm items-center gap-1 text-gray-400 p-2 px-4 pl-5 font-light'>
					{referralInfo?.totalPoints}
				</CardContent>
			</Card>
		</div>
	);
}
