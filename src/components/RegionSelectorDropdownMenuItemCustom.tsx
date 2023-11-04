import { ReactNode } from "react";
import { cn } from "../libs/utils.ts";
import { DropdownMenuItem } from "./ui/dropdown-menu.tsx";

export function RegionSelectorDropdownMenuItemCustom({
  children,
  className,
  onSelect,
  active,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
  onSelect?: () => void;
}) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      className={cn(
        "flex items-center gap-2 font-normal text-[13px] px-2 py-2 transition-all duration-100 focus:scale-x-105 focus:bg-chinese-green cursor-pointer rounded-xl mx-1 my-1 [&>*]:hover:text-gray-900",
        className,
        {
          "scale-x-105 bg-chinese-green text-accent-foreground": active,
        }
      )}
    >
      {children}
    </DropdownMenuItem>
  );
}
