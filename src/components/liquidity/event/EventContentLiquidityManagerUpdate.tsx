import { shortenAddress } from "../../../libs/helpers.ts";
import { NavLink } from "react-router-dom";
import { ShortenAddress } from "../../ShortenAddress.tsx";
import { FetchedUserHoverCard } from "../../FetchedUserHoverCard.tsx";

export function EventContentLiquidityManagerUpdate(props: {
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
            Updated the manager to{" "}
            <span className="text-chinese-green">
              {shortenAddress(props.event.manager)}
            </span>
          </>
        )}

        {props.inTimeline && (
          <>
            Updated the manager of their{" "}
            <NavLink
              to={`/liquidity/${props.liquidity.marketAddress}/${props.liquidity.provider}/${props.liquidity.lid}`}
              className="text-chinese-green"
            >
              liquidity
            </NavLink>{" "}
            to{" "}
            <span className="text-chinese-green">
              <FetchedUserHoverCard
                address={props.event.manager}
                className="cursor-pointer"
              >
                <ShortenAddress
                  address={props.event.manager}
                  className="address-mention-decoration"
                />
              </FetchedUserHoverCard>
            </span>
          </>
        )}
      </span>
    </div>
  );
}
