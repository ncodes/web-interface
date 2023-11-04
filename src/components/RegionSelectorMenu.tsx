import React from "react";
import { RegionSelectorDropdownMenuItemCustom } from "./RegionSelectorDropdownMenuItemCustom.tsx";
import useRegion from "./region/useRegion.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";
import { ScrollArea } from "./ui/scroll-area.tsx";

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
            <RegionSelectorDropdownMenuItemCustom
              key={r.name || r.selectName}
              active={currentRegion == r.value}
              onSelect={() => {
                onSelect && onSelect(r.value);
              }}
            >
              {r.icon({
                width: 25,
                className:
                  currentRegion != r.value
                    ? r.className
                    : `${r.className} fill-gray-900`,
              })}{" "}
              {r.name || r.selectName}
            </RegionSelectorDropdownMenuItemCustom>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
