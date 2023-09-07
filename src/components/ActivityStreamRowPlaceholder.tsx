import { Skeleton } from "./ui/skeleton.tsx";
import { cn } from "../libs/utils.ts";

export function ActivityStreamRowPlaceholder({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("flex p-2 gap-2", className)}>
      <div className="flex">
        <Skeleton className="w-[40px] h-[40px] rounded-full animate-none" />
        <Skeleton className="w-[40px] h-[40px] rounded-full -ml-3 animate-none" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-[20px] w-[50px] rounded-full animate-none" />
        <Skeleton className="h-[20px] w-[50px] rounded-full animate-none" />
      </div>
      <Skeleton className="h-[40px] flex-1 rounded-full animate-none" />
      <Skeleton className="h-[40px] flex-1 rounded-full animate-none" />
    </div>
  );
}
