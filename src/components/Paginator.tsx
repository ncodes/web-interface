import { cn } from "../libs/utils.ts";
import { Button } from "./ui/Button.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Paginator({
  className,
  limit,
  total,
  curPage,
  onNext,
  onPrev,
}: {
  className?: string;
  curPage: number;
  limit: number;
  total?: number;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  function getPageCount() {
    return total ? Math.ceil(total / (limit || 1)) : 0;
  }

  return (
    <div
      className={cn(
        "flex items-center bg-card-background justify-between border-b border-gray-800 px-3 md:px-5 text-sm py-2 text-gray-400 font-light",
        { hidden: !total },
        className
      )}
    >
      <span>
        Showing {curPage + 1} of {getPageCount()} pages
      </span>
      <div className="flex gap-2">
        {curPage + 1 > 1 && (
          <Button variant="outline" size="icon" onClick={onPrev}>
            <ChevronLeft width="20px" />
          </Button>
        )}
        {curPage + 1 < getPageCount() && (
          <Button variant="outline" size="icon" onClick={onNext}>
            <ChevronRight width="20px" />
          </Button>
        )}
      </div>
    </div>
  );
}
