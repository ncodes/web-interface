import { cn } from "../libs/utils.ts";
import { ReactNode } from "react";

export function InputWrapper({
  className,
  children,
  focused,
  afterInput,
  focusedClassName,
}: {
  className?: string;
  children: ReactNode;
  afterInput?: ReactNode;
  focused?: boolean;
  focusedClassName?: string;
}) {
  return (
    <div
      className={cn(
        className,
        "flex-1 bg-card-background border rounded-2xl transition-all duration-500",
        {
          "border-card-border": !focused,
          "border-chinese-green ring-2 ring-chinese-green": focused,
          [`${focusedClassName}`]: focused,
        }
      )}
    >
      <div className="flex items-center justify-between">
        {children}
        {afterInput}
      </div>
    </div>
  );
}
