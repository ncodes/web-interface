import { ReactNode } from "react";
import { cn } from "../../libs/helpers";

export function EmptyBodyCard({
  label,
  className,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-gray-800 shadow-chinese-green/10 shadow-lg flex flex-col p-3 items-center justify-center",
        className,
      )}
    >
      <div className="p-2 font-light tracking-wider">{label}</div>
      {children}
    </div>
  );
}
