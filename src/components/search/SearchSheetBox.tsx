import { Cross2Icon } from '@radix-ui/react-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useConnectorContext } from '../../hooks/connectors/useConnectorContext.tsx';
import { useMarketService } from '../../hooks/services/backend/useMarketService.ts';
import useStore from '../../hooks/store/useStore.ts';
import { useSheetInfo } from '../../hooks/useSheetInfo.ts';
import { cn } from '../../libs/utils.ts';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet.tsx';
import { SearchContent } from './SearchContent.tsx';
import { SearchInput } from './SearchInput.tsx';

export function SearchSheetBox(props: { children?: React.ReactNode }) {
	const [sheetHeight, sheetSide, styles] = useSheetInfo('h-[80svh]');
	const [focus, setFocus] = useState(false);
	const [query, setQuery] = useState('');
	const openState = useStore((state) => state.openState);
	const toggleOpenState = useStore((s) => s.toggleOpenState);
	const { listMarkets } = useMarketService();
	const { getChainInfo } = useConnectorContext();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!query) return;
		queryClient.refetchQueries({ queryKey: ['searchMarkets'] });
	}, [query]);

	const queryResult = useQuery({
		queryKey: [
			'searchMarkets',
			{
				network: getChainInfo().queryName,
				marketFilter: { query },
				limit: 5,
				offset: 0,
			},
		],
		queryFn: listMarkets,
		enabled: !!query,
	});

	return (
		<Sheet
			open={openState.searchSheet}
			modal={true}
			onOpenChange={() => {
				toggleOpenState && toggleOpenState('searchSheet');
			}}
		>
			<SheetTrigger>{props.children}</SheetTrigger>
			<SheetContent
				className={cn(styles, 'flex flex-col lg:hidden w-full border-l-0 border-r-0 pt-0 py-0 px-0 gap-0', sheetHeight)}
				side={sheetSide}
			>
				<SheetHeader className='flex pl-2 pt-2 pr-[50px] border-b border-gray-800 pb-2'>
					<div className='text-white'>
						<SheetTitle className='flex text-gray-100'>
							<SearchInput
								onFocus={() => setFocus(true)}
								onBlur={() => setFocus(false)}
								focus={focus}
								autoFocus={true}
								className='rounded-xl'
								onValue={(value) => {
									setQuery(value);
								}}
							/>
						</SheetTitle>
					</div>
				</SheetHeader>

				<div className='overflow-auto h-full flex-1'>
					<SearchContent
						onQueryChange={(value) => setQuery(value)}
						queryResult={queryResult.data?.markets}
						queryLoading={(queryResult.isLoading && queryResult.fetchStatus != 'idle') || queryResult.isRefetching}
					/>

					<div
						className='absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'
						onClick={() => {
							toggleOpenState && toggleOpenState('searchSheet');
						}}
					>
						<Cross2Icon className='h-6 w-6 transition-all duration-300 hover:text-chinese-green hover:scale-110 cursor-pointer' />
						<span className='sr-only'>Close</span>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
