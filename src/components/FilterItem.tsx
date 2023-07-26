import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion.tsx";
import { cn } from "../libs/utils.ts";
import { ToolTip } from "./ToolTip.tsx";
import IconInfoCircle from "./icons/IconInfoCircle.tsx";

export function FilterItem({
  title,
  children,
  className,
  tip,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  tip?: React.ReactNode;
}) {
  return (
    <AccordionItem value={title} className={cn(className)}>
      <AccordionTrigger className="px-5 py-3 tracking-wider">
        <div className="flex items-center gap-2">
          <span>{title}</span>
          <ToolTip tip={tip}>
            <span className="opacity-60 hover:opacity-100 cursor-pointer relative top-[2px]">
              <IconInfoCircle width="15" />
            </span>
          </ToolTip>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-gray-200 px-5 pt-1">
        <div className="flex gap-2">
          <div className="flex-1 flex">{children}</div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
