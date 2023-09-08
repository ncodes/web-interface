import { ReactNode, useEffect, useState } from "react";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { Input } from "../ui/Input.tsx";
import { cn } from "../../libs/utils.ts";
import { Slider } from "../ui/slider.tsx";

export function EditFieldWithLabelAndSlider({
  label,
  type,
  tip,
  value,
  slideMin,
  slideMax,
  suffix,
  onChange,
  children,
  placeholder,
  className,
}: {
  label: ReactNode;
  type?: string;
  tip?: ReactNode;
  value?: number;
  slideMin?: number;
  slideMax?: number;
  suffix?: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
  placeholder?: string;
  className?: string;
}) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

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
          <div className="flex flex-col gap-2">
            <div className="flex">
              <Input
                type={type || "text"}
                value={val}
                className="px-3 !w-[150px]"
                placeholder={placeholder}
                onChange={(e) => {
                  onChange && onChange(e.target.value);
                }}
              />
              {suffix && (
                <div className="relative">
                  <div className="w-[30px] h-[30px] -ml-8 absolute flex justify-center text-gray-500 items-center">
                    {suffix}
                  </div>
                </div>
              )}
            </div>
            <Slider
              value={[val || 1800]}
              min={slideMin}
              max={slideMax}
              step={1}
              onValueChange={(value) => {
                setVal(value[0]);
                onChange && onChange(value.toString());
              }}
            />
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
