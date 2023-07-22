import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar.tsx";
import { ReactNode } from "react";
import { cn } from "../../libs/utils.ts";

export function Avatar({
  src,
  fallback,
  className,
}: {
  src: string;
  fallback: ReactNode;
  className?: string;
}) {
  return (
    <UIAvatar className="w-auto">
      <AvatarImage src={src} className={cn("w-[30px]", className)} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </UIAvatar>
  );
}
