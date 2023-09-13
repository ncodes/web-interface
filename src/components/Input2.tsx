import { cn } from "../libs/utils.ts";
import { Input } from "./ui/Input.tsx";
import IconCaution from "./icons/IconCaution.tsx";
import { ChangeEvent, useState, FocusEvent, ReactNode, useEffect } from "react";

export default function Input2(props: {
  value?: string;
  type?: string;
  isFocused?: boolean;
  disabled?: boolean;
  spellCheck?: boolean;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  afterInput?: ReactNode;
  beforeInput?: ReactNode;
  after?: ReactNode;
  err?: string;
}) {
  const [focused, setFocused] = useState(props.isFocused);

  useEffect(() => {
    setFocused(props.isFocused);
  }, [props.isFocused]);

  return (
    <div
      className={cn(
        props.containerClassName,
        "flex-1 bg-card-background border rounded-2xl transition-all duration-500",
        {
          "border-card-border": !focused,
          "border-chinese-green ring-2 ring-chinese-green": focused,
        }
      )}
    >
      <div className="flex pt-1 w-full">
        {props.beforeInput && props.beforeInput}
        <div className="flex-1">
          <Input
            value={props.value}
            type={props.type || "text"}
            placeholder={props.placeholder}
            disabled={props.disabled}
            spellCheck={props.spellCheck}
            className={cn(
              "bg-transparent border-transparent px-3 outline-none focus-visible:ring-0",
              props.className
            )}
            onChange={props.onChange}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus && props.onFocus(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur && props.onBlur(e);
            }}
          />
        </div>
        {props.afterInput && props.afterInput}
      </div>
      {props.after && props.after}
      <div className="flex justify-between px-3 pb-1 text-[10px] text-gray-400 tracking-wider">
        {props.err && (
          <span className="flex items-center gap-1 text-red-500 text-xs font-light">
            <span>
              <IconCaution width="15" fillA="#cb0c2c" />
            </span>
            <span>{props.err}</span>
          </span>
        )}
      </div>
    </div>
  );
}
