import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip.tsx";
import { cn } from "../libs/utils.ts";
import { TooltipPortal } from "@radix-ui/react-tooltip";

export function ToolTip(props: {
  tip?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  className2?: string;
  side?: "top" | "bottom" | "left" | "right";
  allowPropagation?: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (!props.tip) return <>{props.children}</>;

  return (
    <TooltipProvider>
      <Tooltip
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <TooltipTrigger className={props.className} asChild>
          <span
            className="cursor-pointer"
            onClick={(e) => {
              if (!props.allowPropagation) e.stopPropagation();
              setOpen(!open);
            }}
          >
            {props.children}
          </span>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            side={props.side || "top"}
            className={cn(
              "relative !z-50 font-light border border-gray-600",
              props.className2
            )}
          >
            {props.tip}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}
