import { cn } from "../../libs/utils.ts";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-800", className)}
      {...props}
    />
  );
}

export { Skeleton };
