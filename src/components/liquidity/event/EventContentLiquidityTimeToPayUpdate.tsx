import { cn } from "../../../libs/utils.ts";
import { NavLink } from "react-router-dom";

export function EventContentLiquidityTimeToPayUpdate(props: {
  event: Event;
  market: Market;
  className?: string;
  inTimeline?: boolean;
  liquidity: Liquidity;
}) {
  return (
    <div className={cn("flex flex-col gap-1", props.className)}>
      <span className="flex gap-1">
        {!props.inTimeline ? (
          "Updated the payment time to"
        ) : (
          <>
            Updated the payment time of their{" "}
            <NavLink
              to={`/liquidity/${props.liquidity.marketAddress}/${props.liquidity.provider}/${props.liquidity.lid}`}
              className="text-chinese-green"
            >
              liquidity
            </NavLink>{" "}
          </>
        )}
      </span>
      <div>
        <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
          Payment Time:{" "}
          {props.event.timeToPay < 60 && (
            <>
              {props.event.timeToPay} second
              {props.event.timeToPay > 1 ? "s" : ""}
            </>
          )}
          {props.event.timeToPay >= 60 && props.event.timeToPay < 3600 && (
            <>
              {props.event.timeToPay / 60} minute
              {props.event.timeToPay / 60 > 1 ? "s" : ""}
            </>
          )}
          {props.event.timeToPay >= 3600 && props.event.timeToPay < 86400 && (
            <>
              {props.event.timeToPay / 3600} hour
              {props.event.timeToPay / 3600 > 1 ? "s" : ""}
            </>
          )}
          {props.event.timeToPay >= 86400 && (
            <>
              {props.event.timeToPay / 86400} day
              {props.event.timeToPay / 86400 > 1 ? "s" : ""}
            </>
          )}
        </span>
      </div>
    </div>
  );
}
