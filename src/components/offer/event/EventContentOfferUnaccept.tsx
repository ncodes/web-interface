import { formatToHighDenom } from "../../../libs/helpers.ts";
import { ShortenAddress } from "../../ShortenAddress.tsx";
import { NavLink } from "react-router-dom";
import { FetchedUserHoverCard } from "../../FetchedUserHoverCard.tsx";

export function EventContentOfferUnaccept(props: {
  amount: string;
  market: Market;
  price: string;
  offer: Offer;
  liquidity: Liquidity;
  inTimeline?: boolean;
}) {
  return (
    <>
      <span className="block mb-2">
        {!props.inTimeline ? (
          <>Rejected the offer to swap</>
        ) : (
          <div className="flex gap-1 flex-wrap">
            Rejected an offer proposed by{" "}
            <FetchedUserHoverCard
              address={props.liquidity.provider}
              className="cursor-pointer"
            >
              <ShortenAddress
                address={props.offer.creator}
                className="address-mention-decoration"
              />
            </FetchedUserHoverCard>
            for their{" "}
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
