import IconEthereum from "./icons/IconEthereum.tsx";
import { ChevronDown } from "lucide-react";

export function NetworkSelector() {
  return (
    <div className="flex gap-2 border items-center transition-all duration-500 hover:cursor-pointer hover:bg-gray-800 hover:scale-105 hover:border-chinese-green p-2 px-2 pr-1 rounded-full border-gray-600">
      <IconEthereum width="25" height="25" />
      <span className="hidden md:inline">Ethereum</span>
      <span className="relative -left-1 top-[2px]">
        <ChevronDown />
      </span>
    </div>
  );
}
