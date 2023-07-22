import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.tsx";

export function PairAvatar(props: {
  baseSrc: string;
  quoteSrc: string;
  base: string;
  quote: string;
}) {
  return (
    <div className="flex">
      <span className="z-[2]">
        <Avatar>
          <AvatarImage src={props.baseSrc} className="w-[30px] lg:w-[40px]" />
          <AvatarFallback>{props.base}</AvatarFallback>
        </Avatar>
      </span>

      <span className="relative -ml-4 lg:-ml-2 z-[1] hidden xxs:inline">
        <Avatar>
          <AvatarImage src={props.quoteSrc} className="w-[30px] lg:w-[40px]" />
          <AvatarFallback>{props.quote}</AvatarFallback>
        </Avatar>
      </span>
    </div>
  );
}
