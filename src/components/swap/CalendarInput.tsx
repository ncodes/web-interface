"use client";

import { CalendarIcon } from "@radix-ui/react-icons";

import { useState } from "react";
import { Calendar } from "../ui/calendar.tsx";
import { Button } from "../ui/Button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.tsx";
import { cn } from "../../libs/utils.ts";

export function CalendarInput({
  className,
  onSelect,
  defaultValue,
}: {
  className?: string;
  onSelect?: (date: Date) => void;
  defaultValue?: Date;
}) {
  const [date, setDate] = useState<Date | undefined>(
    defaultValue || new Date()
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size="sm"
          rounded="md"
          className={cn(
            "transition-all duration-500 hover:scale-x-105 data-[state=open]:border-chinese-green data-[state=open]:text-gray-800 data-[state=open]:bg-chinese-green data-[state=open]:scale-x-105 w-[180px] pl-3 text-left text-xs  font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          {date ? date.toLocaleDateString() : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-modal-background text-gray-200 border-gray-600"
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
