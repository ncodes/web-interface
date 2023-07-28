import React from "react";
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
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-pointer">{props.children}</span>
        </TooltipTrigger>
        <TooltipContent side={props.side || "top"} className="font-light">
          {props.tip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
