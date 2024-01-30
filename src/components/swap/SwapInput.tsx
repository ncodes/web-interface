import { ReactNode, useState } from 'react';
import { cn } from '../../libs/utils.ts';
import { Avatar } from '../avatar/Avatar.tsx';
import { Input } from '../ui/Input.tsx';

export function SwapInput({
	avatar,
	avatarFallback,
	value,
	type,
	setValue,
	onFocused,
	className,
	disabled,
	step,
	afterInput,
	autoFocus,
}: {
	avatar: string;
	avatarFallback: string;
	value?: string;
	type?: string;
	setValue?: (value: string) => void;
	onFocused?: (focused: boolean) => void;
	className?: string;
	disabled?: boolean;
	step?: string;
	afterInput?: ReactNode;
	autoFocus?: boolean;
}) {
	const [focus, setFocus] = useState(false);
	return (
		<div
			className={cn(
				'rounded-full h-12 bg-card-background border border-gray-700 hover:border-chinese-green flex pl-[5px] pt-[3px] transition-all duration-300',
				{
					'hover:border-gray-700': disabled,
					'border-chinese-green scale-[1.005] ring-2 ring-chinese-green': focus && !disabled,
				},
				className,
			)}
		>
			<Avatar src={avatar} className='w-[41px]' fallbackClassName='w-[41px]' fallback={avatarFallback} />
			<Input
				type={type ?? 'number'}
				variant='ghost'
				placeholder='0.0'
				step={step ?? 'any'}
				autoFocus={autoFocus}
				value={value}
				disabled={disabled}
				readOnly={!setValue}
				className='ml-1 mt-[3px] mr-2 rounded-full pl-2 text-xl'
				onFocus={() => {
					setFocus(true);
					onFocused && onFocused(true);
				}}
				onBlur={() => {
					setFocus(false);
					onFocused && onFocused(false);
				}}
				onChange={(e) => {
					setValue && setValue(e.target.value);
				}}
			/>
			{afterInput}
		</div>
	);
}
