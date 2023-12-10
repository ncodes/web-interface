import { useState } from "react";
import { cn } from "../libs/helpers";
import { CalendarInput } from "./CalendarInput";

export default function Calendar2({
  className,
  defaultValue,
  onSelect,
}: {
  className?: string;
  defaultValue?: Date;
  onValueChange?: (val: string) => void;
  onSelect?: (date: Date) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "w-auto  bg-card-background  border rounded-2xl transition-all duration-500 hover:bg-chinese-green hover:scale-x-[1.03]",
        {
          "border-card-border": !open,
          "border-chinese-green  bg-chinese-green scale-x-[1.03]": open,
        },
        className,
      )}
    >
      <CalendarInput
        onOpenChange={(open) => setOpen(open)}
        className={cn(
          "py-5 border-none bg-transparent w-full rounded-xl w-auth hover:scale-x-100 hover:bg-transparent hover:text-gray-800",
          className,
        )}
        defaultValue={defaultValue}
        onSelect={onSelect}
      />
    </div>
  );
}
