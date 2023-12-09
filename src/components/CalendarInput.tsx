"use client";

import { CalendarIcon } from "@radix-ui/react-icons";

import { useState } from "react";
import { cn } from "../libs/utils.ts";
import { Button } from "./ui/Button.tsx";
import { Calendar } from "./ui/calendar.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.tsx";

export function CalendarInput({
  className,
  onSelect,
  defaultValue,
  onOpenChange,
}: {
  className?: string;
  onSelect?: (date: Date) => void;
  defaultValue?: Date;
  onOpenChange?: (open: boolean) => void;
}) {
  const [date, setDate] = useState<Date | undefined>(
    defaultValue || new Date(),
  );
  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size="sm"
          rounded="md"
          className={cn(
            "transition-all duration-500 hover:scale-x-105 data-[state=open]:border-chinese-green data-[state=open]:text-gray-800  w-[180px] pl-3 text-left text-xs font-normal",
            !date && "text-muted-foreground",
            className,
          )}
        >
          {date ? date.toLocaleDateString() : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-modal-background text-gray-200 border-gray-700"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            if (!date) return;
            setDate(date);
            onSelect && onSelect(date as Date);
          }}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
        />
      </PopoverContent>
    </Popover>
  );
}
