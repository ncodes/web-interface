import { Skeleton } from "./ui/skeleton.tsx";

export function ActivityStreamRowSkeleton() {
  return (
    <div className="flex p-2 gap-2">
      <div className="flex">
        <Skeleton className="w-[40px] h-[40px] rounded-full" />
        <Skeleton className="w-[40px] h-[40px] rounded-full -ml-3" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-[20px] w-[50px] rounded-full" />
        <Skeleton className="h-[20px] w-[50px] rounded-full" />
      </div>
      <Skeleton className="h-[40px] flex-1 rounded-full" />
      <Skeleton className="h-[40px] flex-1 rounded-full" />
    </div>
  );
}
