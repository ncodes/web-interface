import { formatToHighDenom } from "../../../libs/helpers.ts";
import moment from "moment/moment";
import { cn } from "../../../libs/utils.ts";
import { FetchedUserHoverCard } from "../../FetchedUserHoverCard.tsx";
import { ShortenAddress } from "../../ShortenAddress.tsx";
import { NavLink } from "react-router-dom";

export function EventContentLiquidityNewOffer(props: {
  market: Market;
  event: Event;
  className?: string;
  inTimeline?: boolean;
  liquidity: Liquidity;
}) {
  return (
    <div className={cn("flex flex-col gap-1", props.className)}>
      <span className="flex gap-1 flex-wrap">
        <span>Offered</span>
        <span className="text-chinese-green">
          {formatToHighDenom(
            props.event.offer.price || "0",
            props.market.quoteDecimals
          )}{" "}
          {props.market.quote}{" "}
        </span>
        <span>for</span>
        <span className="text-chinese-green">
          {formatToHighDenom(
            props.event.offer.amount || "0",
            props.market.baseDecimals
          )}{" "}
          {props.market.base}
        </span>
        {props.inTimeline && (
          <>
            of{" "}
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
          {moment(props.event.offer.deadline).isAfter(moment()) ? (
            <span>
              Expiring: {moment(props.event.offer.deadline).fromNow()}
            </span>
          ) : (
            <span>Expired: {moment(props.event.offer.deadline).fromNow()}</span>
          )}
        </span>
      </div>
    </div>
  );
}
