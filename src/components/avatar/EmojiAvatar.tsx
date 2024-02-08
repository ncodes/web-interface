import forge from 'node-forge';
import { XORShift } from 'random-seedable';
import { cn } from '../../libs/utils.ts';
import { AvatarSize } from './useAvatar';

interface AvatarParams {
	size: AvatarSize;
	randomStr: string;
}

export const RandomBgColors = ['#258f59', '#48518f', '#82a440', '#D92828', '#a95cb5', '#3e37c3', '#093dc3', '#8e925e'];

export default function EmojiAvatar(props: AvatarParams) {
	const emojis = [
		'😀',
		'😃',
		'😄',
		'😁',
		'😆',
		'😅',
		'🤣',
		'😂',
		'🙂',
		'🙃',
		'🫠',
		'😉',
		'😊',
		'😇',
		'🥰',
		'😍',
		'🤩',
		'😘',
		'😗',
		'☺️',
		'😚',
		'😙',
		'🥲',
		'😋',
		'😛',
		'😜',
		'🤪',
		'😝',
		'🤑',
		'🤗',
		'🤭',
		'🫢',
		'🫣',
		'🤫',
		'🤔',
		'🤐',
		'🤨',
		'😐',
		'😑',
		'😶',
		'😏',
		'😒',
		'🙄',
		'🥴',
		'😵',
		'😵‍💫',
		'🤯',
		'🤠',
		'🥳',
		'🥸',
		'😎',
		'🤓',
		'😮',
		'🦄',
		'🐴',
	];

	const cls = 'flex justify-center items-center rounded-full pt-[2px]';
	const random = new XORShift(
		forge.md.sha1
			.create()
			.update(props?.randomStr?.toLowerCase() || '')
			.digest()
			.getInt32(),
	);
	const sizes = {
		0: ['w-[20px] h-[20px]', 'text-[13px]'],
		1: ['w-[30px] h-[30px]', 'text-[20px]'],
		2: ['w-[35px] h-[35px]', 'text-[25px]'],
		3: ['w-[40px] h-[40px]', 'text-[30px]'],
	};

	return (
		<div className={cn(cls, sizes[props.size][0])} style={{ background: random.choice(RandomBgColors) }}>
			<span className={sizes[props.size][1]}>{random.choice(emojis)}</span>
		</div>
	);
}
