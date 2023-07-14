import { cn } from "../libs/utils.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";
import { ScrollArea } from "./ui/scroll-area.tsx";
import React, { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import useRegion from "./region/useRegion.ts";

function DropdownMenuItemCustom({
  children,
  className,
  onSelect,
}: {
  children: ReactNode;
  className?: string;
  onSelect?: () => void;
}) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      className={cn(
        "flex items-center gap-2 font-normal text-[13px] px-2 py-2 transition-all duration-300 focus:scale-x-105 focus:bg-chinese-green cursor-pointer rounded-none",
        className,
        {
          "scale-x-105 bg-chinese-green text-accent-foreground": false,
        }
      )}
    >
      {children}
    </DropdownMenuItem>
  );
}

export function RegionSelector() {
  const { currentRegion, getRegionIcon, setRegion } = useRegion();
  const [open, setOpen] = useState(false);

  return (
    <RegionSelectorMenu
      onOpenChange={setOpen}
      onSelect={(region) => {
        setRegion(region);
      }}
    >
      <div
        className={cn(
          "pr-2 text-lg  bg-input rounded-full flex pl-2 space-x-2 hover:cursor-pointer hover:bg-input/90 transition-all hover:scale-x-105 duration-150 [&>span]:py-1",
          {
            "scale-105 border-chinese-green": open,
          }
        )}
      >
        <span className="mt-[5px]">
          {getRegionIcon(currentRegion)({ width: 20 })}
        </span>
        <span className="font-normal text-lg mt-[1px]">{currentRegion}</span>
        <div className="pl-1 flex items-center border-input-separator border-l relative">
          {open ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
    </RegionSelectorMenu>
  );
}

export function RegionSelectorMenu({
  children,
  onOpenChange,
  onSelect,
}: {
  children: React.ReactElement;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (region: string) => void;
}) {
  const { getRegion, currentRegion } = useRegion();

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className="outline-0 ring-0">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-0 w-[120px] tracking-wide shadow-xl drop-shadow-2xl rounded-2xl bg-input border-gray-700/80 text-gray-200 px-0 py-0">
        <ScrollArea className="h-[200px]" type="scroll">
          {getRegion([currentRegion]).map((r) => (
            <DropdownMenuItemCustom
              key={r.name}
              onSelect={() => {
                onSelect && onSelect(r.name);
              }}
            >
              {r.icon({ width: 25 })} {r.name}
            </DropdownMenuItemCustom>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
