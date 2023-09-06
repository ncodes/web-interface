import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { isEqlStr, shortenAddress } from "../../libs/helpers.ts";
import moment from "moment/moment";
import { Events } from "../../types/enums.ts";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import { useQuery } from "@tanstack/react-query";
import { ToolTip } from "../ToolTip.tsx";
import { isDisputed, isDisputeDraftee } from "../../libs/api_utils.ts";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import { EventContentSwapNew } from "./event/EventContentSwapNew.tsx";
import { EventContentSwapPaid } from "./event/EventContentSwapPaid.tsx";
import { EventContentSwapReleased } from "./event/EventContentSwapReleased.tsx";
import { EventContentSwapCancelled } from "./event/EventContentSwapCancelled.tsx";
import { EventContentSwapDisputed } from "./event/EventContentSwapDisputed.tsx";
import { EventContentSwapDrafted } from "./event/EventContentSwapDrafted.tsx";
import { EventContentSwapCommitted } from "./event/EventContentSwapCommitted.tsx";
import { EventContentSwapRevealed } from "./event/EventContentSwapRevealed.tsx";
import { EventContentSwapExecuted } from "./event/EventContentSwapExecuted.tsx";
import { EventContentSwapUndrafted } from "./event/EventContentSwapUndrafted.tsx";
import { UserHoverCard } from "../UserHoverCard.tsx";

export function EventItem({ event, swap }: { event: Event; swap: Swap }) {
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
            <div className="flex flex-col gap-1 w-full font-normal">
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
                  {isEqlStr(swap.liquidity.provider, event.creator) && (
                    <ToolTip tip="Liquidity Provider">
                      <span className="bg-chinese-green rounded-sm px-[4px] pr-[2px] font-medium text-gray-900 text-[9px]">
                        LP
                      </span>
                    </ToolTip>
                  )}
                  {isDisputed(swap) &&
                    isDisputeDraftee(swap.disputes[0], event.creator) && (
                      <ToolTip tip="Mediator">
                        <span className="bg-chinese-green rounded-sm px-[4px] pr-[2px] font-medium text-gray-900 text-[9px]">
                          M
                        </span>
                      </ToolTip>
                    )}
                </span>
                <span className="text-xs text-gray-500">
                  {moment(event.createdAt).fromNow()}
                </span>
              </div>

              {/* Swap: New */}
              {event.action == Events.SwapNew && <EventContentSwapNew />}

              {/* Swap: Paid */}
              {event.action == Events.SwapPaid && <EventContentSwapPaid />}

              {/* Swap: Released */}
              {event.action == Events.SwapReleased && (
                <EventContentSwapReleased />
              )}

              {/* Swap: Cancelled */}
              {event.action == Events.SwapCancelled && (
                <EventContentSwapCancelled />
              )}

              {/* Swap: Disputed */}
              {event.action == Events.SwapDisputed && (
                <EventContentSwapDisputed dispute={event.dispute} />
              )}

              {/* Swap: Drafted */}
              {event.action == Events.SwapDrafted && (
                <EventContentSwapDrafted dispute={event.dispute} />
              )}

              {/* Swap: Committed */}
              {event.action == Events.SwapCommitted && (
                <EventContentSwapCommitted dispute={event.dispute} />
              )}

              {/* Swap: Reveal */}
              {event.action == Events.SwapRevealed && (
                <EventContentSwapRevealed dispute={event.dispute} />
              )}

              {/* Swap: Executed */}
              {event.action == Events.SwapExecuted && (
                <EventContentSwapExecuted dispute={event.dispute} />
              )}

              {/* Swap: Undrafted */}
              {event.action == Events.SwapUndrafted && (
                <EventContentSwapUndrafted dispute={event.dispute} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
