import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../libs/utils.ts";
import { IconSearch } from "../icons/IconSearch.tsx";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";

export function SearchInput(props: {
  onFocus: () => void;
  onBlur: () => void;
  focus: boolean;
  autoFocus?: boolean;
  onValue?: (value: string) => void;
  className?: string;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    props.onValue && props.onValue(value);
  }, [value]);

  return (
    <>
      <Input
        placeholder="Search tokens, pairs or addresses"
        rounded="full"
        autoFocus={props.autoFocus}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          " delay-75  ease-in-out focus-visible:ring-chinese-green text-[16px] placeholder:font-light rounded-full p-5  pr-11 cursor-pointer  hover:border-chinese-green transition-all duration-500 text-gray-100 tracking-wider ",
          {
            "ring-chinese-green !border-chinese-green !ring-0 outline-none":
              props.focus,
          },
          props.className
        )}
      />
      {value && (
        <Button
          variant="link"
          className="absolute text-chinese-green cursor-pointer right-0 hover:scale-110 transition-all duration-300"
          onClick={(e) => {
            setValue("");
            ref.current?.focus();
          }}
        >
          <XIcon width="24px" />
        </Button>
      )}
      {!value && (
        <IconSearch
          height="24px"
          width="24px"
          className="relative -ml-9 top-2 cursor-pointer"
        />
      )}
    </>
  );
}
