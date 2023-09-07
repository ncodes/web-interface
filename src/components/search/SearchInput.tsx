import { Input } from "../ui/Input.tsx";
import { cn } from "../../libs/utils.ts";
import { IconSearch } from "../icons/IconSearch.tsx";

export function SearchInput(props: {
  onFocus: () => void;
  onBlur: () => void;
  focus: boolean;
  autoFocus?: boolean;
}) {
  return (
    <>
      <Input
        placeholder="Search tokens, pairs or addresses"
        rounded="full"
        autoFocus={props.autoFocus}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        className={cn(
          " delay-75  ease-in-out focus-visible:ring-chinese-green text-[16px] placeholder:font-light rounded-full p-5  pr-11 cursor-pointer  hover:border-chinese-green transition-all duration-500 text-gray-100 tracking-wider ",
          {
            "ring-chinese-green !border-chinese-green !ring-0 outline-none":
              props.focus,
          }
        )}
      />
      <IconSearch
        height="24px"
        width="24px"
        className="relative -ml-9 top-2 cursor-pointer"
      />
    </>
  );
}
