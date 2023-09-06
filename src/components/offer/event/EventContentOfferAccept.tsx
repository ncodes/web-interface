import { formatToHighDenom } from "../../../libs/helpers.ts";
import { NavLink } from "react-router-dom";

export function EventContentOfferAccept(props: {
  amount: string;
  market: Market;
  price: string;
  liquidity: Liquidity;
  inTimeline?: boolean;
}) {
  return (
    <>
      <span className="block mb-2">
        {!props.inTimeline ? (
          <>Accepted the offer to swap</>
        ) : (
          <>
            Accepted an offer for their{" "}
            <NavLink
              to={`/liquidity/${props.liquidity.marketAddress}/${props.liquidity.provider}/${props.liquidity.lid}`}
              className="text-chinese-green"
            >
              liquidity
            </NavLink>
          </>
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
