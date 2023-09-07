import { cn } from "../../libs/utils.ts";

export function PriceChange(props: { priceChange: number }) {
  return (
    <span
      className={cn("hidden xxs:inline text-[10px]", {
        "text-green-400": props.priceChange > 0,
        "text-red-400": props.priceChange < 0,
        "text-gray-200": props.priceChange == 0,
      })}
    >
      ({props.priceChange < 0 && "-"}
      {props.priceChange == 0 && ""}
      {props.priceChange > 0 && "+"}
      {props.priceChange.toString().replace("-", "")}%)
    </span>
  );
}
