import { formatToHighDenom } from "../../../libs/helpers.ts";
import { NavLink } from "react-router-dom";
import { ShortenAddress } from "../../ShortenAddress.tsx";
import { FetchedUserHoverCard } from "../../FetchedUserHoverCard.tsx";

export function EventContentOfferUpdate(props: {
  amount: string;
  market: Market;
  liquidity: Liquidity;
  price: string;
  inTimeline?: boolean;
}) {
  return (
    <>
      <span className="block mb-2">
        {!props.inTimeline ? (
          <>Updated the offer</>
        ) : (
          <div className="flex gap-1">
            Updated an offer they proposed for{" "}
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
          </div>
        )}
      </span>
      <div className="flex flex-col xs:flex-row gap-1">
        <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
          Amount:{" "}
          {formatToHighDenom(props.amount || "0", props.market.baseDecimals)}{" "}
          {props.market.base}
        </span>
        <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
          Price:{" "}
          {formatToHighDenom(props.price || "0", props.market.quoteDecimals)}{" "}
          {props.market.quote} / {props.market.base}
        </span>
      </div>
    </>
  );
}
