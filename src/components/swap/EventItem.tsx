import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { isEqlStr, shortenAddress } from "../../libs/helpers.ts";
import { UserHoverCard } from "../liquidity/UserHoverCard.tsx";
import moment from "moment/moment";
import { Events } from "../../types/enums.ts";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import { useQuery } from "@tanstack/react-query";
import { ToolTip } from "../ToolTip.tsx";
import { isDisputed, isDisputeDraftee } from "../../libs/api_utils.ts";
import useConnector from "../../hooks/connectors/useConnector.tsx";

export function EventItem({ event, swap }: { event: Event; swap: Swap }) {
  const { getUser } = useUserService();
  const { address } = useConnector();
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
              {event.action == Events.SwapNew && (
                <span className="text-xs flex gap-1">Started the swap.</span>
              )}

              {/* Swap: Paid */}
              {event.action == Events.SwapPaid && (
                <span className="text-xs flex gap-1">
                  Marked swap as <b className="text-chinese-green">paid</b>.
                </span>
              )}

              {/* Swap: Released */}
              {event.action == Events.SwapReleased && (
                <span className="text-xs flex gap-1">
                  <b className="text-chinese-green">Released</b> the swap.
                </span>
              )}

              {/* Swap: Cancelled */}
              {event.action == Events.SwapCancelled && (
                <>
                  <span className="text-xs flex gap-1">
                    <b className="text-red-300">Cancelled</b> the swap.
                  </span>
                </>
              )}

              {/* Swap: Disputed */}
              {event.action == Events.SwapDisputed && (
                <>
                  <span className="text-xs flex gap-1">
                    Started a new dispute#{event.dispute.disputeId}.
                  </span>
                </>
              )}

              {/* Swap: Drafted */}
              {event.action == Events.SwapDrafted && (
                <>
                  <span className="text-xs flex gap-1">
                    Drafted as a mediator to dispute#{event.dispute.disputeId}.
                  </span>
                </>
              )}

              {/* Swap: Committed */}
              {event.action == Events.SwapCommitted && (
                <>
                  <span className="text-xs flex gap-1">
                    Committed their verdict for dispute#
                    {event.dispute.disputeId}.
                  </span>
                </>
              )}

              {/* Swap: Reveal */}
              {event.action == Events.SwapRevealed && (
                <>
                  <span className="text-xs flex gap-1">
                    Revealed their verdict for dispute#
                    {event.dispute.disputeId}.
                  </span>
                </>
              )}

              {/* Swap: Executed */}
              {event.action == Events.SwapExecuted && (
                <>
                  <span className="text-xs flex gap-1">
                    Dispute#{event.dispute.disputeId} has been executed.
                  </span>
                </>
              )}

              {/* Swap: Undrafted */}
              {event.action == Events.SwapUndrafted && (
                <>
                  <span className="text-xs flex gap-1">
                    Undrafted a mediator from dispute#{event.dispute.disputeId}.
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
