import { ChangeEvent, ReactNode } from "react";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { Input } from "../ui/Input.tsx";
import { cn } from "../../libs/utils.ts";

export function EditFieldWithLabel({
  label,
  type,
  tip,
  value,
  onChange,
  children,
  placeholder,
  className,
}: {
  label: ReactNode;
  type?: string;
  tip?: ReactNode;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex items-center gap-2 shrink-0 text-gray-400">
        <div>{label}</div>
        <div className="text-gray-400 hover:text-gray-200 cursor-pointer transition-all duration-500">
          <ToolTip tip={tip}>
            <IconInfoCircle width="15px" />
          </ToolTip>
        </div>
      </div>
      <div className="w-full flex justify-end">
        {!children && (
          <Input
            type={type || "text"}
            value={value}
            className="px-3"
            placeholder={placeholder}
            onChange={onChange}
          />
        )}

        {children}
      </div>
    </div>
  );
}
