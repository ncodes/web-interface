import { ChangeEvent, ReactNode } from "react";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { cn } from "../../libs/utils.ts";
import Input2 from "../Input2.tsx";

export function EditFieldWithLabel({
  label,
  type,
  tip,
  value,
  onChange,
  children,
  disabled,
  placeholder,
  className,
  labelWrapperClassName,
  err,
}: {
  label: ReactNode;
  type?: string;
  tip?: ReactNode;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  labelWrapperClassName?: string;
  err?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div
        className={cn(
          "flex items-center gap-2 shrink-0 text-gray-400",
          labelWrapperClassName
        )}
      >
        <div>{label}</div>
        <div className="text-gray-400 hover:text-gray-200 cursor-pointer transition-all duration-500">
          <ToolTip tip={tip}>
            <IconInfoCircle width="15px" />
          </ToolTip>
        </div>
      </div>
      <div className="w-full flex justify-end">
        {!children && (
          <Input2
            type={type || "text"}
            value={value}
            disabled={disabled}
            spellCheck={false}
            className="px-3"
            placeholder={placeholder}
            onChange={onChange}
            err={err}
          />
        )}

        {children}
      </div>
    </div>
  );
}
