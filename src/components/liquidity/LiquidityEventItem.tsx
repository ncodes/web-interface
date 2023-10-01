import { Events } from "../../types/enums.ts";
import { useQuery } from "@tanstack/react-query";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { isEqlStr, shortenAddress } from "../../libs/helpers.ts";
import moment from "moment";
import { ToolTip } from "../ToolTip.tsx";
import { EventContentLiquidityAdd } from "./event/EventContentLiquidityAdd.tsx";
import { EventContentLiquidityRemove } from "./event/EventContentLiquidityRemove.tsx";
import { EventContentLiquiditySwap } from "./event/EventContentLiquiditySwap.tsx";
import { EventContentLiquidityNewOffer } from "./event/EventContentLiquidityNewOffer.tsx";
import { EventContentLiquidityPause } from "./event/EventContentLiquidityPause.tsx";
import { EventContentLiquidityManagerUpdate } from "./event/EventContentLiquidityManagerUpdate.tsx";
import { EventContentLiquidityTargetUpdate } from "./event/EventContentLiquidityTargetUpdate.tsx";
import { EventContentLiquidityPriceUpdate } from "./event/EventContentLiquidityPriceUpdate.tsx";
import { EventContentLiquiditySwapLimitUpdate } from "./event/EventContentLiquiditySwapLimitUpdate.tsx";
import { EventContentLiquidityTimeToPayUpdate } from "./event/EventContentLiquidityTimeToPayUpdate.tsx";
import { UserHoverCard } from "../UserHoverCard.tsx";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";

export function LiquidityEventItem({
  event,
  market,
  liquidity,
}: {
  event: Event;
  liquidity: Liquidity;
  market: Market;
}) {
  const { getUser } = useUserService();
  const { address } = useConnectorContext();
  const creator = useQuery({
    queryKey: ["getUser", { address: event.creator, noAuth: true }],
    queryFn: getUser,
    enabled: !!event.creator,
  });

  return (
    <div className="flex gap-2 tracking-wider  px-3 py-3 text-gray-200 font-light text-sm">
      <span className="shrink-0">
        <UserHoverCard user={creator.data as User}>
          <EmojiAvatar size={AvatarSize.Small} randomStr={event.creator} />
        </UserHoverCard>
      </span>
      <div className="w-full">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex gap-1 justify-between items-center">
                <span className="flex  gap-1 text-gray-400 font-light text-xs">
                  <UserHoverCard user={creator.data as User}>
                    @{shortenAddress(event.creator)}
                  </UserHoverCard>
                  {isEqlStr(address, event.creator) && (
                    <ToolTip tip="You">
                      <span className="bg-gray-700 rounded-sm px-[4px] pr-[2px] font-medium text-gray-400 text-[9px]">
                        YOU
                      </span>
                    </ToolTip>
                  )}
                  {isEqlStr(liquidity?.provider, event.creator) && (
                    <ToolTip tip="Liquidity Provider">
                      <span className="bg-chinese-green rounded-sm px-[4px] pr-[2px] font-medium text-gray-900 text-[9px]">
                        LP
                      </span>
                    </ToolTip>
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {moment(event.createdAt).fromNow()}
                </span>
              </div>

              {/* Liquidity: Add */}
              {event.action == Events.LiquidityAdd && (
                <EventContentLiquidityAdd event={event} market={market} />
              )}

              {/* Liquidity: Remove */}
              {event.action == Events.LiquidityRemove && (
                <EventContentLiquidityRemove event={event} market={market} />
              )}

              {/* Liquidity: Swap */}
              {event.action == Events.LiquiditySwap && (
                <EventContentLiquiditySwap swap={event.swap} market={market} />
              )}

              {/* Liquidity: New Offer */}
              {event.action == Events.LiquidityOffer && (
                <EventContentLiquidityNewOffer event={event} market={market} />
              )}

              {/* Liquidity: Pause */}
              {event.action == Events.LiquidityPause && (
                <EventContentLiquidityPause event={event} market={market} />
              )}

              {/* Liquidity: Manager Update */}
              {event.action == Events.LiquidityManagerUpdate && (
                <EventContentLiquidityManagerUpdate
                  event={event}
                  market={market}
                />
              )}

              {/* Liquidity: Target Update */}
              {event.action == Events.LiquidityTargetUpdate && (
                <EventContentLiquidityTargetUpdate
                  event={event}
                  market={market}
                />
              )}

              {/* Liquidity: Price Update */}
              {event.action == Events.LiquidityPriceUpdate && (
                <EventContentLiquidityPriceUpdate
                  event={event}
                  market={market}
                />
              )}

              {/* Liquidity: Min/Max Swap */}
              {event.action == Events.LiquiditySwapLimitUpdate && (
                <EventContentLiquiditySwapLimitUpdate
                  event={event}
                  market={market}
                />
              )}

              {/* Liquidity: Time To Pay Update */}
              {event.action == Events.LiquidityTimeToPayUpdate && (
                <EventContentLiquidityTimeToPayUpdate
                  event={event}
                  market={market}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
