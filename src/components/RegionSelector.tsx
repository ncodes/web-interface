import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "../libs/utils.ts";
import { RegionSelectorMenu } from "./RegionSelectorMenu.tsx";
import useRegion from "./region/useRegion.ts";

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
          {currentRegion && getRegion(currentRegion)?.name}
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
