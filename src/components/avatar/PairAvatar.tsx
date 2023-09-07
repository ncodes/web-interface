import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.tsx";
import { cn } from "../../libs/utils.ts";

export function PairAvatar(props: {
  baseSrc: string;
  quoteSrc: string;
  base: string;
  quote: string;
  containerClassName?: string;
  className?: string;
  className2?: string;
  dataClickTrigger?: string;
}) {
  return (
    <div className={cn("flex", props.containerClassName)}>
      <span className={cn("z-[2] ", props.className)}>
        <Avatar className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]">
          <AvatarImage
            src={props.baseSrc}
            className=""
            data-click-trigger={props.dataClickTrigger}
          />
          <AvatarFallback
            className="text-sm text-gray-800"
            data-click-trigger={props.dataClickTrigger}
          >
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
          <AvatarImage
            src={props.quoteSrc}
            className=""
            data-click-trigger={props.dataClickTrigger}
          />
          <AvatarFallback
            className="text-sm text-gray-800"
            data-click-trigger={props.dataClickTrigger}
          >
            {props.quote}
          </AvatarFallback>
        </Avatar>
      </span>
    </div>
  );
}
