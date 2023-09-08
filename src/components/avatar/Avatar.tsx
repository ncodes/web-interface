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
  fallbackClassName,
}: {
  src: string;
  fallback?: ReactNode;
  className?: string;
  fallbackClassName?: string;
}) {
  return (
    <UIAvatar className="w-auto flex items-center">
      <AvatarImage src={src} className={cn("w-[30px]", className)} />
      {fallback && (
        <AvatarFallback className={cn("w-[30px]", fallbackClassName)}>
          {fallback}
        </AvatarFallback>
      )}
    </UIAvatar>
  );
}
