import { formatToHighDenom } from "../../../libs/helpers.ts";
import { NavLink } from "react-router-dom";

export function EventContentLiquidityRemove(props: {
  event: Event;
  market: Market;
  className?: string;
  inTimeline?: boolean;
  liquidity: Liquidity;
}) {
  return (
    <div className={props.className}>
      <span className="flex gap-1 flex-wrap">
        {!props.inTimeline && (
          <>
            <span>Removed</span>
            <span className="text-chinese-green">
              {formatToHighDenom(
                props.event.amount || "0",
                props.market.baseDecimals
              )}
              &nbsp;
              {props.market.base}{" "}
            </span>
            <span>from liquidity</span>
          </>
        )}
        {props.inTimeline && (
          <>
            <span>Removed</span>
            <span className="text-chinese-green">
              {formatToHighDenom(
                props.event.amount || "0",
                props.market.baseDecimals
              )}
              &nbsp;
              {props.market.base}{" "}
            </span>
            <span>
              from their{" "}
              <NavLink
                to={`/liquidity/${props.liquidity.marketAddress}/${props.liquidity.provider}/${props.liquidity.lid}`}
                className="text-chinese-green"
              >
                liquidity
              </NavLink>
            </span>
          </>
        )}
      </span>
    </div>
  );
}
