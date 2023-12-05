import { shortenAddress } from "../../../libs/helpers.ts";
import { NavLink } from "react-router-dom";
import { FetchedUserHoverCard } from "../../FetchedUserHoverCard.tsx";
import { ShortenAddress } from "../../ShortenAddress.tsx";

export function EventContentLiquidityTargetUpdate(props: {
  event: Event;
  market: Market;
  className?: string;
  inTimeline?: boolean;
  liquidity: Liquidity;
}) {
  return (
    <div className={props.className}>
      <span className="flex gap-1 ">
        {!props.inTimeline && (
          <>
            Updated the target to{" "}
            <span className="text-chinese-green">
              {shortenAddress(props.event.target as unknown as string)}
            </span>
          </>
        )}

        {props.inTimeline && (
          <>
            Updated the target of their{" "}
            <NavLink
              to={`/liquidity/${props.liquidity.marketAddress}/${props.liquidity.provider}/${props.liquidity.lid}`}
              className="text-chinese-green"
            >
              liquidity
            </NavLink>{" "}
            to{" "}
            <span className="text-chinese-green">
              <FetchedUserHoverCard
                address={props.event.target as unknown as string}
                className="cursor-pointer"
              >
                <ShortenAddress
                  address={props.event.target as unknown as string}
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
