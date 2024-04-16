import { useState } from "react";
import { cn } from "../libs/helpers";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";

export default function Select2({
  children,
  className,
  onValueChange,
  value,
  placeholder,
  triggerClassName,
  contentClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  placeholder?: string;
  triggerClassName?: string;
  contentClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "bg-card-background border rounded-2xl transition-all duration-500",
        {
          "border-card-border": !open,
          "border-chinese-green ring-2 ring-chinese-green scale-x-[1.03]": open,
        },
        className,
      )}
    >
      <Select
        value={value}
        onValueChange={onValueChange}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <>
          <SelectTrigger
            className={cn(
              "w-[120px] text-gray-200 py-5 transition-all border-none duration-500 border-0 ring-0 outline-none focus:border-none focus:ring-0 focus:outline-none",
              triggerClassName,
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className={cn("border-gray-700", contentClassName)}>
            {children}
          </SelectContent>
        </>
      </Select>
    </div>
  );
}
