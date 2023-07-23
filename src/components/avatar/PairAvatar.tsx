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
      <span className={cn("z-[2]", props.className)}>
        <Avatar>
          <AvatarImage src={props.baseSrc} className="w-[30px] lg:w-[40px]" />
          <AvatarFallback>{props.base}</AvatarFallback>
        </Avatar>
      </span>

      <span
        className={cn(
          "img relative -ml-4 lg:-ml-2 z-[1] hidden xxs:inline",
          props.className2
        )}
      >
        <Avatar>
          <AvatarImage src={props.quoteSrc} className="w-[30px] lg:w-[40px]" />
          <AvatarFallback>{props.quote}</AvatarFallback>
        </Avatar>
      </span>
    </div>
  );
}
