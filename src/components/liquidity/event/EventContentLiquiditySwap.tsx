import { NavLink } from "react-router-dom";
import { formatToHighDenom, formatToMoney } from "../../../libs/helpers.ts";
import { cn } from "../../../libs/utils.ts";
import { FetchedUserHoverCard } from "../../FetchedUserHoverCard.tsx";
import { ShortenAddress } from "../../ShortenAddress.tsx";

export function EventContentLiquiditySwap(props: {
  market: Market;
  swap: Swap;
  className?: string;
  inTimeline?: boolean;
  liquidity: Liquidity;
}) {
  return (
    <div className={cn("flex flex-col gap-1", props.className)}>
      <span className="flex gap-1 flex-wrap">
        {!props.inTimeline && (
          <>
            <span>Swapped</span>
            <span className="text-chinese-green">
              {formatToHighDenom(
                props.swap.amount || "0",
                props.market.baseDecimals,
              )}{" "}
              {props.market.base}{" "}
            </span>
            <span>liquidity for</span>
            <span className="text-chinese-green">
              {formatToMoney(props.swap.cost || "0")} {props.market.quote}
            </span>
          </>
        )}
        {props.inTimeline && (
          <>
            <span>Swapped</span>
            <span className="text-chinese-green">
              {formatToHighDenom(
                props.swap.amount || "0",
                props.market.baseDecimals,
              )}{" "}
              {props.market.base}{" "}
            </span>
            <span>for</span>
            <span className="text-chinese-green">
              {formatToMoney(props.swap.cost || "0")} {props.market.quote}
            </span>{" "}
            from{" "}
            <FetchedUserHoverCard
              address={props.liquidity.provider}
              className="cursor-pointer"
            >
              <ShortenAddress
                address={props.liquidity.provider}
                className="address-mention-decoration"
                suffix="'s"
              />
            </FetchedUserHoverCard>{" "}
            <NavLink
              to={`/liquidity/${props.liquidity.marketAddress}/${props.liquidity.provider}/${props.liquidity.lid}`}
              className="text-chinese-green"
            >
              liquidity
            </NavLink>
          </>
        )}
      </span>
      <div>
        <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
          Price:{" "}
          {formatToHighDenom(
            props.swap.price || "0",
            props.market.quoteDecimals,
          )}{" "}
          {props.market.quote} / {props.market.base}
        </span>
      </div>
    </div>
  );
}
