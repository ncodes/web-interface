import { ListPlus } from 'lucide-react';
import { PointActivityStream } from './PointActivityStream';

export default function PointStream() {
	return (
		<div className='h-full flex flex-col overflow-hidden'>
			<div className='py-3 flex gap-2 text-gray-300'>
				<ListPlus className='30px' />
				<span>Point Stream</span>
			</div>
			<div className='flex-1 relative overflow-auto'>
				<PointActivityStream />
			</div>
		</div>
	);
}
