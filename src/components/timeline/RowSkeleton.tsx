import { cn } from "../../libs/helpers.ts";
import { Skeleton } from "../ui/skeleton.tsx";

export function RowSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-2 w-full md:w-[500px]", className)}>
      <Skeleton className="w-[35px] h-[35px] rounded-full" />
      <div className="flex-1 flex flex-col gap-1">
        <Skeleton className="w-full h-[20px]" />
        <Skeleton className="w-full h-[20px]" />
      </div>
    </div>
  );
}
