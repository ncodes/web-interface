import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { cn } from "../libs/utils.ts";
import { ToolTip } from "./ToolTip.tsx";
import IconInfoCircle from "./icons/IconInfoCircle.tsx";

export function MarketStat({
  title,
  title2,
  children,
  tip,
  width,
}: {
  title: string;
  title2: React.ReactNode | string;
  tip?: React.ReactNode;
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <Card
      className={cn(
        "w-[150px] border border-card-border bg-card-background shadow-sm shadow-gray-900",
        width
      )}
    >
      <CardHeader className="px-3 py-2 pt-1 pb-[2px]">
        <CardTitle className="text-xs tracking-wide font-light text-gray-400 flex items-center gap-2">
          <span>{title}</span>
          <span>{title2}</span>
          <span className="flex-1 flex justify-end cursor-pointer opacity-50 hover:opacity-100 transition-all duration-500">
            <ToolTip tip={tip}>
              <IconInfoCircle width="15px" />
            </ToolTip>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-0 pb-2 tracking-wide text-chinese-green">
        {children}
      </CardContent>
    </Card>
  );
}
