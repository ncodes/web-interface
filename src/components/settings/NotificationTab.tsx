import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import { useNotificationService } from '../../hooks/services/backend/useNotificationService.ts';
import useStore from '../../hooks/store/useStore.ts';
import { useSession } from '../../hooks/useSession.ts';
import { useToast } from '../../hooks/useToast.tsx';
import { logError } from '../../libs/helpers.ts';
import { Button } from '../ui/Button.tsx';
import { EmptySheetAlert } from '../ui/EmptySheetAlert.tsx';
import { TabsContent } from '../ui/Tabs.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion.tsx';
import { Label } from '../ui/label.tsx';
import { ScrollArea } from '../ui/scroll-area.tsx';
import { Switch } from '../ui/switch.tsx';

export function NotificationTab() {
	const user = useStore((state) => state.user);
	const { address } = useConnectorContext();
	const { hasAccessToken } = useSession();
	const setCurrentTab = useStore((state) => state.setCurrentTab);
	const [checked, setChecked] = useState<NotificationSettings>({
		disabled: false,
		disabledLiq: false,
		disabledOffer: false,
		disabledSwap: false,
	});
	const { updateSettings } = useNotificationService();
	const updateSettingsMut = useMutation({ mutationFn: updateSettings });
	const queryClient = useQueryClient();
	const { notifySuccess, notifyError } = useToast();
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		if (!user) return;
		setChecked({
			disabled: user.notificationSettings.disabled,
			disabledLiq: user.notificationSettings.disabledLiq,
			disabledOffer: user.notificationSettings.disabledOffer,
			disabledSwap: user.notificationSettings.disabledSwap,
		});
		setInitialized(true);
	}, [user]);

	useEffect(() => {
		if (!user || !didSettingsChange() || !initialized) return;

		const updateSettings = async () => {
			try {
				await updateSettingsMut.mutateAsync({ ...checked });
				notifySuccess('Notification settings updated', { position: 'bottom-right' });
				await queryClient.refetchQueries({ queryKey: ['getUser'] });
			} catch (error) {
				notifyError((error as Error).message);
				logError(error);
			}
		};

		void updateSettings();
	}, [checked]);

	function didSettingsChange() {
		if (!user) return false;
		return (
			user.notificationSettings.disabledLiq !== checked.disabledLiq ||
			user.notificationSettings.disabledOffer !== checked.disabledOffer ||
			user.notificationSettings.disabledSwap !== checked.disabledSwap ||
			user.notificationSettings.disabled !== checked.disabled
		);
	}

	return (
		<TabsContent value='notification' className={`w-full h-full px-0`}>
			{hasAccessToken(address) && (
				<ScrollArea type='scroll' viewportClassName='absolute xl:relative' className='h-full relative'>
					<Accordion type='multiple' defaultValue={['all-notification']}>
						<div className='px-5 mb-5'>
							<p className='font-normal text-lg text-gray-200'>Manage Notifications</p>
						</div>

						<div className='divide-y divide-gray-900'>
							{/* All Notification */}
							<AccordionItem value='all-notification'>
								<AccordionContent className='px-5 tracking-wide pb-3'>
									<p className='font-light text-gray-300'>
										Turn off all notifications. You will not receive any email alerts.
									</p>
									<span className='flex items-center mt-3'>
										<Switch
											id='all-notification'
											checked={checked.disabled}
											onCheckedChange={(value) => {
												setChecked({ ...checked, disabled: value });
											}}
										/>
										<Label htmlFor='all-notification' className='ml-3 text-gray-300'>
											{!checked.disabled ? 'OFF' : 'ON'}
										</Label>
									</span>
								</AccordionContent>
							</AccordionItem>
							{/* End All Notification */}

							{/* Swap Notification */}
							<AccordionItem value='swap-notification' className='pt-3'>
								<AccordionTrigger className='px-5 text-lg pb-2 tracking-wide'>Swap Notifications</AccordionTrigger>
								<AccordionContent className='px-5 tracking-wide pb-3'>
									<p className='font-light text-gray-300'>
										Receive email alerts for swap orders and disputes you are involved in.
									</p>
									<span className='flex items-center mt-3'>
										<Switch
											id='swap-notification'
											checked={checked.disabled ? false : !checked.disabledSwap}
											disabled={checked.disabled}
											onCheckedChange={(value) => {
												setChecked({ ...checked, disabledSwap: !value });
											}}
										/>
										<Label htmlFor='swap-notification' className='ml-3 text-gray-300'>
											{checked.disabledSwap ? 'OFF' : 'ON'}
										</Label>
									</span>
								</AccordionContent>
							</AccordionItem>
							{/* End Swap Notification */}

							{/* Liquidity Notification */}
							<AccordionItem className='pt-3' value='liq-notification'>
								<AccordionTrigger className='px-5 text-lg pb-2 tracking-wide'>Liquidity Notifications</AccordionTrigger>
								<AccordionContent className='px-5 tracking-wide pb-3'>
									<p className='font-light text-gray-300'>
										Receive email alerts when your liquidity receives a swap request.
									</p>
									<span className='flex items-center mt-3'>
										<Switch
											id='liq-notification'
											checked={checked.disabled ? false : !checked.disabledLiq}
											disabled={checked.disabled}
											onCheckedChange={(value) => {
												setChecked({ ...checked, disabledLiq: !value });
											}}
										/>
										<Label htmlFor='liq-notification' className='ml-3 text-gray-300'>
											{checked.disabledLiq ? 'OFF' : 'ON'}
										</Label>
									</span>
								</AccordionContent>
							</AccordionItem>
							{/* End Liquidity Notification */}

							{/* Offer Notification */}
							<AccordionItem className='pt-3' value='offer-notification'>
								<AccordionTrigger className='px-5 text-lg pb-2 tracking-wide'>Offer Notifications</AccordionTrigger>
								<AccordionContent className='px-5 tracking-wide pb-3'>
									<p className='font-light text-gray-300'>
										Receive email alerts when your receive an offer or your offer status changes.
									</p>
									<span className='flex items-center mt-3'>
										<Switch
											id='offer-notification'
											checked={checked.disabled ? false : !checked.disabledOffer}
											disabled={checked.disabled}
											onCheckedChange={(value) => {
												setChecked({ ...checked, disabledOffer: !value });
											}}
										/>
										<Label htmlFor='offer-notification' className='ml-3 text-gray-300'>
											{checked.disabledOffer ? 'OFF' : 'ON'}
										</Label>
									</span>
								</AccordionContent>
							</AccordionItem>
							{/* End Offer Notification */}
						</div>
					</Accordion>
				</ScrollArea>
			)}

			{!hasAccessToken(address) && (
				<div className='flex items-center justify-center h-full'>
					<EmptySheetAlert
						label={
							<div className='flex items-center gap-2 text-sm text-gray-300'>
								<AlertTriangle className='text-yellow-500' width='20' />
								<span>Log in to update settings</span>
							</div>
						}
					>
						<Button
							variant='default'
							size='full'
							className='w-full mt-2'
							onClick={() => {
								setCurrentTab('account');
							}}
						>
							LOGIN
						</Button>
					</EmptySheetAlert>
				</div>
			)}
		</TabsContent>
	);
}
