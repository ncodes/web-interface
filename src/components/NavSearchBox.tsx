import { Input } from "./ui/Input.tsx";
import { IconSearch } from "./IconSearch.tsx";
import { useState } from "react";
import { cn } from "../libs/utils.ts";

export function NavSearchBox() {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={cn(
        "hidden md:flex md:w-[230px] lg:w-[300px] xl:w-[500px] transition-all duration-500 hover:scale-x-105",
        {
          "scale-x-105": focus,
        }
      )}
    >
      <Input
        placeholder="Search tokens, pairs or addresses"
        rounded="full"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={cn(
          "delay-75 ease-in-out focus-visible:ring-chinese-green text-[16px] font-normal rounded-full p-5  pr-11 cursor-pointer hover:border-chinese-green transition-all duration-500 text-gray-300 tracking-wider border-gray-600",
          {
            "ring-chinese-green !border-chinese-green ring-2 outline-none":
              focus,
          }
        )}
      />
      <IconSearch
        height="24px"
        width="24px"
        className="relative -left-9 top-2 cursor-pointer"
      />
    </div>
  );
}
