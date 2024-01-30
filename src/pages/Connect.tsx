import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertCircle, AlertOctagon, PlugZapIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { Button } from '../components/ui/Button';
import { useConnectorContext } from '../hooks/connectors/useConnectorContext';
import { useAuthService } from '../hooks/services/backend/useAuthService';
import { cn } from '../libs/helpers';

export default function ConnectPage() {
	const { address, disconnect } = useConnectorContext();
	const loc = useLocation();
	const navigate = useNavigate();
	const { isAllowedPrivateTestAddress, verifyDiscord } = useAuthService();
	const [searchParams] = useSearchParams();
	const [authCode, setAuthCode] = useState<string | undefined>();
	const [err, setErr] = useState<string>('');

	const isAllowedQuery = useQuery({
		queryKey: ['isAllowedAddress', { address }],
		queryFn: isAllowedPrivateTestAddress,
		enabled: !!address,
	});

	const mutateVerifyDiscord = useMutation({
		mutationFn: verifyDiscord,
	});

	useEffect(() => {
		console.log('HELLO FREN');
	}, []);

	useEffect(() => {
		if (address && isAllowedQuery.data == 1) {
			const searchParams = new URLSearchParams(loc.search);
			if (searchParams.get('code') || searchParams.get('error')) navigate('/');
			else navigate(-1);
		}
	}, [address, isAllowedQuery.data, searchParams]);

	useEffect(() => {
		const code = searchParams.get('code');
		if (!code) return;
		searchParams.delete('code');
		setAuthCode(code || undefined);
	}, [searchParams, address, mutateVerifyDiscord.status]);

	useEffect(() => {
		if (!authCode || !address) return;
		const doVerify = async () => {
			try {
				await mutateVerifyDiscord.mutateAsync({
					code: authCode,
					address,
					refCode: localStorage.getItem('referrer') as string,
				});
				await isAllowedQuery.refetch();
			} catch (error) {
				setErr((error as { message: string }).message);
				setAuthCode(undefined);
			}
		};

		void doVerify();
	}, [authCode]);

	return (
		<div className='fixed w-full h-screen bg-black z-50 left-0 flex flex-col'>
			<Helmet>
				<title>Connect Wallet - Joint Exchange</title>
				<meta
					name='description'
					content={
						'Joint is an innovative, simple to use DeFi protocol for peer-to-peer trading. ' +
						'Carry out swaps for crypto to crypto, crypto to fiat, NFT to fiat, and vice versa.'
					}
				/>
				<meta name='theme-color' content='#030507' />
				<body className='bg-background' />
			</Helmet>
			<div className='absolute w-full h-full bg-[url(/images/bg/connect-bg.png)] bg-cover'></div>
			<div className='absolute w-full h-full bg-gradient-to-r from-black to-black/70'> </div>
			<div className='absolute w-full h-full'>
				<div className='flex justify-center items-center text-gray-200 pt-10'>
					<img src='images/logo-w.svg' />
				</div>
				<div className='flex-1 flex flex-col items-center mx-auto'>
					<span className='mt-[150px] xl:mt-[300px] flex flex-col gap-3'>
						{isAllowedQuery.data != 1 && (
							<>
								{isAllowedQuery.data == -1 && (
									<span className='text-gray-300 flex flex-col gap-2 items-center'>
										<span className='flex gap-2'>
											<span>
												<AlertOctagon width='20' className='text-red-400' />
											</span>
											<span>You are not on the allowlist</span>
										</span>
										<span>
											<Button variant='outline' onClick={disconnect}>
												Disconnect
											</Button>
										</span>
									</span>
								)}

								{err && (
									<Alert
										className='w-[250px] text-sm border-red-400 text-red-400'
										icon={<AlertCircle className='text-red-400' />}
									>
										{err}
									</Alert>
								)}

								{isAllowedQuery.data != -1 && (
									<>
										<ConnectWalletButton className={cn({ 'opacity-50': !!address })}>
											<Button className='w-[250px] flex gap-2 hover:scale-105 duration-500'>
												<PlugZapIcon className='w-[20px]' /> Connect your wallet
											</Button>
										</ConnectWalletButton>

										<Link
											className={(authCode && err == '') || address == undefined ? 'pointer-events-none' : ''}
											to={import.meta.env.VITE_DISCORD_OAUTH_URL}
										>
											<Button
												disabled={address == undefined || (authCode != undefined && err == '')}
												className='w-[250px] flex gap-2 hover:scale-105 duration-500 bg-[#5864f2] hover:bg-[#5864f2]/90 text-gray-100'
											>
												<DiscordLogoIcon className='w-[20px]' />{' '}
												{authCode && err == '' ? 'Connected' : 'Connect with Discord'}
											</Button>
										</Link>
									</>
								)}
							</>
						)}

						{isAllowedQuery.data == 1 && (
							<Link to='/' className='w-full'>
								<Button variant='link' size='full'>
									Go to Home
								</Button>
							</Link>
						)}
					</span>
				</div>
			</div>
		</div>
	);
}
