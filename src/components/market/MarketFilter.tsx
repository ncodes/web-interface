import { LucideFilter } from "lucide-react";
import { MarketFilterContent } from "./MarketFilterContent.tsx";

export function MarketFilter() {
  return (
    <div className="pt-3">
      <h1 className="text-lg md:text-xl mb-3 flex items-center gap-2 tracking-wide">
        <LucideFilter width="18" className="text-gray-500" />{" "}
        <span>Filter Markets</span>
      </h1>
      <div className="bg-card-background border border-gray-800 rounded-2xl w-full ">
        <MarketFilterContent />
      </div>
    </div>
  );
}
