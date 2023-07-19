import React from "react";
import { cn } from "../libs/utils.ts";

export function Alert({
  icon,
  children,
  className,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full border border-gray-800 items-center gap-2 font-light text-xs text-gray-400 bg-gray-900 p-2 mt-3 rounded-xl",
        className
      )}
    >
      <div className="text-chinese-green">{icon}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
