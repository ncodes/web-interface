import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.tsx";
import { cn } from "../../libs/utils.ts";

export function PairAvatar(props: {
  baseSrc: string;
  quoteSrc: string;
  base: string;
  quote: string;
  size?: "sm" | "default";
  noBorder?: boolean;
  containerClassName?: string;
  className?: string;
  className2?: string;
  dataClickTrigger?: string;
}) {
  return (
    <div className={cn("flex", props.containerClassName)}>
      <span className={cn("z-[2] ", props.className)}>
        <Avatar
          className={cn("img1 w-[30px] h-[30px] md:w-[40px] md:h-[40px]", {
            "md:w-[40px] md:h-[40px]": props.size == "default" || !props.size,
            "md:w-[25px] md:h-[25px]": props.size == "sm",
            "border-gray-700 border": !props.noBorder,
          })}
        >
          <AvatarImage
            src={props.baseSrc}
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
        <Avatar
          className={cn(
            "img1 w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-gray-700 border",
            {
              "md:w-[40px] md:h-[40px]": props.size == "default" || !props.size,
              "md:w-[25px] md:h-[25px]": props.size == "sm",
              "border-gray-700 border": !props.noBorder,
            }
          )}
        >
          <AvatarImage
            src={props.quoteSrc}
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
