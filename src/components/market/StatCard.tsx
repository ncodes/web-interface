import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import { cn } from "../../libs/utils.ts";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";

export function StatCard({
  title,
  title2,
  children,
  tip,
  width,
  noSwapTrigger,
  className,
}: {
  title: string;
  title2?: React.ReactNode | string;
  tip?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  width?: string;
  noSwapTrigger?: boolean;
}) {
  return (
    <Card
      className={cn(
        "w-[150px] flex-1 shrink-0 border border-card-border bg-card-background shadow-sm shadow-gray-900",
        className,
        width
      )}
    >
      <CardHeader className="px-3 py-2 pt-1 pb-[3px]">
        <CardTitle className="text-xs tracking-wide font-light text-gray-400 flex items-center gap-2">
          <span data-click-trigger={!noSwapTrigger ? 1 : 0}>{title}</span>
          <span data-click-trigger={!noSwapTrigger ? 1 : 0}>{title2}</span>
          <span
            data-click-trigger={!noSwapTrigger ? 1 : 0}
            className="flex-1 flex justify-end cursor-pointer opacity-50 hover:opacity-100 transition-all duration-500"
          >
            <ToolTip tip={tip}>
              <IconInfoCircle width="15px" />
            </ToolTip>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent
        data-click-trigger={!noSwapTrigger ? 1 : 0}
        className="px-3 py-0 pb-2 tracking-wide text-chinese-green"
      >
        {children}
      </CardContent>
    </Card>
  );
}
