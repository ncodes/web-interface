import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip.tsx";

export function ToolTip(props: {
  tip: React.ReactNode;
  children: React.ReactNode;
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
        <TooltipTrigger asChild>
          <span className="cursor-pointer" onClick={() => setOpen(!open)}>
            {props.children}
          </span>
        </TooltipTrigger>
        <TooltipContent side={props.side || "top"} className="font-light">
          {props.tip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
