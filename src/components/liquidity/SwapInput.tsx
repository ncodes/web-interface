import { useState } from "react";
import { cn } from "../../libs/utils.ts";
import { Avatar } from "../avatar/Avatar.tsx";
import { Input } from "../ui/Input.tsx";

export function SwapInput(props: { avatar: string; avatarFallback: string }) {
  const [focus, setFocus] = useState(false);
  return (
    <div
      className={cn(
        "rounded-full h-12 bg-card-background border border-gray-700 hover:border-chinese-green flex pl-[6px] pt-[3px] transition-all duration-300",
        { "border-chinese-green scale-105": focus }
      )}
    >
      <Avatar
        src={props.avatar}
        className="w-[35px]"
        fallback={props.avatarFallback}
      />
      <Input
        type="number"
        variant="ghost"
        placeholder="0.0"
        className="ml-1 mt-[3px] mr-2 rounded-full pl-2 text-xl"
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
      />
    </div>
  );
}
