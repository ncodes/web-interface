import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";
import { cn } from "../../libs/utils.ts";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";

export function EditRow({
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
      <AccordionTrigger className="px-5 py-3 tracking-wider ">
        <div className="flex items-center gap-2 text-[16px]">
          <span>{title}</span>
          <ToolTip tip={tip}>
            <span className="opacity-60 hover:opacity-100 cursor-pointer">
              <IconInfoCircle width="16" />
            </span>
          </ToolTip>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-gray-200 px-5 pt-1">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
