import { cn } from "../libs/utils.ts";
import { Button } from "./ui/Button.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Paginator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center bg-card-background justify-between border-b border-gray-800 px-3 md:px-5 text-sm py-2 text-gray-400 font-light",
        className
      )}
    >
      <span>Showing 1 of 100 pages</span>
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <ChevronLeft width="20px" />
        </Button>
        <Button variant="outline" size="icon">
          <ChevronRight width="20px" />
        </Button>
      </div>
    </div>
  );
}
