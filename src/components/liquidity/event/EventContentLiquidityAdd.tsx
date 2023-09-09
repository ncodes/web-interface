import { formatToHighDenom } from "../../../libs/helpers.ts";
import { cn } from "../../../libs/utils.ts";
import { NavLink } from "react-router-dom";

export function EventContentLiquidityAdd(props: {
  event: Event;
  market: Market;
  liquidity: Liquidity;
  className?: string;
  inTimeline?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-1", props.className)}>
      <span className="flex gap-1 flex-wrap">
        {!props.inTimeline && (
          <>
            <span>Added</span>
            <span className="text-chinese-green">
              {formatToHighDenom(
                props.event.amount || "0",
                props.market.baseDecimals
              )}{" "}
              {props.market.base}{" "}
            </span>
            <span>liquidity</span>
          </>
        )}
        {props.inTimeline && (
          <div className="flex gap-1">
            Added{" "}
            <span className="text-chinese-green">
              {formatToHighDenom(
                props.event.amount || "0",
                props.market.baseDecimals
              )}{" "}
              {props.market.base}{" "}
            </span>{" "}
            to their{" "}
            <NavLink
              to={`/liquidity/${props.liquidity.marketAddress}/${props.liquidity.provider}/${props.liquidity.lid}`}
              className="text-chinese-green"
            >
              liquidity
            </NavLink>
          </div>
        )}
      </span>
      <div>
        <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
          Price:{" "}
          {formatToHighDenom(
            props.event.price || "0",
            props.market.quoteDecimals
          )}{" "}
          {props.market.quote} / {props.market.base}
        </span>
      </div>
    </div>
  );
}
