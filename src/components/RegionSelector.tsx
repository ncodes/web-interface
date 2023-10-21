import { ChevronDown } from "lucide-react";
import React, { ReactNode, useState } from "react";
import { cn } from "../libs/utils.ts";
import useRegion from "./region/useRegion.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";
import { ScrollArea } from "./ui/scroll-area.tsx";

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
        "flex items-center gap-2 font-normal text-[13px] px-2 py-2 transition-all duration-300 focus:scale-x-105 focus:bg-chinese-green cursor-pointer rounded-xl mx-1 my-1",
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
  const { currentRegion, getRegionIcon, setRegion, getRegion } = useRegion();
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
          "pr-2 h-[40px] text-lg border border-gray-600 rounded-full flex items-center pl-2 space-x-2 hover:cursor-pointer hover:bg-gray-800 transition-all hover:scale-x-105 duration-500 [&>span]:py-1",
          { "scale-105 border-chinese-green bg-gray-800": open }
        )}
      >
        <span className="">
          {getRegionIcon(currentRegion || "")({
            width: 20,
            className: getRegion(currentRegion || "")?.className,
          })}
        </span>
        <span className="font-normal text-lg mt-[1px] tracking-wider">
          {currentRegion}
        </span>
        <div
          className={cn(
            "pl-1 flex items-center relative transition-all duration-300",
            {
              "rotate-180": open,
            }
          )}
        >
          <ChevronDown />
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
  const { getRegions, currentRegion } = useRegion();

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className="outline-0 ring-0">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto DropdownMenuContent min-w-0 tracking-wide shadow-xl drop-shadow-2xl rounded-2xl bg-modal-background border-gray-700/80 text-gray-200 py-0 px-1">
        <ScrollArea className="h-[200px]" type="scroll">
          {getRegions(currentRegion ? [currentRegion] : []).map((r) => (
            <DropdownMenuItemCustom
              key={r.name || r.selectName}
              onSelect={() => {
                onSelect && onSelect(r.name);
              }}
            >
              {r.icon({ width: 25, className: r.className })}{" "}
              {r.name || r.selectName}
            </DropdownMenuItemCustom>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
