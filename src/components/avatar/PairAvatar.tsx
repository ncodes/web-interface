import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.tsx";
import { cn } from "../../libs/utils.ts";

export function PairAvatar(props: {
  baseSrc: string;
  quoteSrc: string;
  base: string;
  quote: string;
  className?: string;
  className2?: string;
}) {
  return (
    <div className="flex">
      <span className={cn("z-[2] ", props.className)}>
        <Avatar className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]">
          <AvatarImage src={props.baseSrc} className="" />
          <AvatarFallback className="text-sm text-gray-800">
            {props.base}
          </AvatarFallback>
        </Avatar>
      </span>

      <span
        className={cn(
          "img relative -ml-1 lg:-ml-2 z-[1] hidden xxs:inline",
          props.className2
        )}
      >
        <Avatar className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]">
          <AvatarImage src={props.quoteSrc} className="" />
          <AvatarFallback className="text-sm text-gray-800">
            {props.quote}
          </AvatarFallback>
        </Avatar>
      </span>
    </div>
  );
}
