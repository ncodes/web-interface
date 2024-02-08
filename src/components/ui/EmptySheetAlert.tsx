import { ReactNode } from 'react';

export function EmptySheetAlert({ label, children }: { label: ReactNode; children: ReactNode }) {
	return (
		<div className='rounded-3xl border border-gray-800 shadow-chinese-green/10 shadow-lg flex flex-col p-3 items-center justify-center'>
			<span className='p-2 font-light tracking-wider'>{label}</span>
			{children}
		</div>
	);
}
