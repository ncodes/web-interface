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
  rmDataClickTrigger,
  className,
}: {
  title: string;
  title2?: React.ReactNode | string;
  tip?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  width?: string;
  rmDataClickTrigger?: boolean;
}) {
  return (
    <Card
      className={cn(
        "min-w-[160px] flex-1 shrink-0 border border-card-border bg-card-background shadow-sm shadow-gray-900",
        className,
        width
      )}
    >
      <CardHeader className="px-3 py-2 pr-2 pt-1 pb-[3px]">
        <CardTitle className="text-[11px] tracking-wide font-light text-gray-400 flex items-center justify-between gap-2">
          <div className="overflow-auto scrollbar-hide">
            <div className="flex flex-1 gap-1">
              <span
                className="shrink-0"
                data-click-trigger={!rmDataClickTrigger ? 1 : 0}
              >
                {title}
              </span>
              <span
                className="shrink-0"
                data-click-trigger={!rmDataClickTrigger ? 1 : 0}
              >
                {title2}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div
              data-click-trigger={!rmDataClickTrigger ? 1 : 0}
              className="cursor-pointer opacity-50 hover:opacity-100 transition-all duration-500"
            >
              <ToolTip tip={tip}>
                <IconInfoCircle width="15px" />
              </ToolTip>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent
        data-click-trigger={!rmDataClickTrigger ? 1 : 0}
        className="px-3 py-0 pb-2 tracking-wide text-chinese-green"
      >
        {children}
      </CardContent>
    </Card>
  );
}
