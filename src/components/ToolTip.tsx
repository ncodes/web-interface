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
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{props.children}</TooltipTrigger>
        <TooltipContent className="font-light">{props.tip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
