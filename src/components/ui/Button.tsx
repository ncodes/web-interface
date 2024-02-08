import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../libs/utils.ts';

const buttonVariants = cva(
	'select-none inline-flex items-center justify-center text-sm font-medium ' +
		'transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ' +
		'disabled:pointer-events-none disabled:opacity-50 tracking-wider',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
				destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				outline:
					'border border-gray-700 bg-background shadow-sm hover:bg-chinese-green hover:text-accent-foreground hover:border-chinese-green',
				secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
				ghost: 'hover:bg-chinese-green hover:text-accent-foreground font-light',
				link: 'text-primary hover:opacity-90',
			},
			rounded: {
				default: 'rounded-full',
				sm: 'rounded-sm',
				md: 'rounded-md',
				lg: 'rounded-lg',
				xl: 'rounded-xl',
				none: 'rounded-none',
			},
			size: {
				default: 'h-10 px-4 py-2',
				xs: 'h-5 px-2 text-[12px]',
				sm: 'h-8 px-3 text-[14px]',
				lg: 'h-10 px-8',
				full: 'w-full h-10 px-8 text-lg font-medium tracking-wide',
				icon: 'h-9 w-9',
			},
			scale: {
				default: '',
				sm: 'transition-all duration-300 hover:scale-x-[1.02] xsp',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
			rounded: 'default',
			scale: 'default',
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, scale, variant, size, rounded, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return <Comp className={cn(buttonVariants({ variant, size, className, rounded, scale }))} ref={ref} {...props} />;
	},
);
Button.displayName = 'Button';

export { Button, buttonVariants };
