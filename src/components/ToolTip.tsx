import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip.tsx";
import { cn } from "../libs/utils.ts";

export function ToolTip(props: {
  tip: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  className2?: string;
  side?: "top" | "bottom" | "left" | "right";
}) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <TooltipTrigger className={props.className} asChild>
          <span className="cursor-pointer" onClick={() => setOpen(!open)}>
            {props.children}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side={props.side || "top"}
          className={cn("font-light", props.className2)}
        >
          {props.tip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
