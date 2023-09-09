import { formatToHighDenom } from "../../../libs/helpers.ts";
import { NavLink } from "react-router-dom";

export function EventContentLiquidityPriceUpdate(props: {
  event: Event;
  market: Market;
  className?: string;
  liquidity: Liquidity;
  inTimeline?: boolean;
}) {
  return (
    <div className={props.className}>
      <span className="flex gap-1 flex-wrap">
        {!props.inTimeline && (
          <>
            Updated the price to{" "}
            <span className="text-chinese-green">
              {formatToHighDenom(
                props.event.price || "0",
                props.market.quoteDecimals
              )}{" "}
              {props.market.quote} / {props.market.base}
            </span>
          </>
        )}

        {props.inTimeline && (
          <>
            Updated the price of their{" "}
            <NavLink
              to={`/liquidity/${props.liquidity.marketAddress}/${props.liquidity.provider}/${props.liquidity.lid}`}
              className="text-chinese-green"
            >
              liquidity
            </NavLink>{" "}
            to{" "}
            <span className="text-chinese-green">
              {formatToHighDenom(
                props.event.price || "0",
                props.market.quoteDecimals
              )}{" "}
              {props.market.quote} / {props.market.base}
            </span>
          </>
        )}
      </span>
    </div>
  );
}
