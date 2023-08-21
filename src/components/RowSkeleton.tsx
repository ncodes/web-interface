import { Skeleton } from "./ui/skeleton.tsx";

export function RowSkeleton() {
  return (
    <div className="flex p-5">
      <div className="flex gap-2 overflow-hidden">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <Skeleton className="w-10 h-10 rounded-full shrink-0 -ml-4" />
        <Skeleton className="w-32 h-10 rounded-xl shrink-0" />
        <Skeleton className="w-32 h-10 rounded-xl shrink-0" />
        <Skeleton className="w-32 h-10 rounded-xl shrink-0" />
        <Skeleton className="w-32 h-10 rounded-xl shrink-0" />
        <Skeleton className="w-32 h-10 rounded-xl shrink-0" />
        <Skeleton className="w-32 h-10 rounded-xl shrink-0" />
        <Skeleton className="w-32 h-10 rounded-xl shrink-0" />
        <Skeleton className="w-32 h-10 rounded-xl shrink-0" />
        <Skeleton className="w-32 h-10 rounded-xl shrink-0" />
      </div>
    </div>
  );
}
