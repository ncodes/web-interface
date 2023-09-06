import { formatToHighDenom } from "../../../libs/helpers.ts";
import { cn } from "../../../libs/utils.ts";
import { NavLink } from "react-router-dom";

export function EventContentLiquiditySwapLimitUpdate(props: {
  event: Event;
  market: Market;
  className?: string;
  inTimeline?: boolean;
  liquidity: Liquidity;
}) {
  return (
    <div className={cn("flex flex-col gap-1", props.className)}>
      <span className="flex gap-1">
        {!props.inTimeline && <span>Updated the swap amount limit</span>}
        {props.inTimeline && (
          <span>
            Updated the swap amount limit of their{" "}
            <NavLink
              to={`/liquidity/${props.liquidity.marketAddress}/${props.liquidity.provider}/${props.liquidity.lid}`}
              className="text-chinese-green"
            >
              liquidity
            </NavLink>
          </span>
        )}
      </span>
      <div>
        <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
          Min:{" "}
          {formatToHighDenom(
            props.event.minSwap || "0",
            props.market.baseDecimals
          )}{" "}
          {props.market.base}
        </span>
        &nbsp;
        <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
          Max:{" "}
          {formatToHighDenom(
            props.event.maxSwap || "0",
            props.market.baseDecimals
          )}{" "}
          {props.market.base}
        </span>
      </div>
    </div>
  );
}
