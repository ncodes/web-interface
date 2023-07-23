import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

const inputVariants = cva(
  "flex h-8 w-full border border-gray-600 bg-background duration-300 text-sm shadow-sm transition-all  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-chinese-green",
  {
    variants: {
      variant: {
        default: "",
        primary: "pl-2 border-blue-300/40",
      },
      sz: {
        default: "",
      },
      w: {
        default: "w-full",
        sm: "!w-1/4",
        lg: "!w-2/4",
        xl: "!w-2/4",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      sz: "default",
      w: "default",
      rounded: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, rounded, w, sz, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "input";
    return (
      <Comp
        className={inputVariants({ variant, w, className, rounded, sz })}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
