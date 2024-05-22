import { LucideFilter } from "lucide-react";
import { SwapFilterContent } from "./SwapFilterContent.tsx";

export function SwapFilter() {
  return (
    <div className="pt-3">
      <h1 className="text-lg md:text-xl mb-3 font-jersey25 tracking-wider flex items-center gap-2">
        <LucideFilter width="18" className="text-gray-500" />{" "}
        <span>Filter Swaps</span>
      </h1>
      <div className="border border-gray-800 rounded-2xl w-full ">
        <SwapFilterContent />
      </div>
    </div>
  );
}
