import { Events } from "../../types/enums.ts";
import { UserHoverCard } from "./UserHoverCard.tsx";
import { useQuery } from "@tanstack/react-query";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import {
  formatToHighDenom,
  formatToMoney,
  isEqlStr,
  shortenAddress,
} from "../../libs/helpers.ts";
import moment from "moment";

export function ActivityItem({
  event,
  market,
  liquidity,
}: {
  event: Event;
  liquidity: Liquidity;
  market: Market;
}) {
  const { getUser } = useUserService();
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
                  {isEqlStr(liquidity?.provider, event.creator) && (
                    <span className="bg-chinese-green rounded-sm px-[4px] pr-[2px] font-medium text-gray-900 text-[9px]">
                      LP
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {moment(event.createdAt).fromNow()}
                </span>
              </div>

              {/* Liquidity: Add */}
              {event.action == Events.LiquidityAdd && (
                <>
                  <span className="text-xs flex gap-1">
                    <span>Added</span>
                    <span className="text-chinese-green">
                      {formatToHighDenom(
                        event.amount || "0",
                        market.baseDecimals
                      )}{" "}
                      {market.base}{" "}
                    </span>
                    <span>liquidity</span>
                  </span>
                  <div>
                    <span className="text-xs relative -left-[8px] text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                      Price:{" "}
                      {formatToHighDenom(
                        event.price || "0",
                        market.quoteDecimals
                      )}{" "}
                      {market.quote} / {market.base}
                    </span>
                  </div>
                </>
              )}

              {/* Liquidity: Remove */}
              {event.action == Events.LiquidityRemove && (
                <>
                  <span className="text-xs flex gap-1">
                    <span>Removed</span>
                    <span className="text-chinese-green">
                      {formatToHighDenom(
                        event.amount || "0",
                        market.baseDecimals
                      )}
                      &nbsp;
                      {market.base}{" "}
                    </span>
                    <span>from liquidity</span>
                  </span>
                </>
              )}

              {/* Liquidity: Swap */}
              {event.action == Events.LiquiditySwap && (
                <>
                  <span className="text-xs flex gap-1">
                    <span>Swapped</span>
                    <span className="text-chinese-green">
                      {formatToHighDenom(
                        event.swap.amount || "0",
                        market.baseDecimals
                      )}{" "}
                      {market.base}{" "}
                    </span>
                    <span>liquidity for</span>
                    <span className="text-chinese-green">
                      {formatToMoney(event.swap.cost || "0")} {market.quote}
                    </span>
                  </span>
                  <div>
                    <span className="text-xs relative -left-[8px] text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                      Price:{" "}
                      {formatToHighDenom(
                        event.swap.price || "0",
                        market.quoteDecimals
                      )}{" "}
                      {market.quote} / {market.base}
                    </span>
                  </div>
                </>
              )}

              {/* Liquidity: New Offer */}
              {event.action == Events.LiquidityOffer && (
                <>
                  <span className="text-xs flex gap-1">
                    <span>Offered</span>
                    <span className="text-chinese-green">
                      {formatToHighDenom(
                        event.offer.price || "0",
                        market.quoteDecimals
                      )}{" "}
                      {market.quote}{" "}
                    </span>
                    <span>for</span>
                    <span className="text-chinese-green">
                      {formatToHighDenom(
                        event.offer.amount || "0",
                        market.baseDecimals
                      )}{" "}
                      {market.base}
                    </span>
                  </span>
                  <div>
                    <span className="text-xs relative -left-[8px] text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                      {moment(event.offer.deadline).isAfter(moment()) ? (
                        <span>
                          Expiring: {moment(event.offer.deadline).fromNow()}
                        </span>
                      ) : (
                        <span>
                          Expired: {moment(event.offer.deadline).fromNow()}
                        </span>
                      )}
                    </span>
                  </div>
                </>
              )}

              {/* Liquidity: Pause */}
              {event.action == Events.LiquidityPause && (
                <>
                  <span className="text-xs flex gap-1">
                    {event.paused ? <span>Paused</span> : <span>Unpaused</span>}{" "}
                    the liquidity.
                  </span>
                </>
              )}

              {/* Liquidity: Manager Update */}
              {event.action == Events.LiquidityManagerUpdate && (
                <>
                  <span className="text-xs flex gap-1">
                    Updated the manager to{" "}
                    <span className="text-chinese-green">
                      {shortenAddress(event.manager)}
                    </span>
                  </span>
                </>
              )}

              {/* Liquidity: Target Update */}
              {event.action == Events.LiquidityTargetUpdate && (
                <>
                  <span className="text-xs flex gap-1">
                    Updated the target to{" "}
                    <span className="text-chinese-green">
                      {shortenAddress(event.target as unknown as string)}
                    </span>
                  </span>
                </>
              )}

              {/* Liquidity: Price Update */}
              {event.action == Events.LiquidityPriceUpdate && (
                <>
                  <span className="text-xs flex gap-1">
                    Updated the price to{" "}
                    <span className="text-chinese-green">
                      {formatToHighDenom(
                        event.price || "0",
                        market.quoteDecimals
                      )}{" "}
                      {market.quote} / {market.base}
                    </span>
                  </span>
                </>
              )}

              {/* Liquidity: Min/Max Swap */}
              {event.action == Events.LiquiditySwapLimitUpdate && (
                <>
                  <span className="text-xs flex gap-1">
                    <span>Updated the swap amount limit</span>
                  </span>
                  <div>
                    <span className="text-xs relative -left-[8px] text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                      Min:{" "}
                      {formatToHighDenom(
                        event.minSwap || "0",
                        market.baseDecimals
                      )}{" "}
                      {market.base}
                    </span>
                    &nbsp;
                    <span className="text-xs relative -left-[8px] text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                      Max:{" "}
                      {formatToHighDenom(
                        event.maxSwap || "0",
                        market.baseDecimals
                      )}{" "}
                      {market.base}
                    </span>
                  </div>
                </>
              )}

              {/* Liquidity: Time To Pay Update */}
              {event.action == Events.LiquidityTimeToPayUpdate && (
                <>
                  <span className="text-xs flex gap-1">
                    Updated the payment time to{" "}
                    <span className="text-chinese-green">
                      {event.timeToPay < 60 && (
                        <>
                          {event.timeToPay} second
                          {event.timeToPay > 1 ? "s" : ""}
                        </>
                      )}
                      {event.timeToPay >= 60 && event.timeToPay < 3600 && (
                        <>
                          {event.timeToPay / 60} minute
                          {event.timeToPay / 60 > 1 ? "s" : ""}
                        </>
                      )}
                      {event.timeToPay >= 3600 && event.timeToPay < 86400 && (
                        <>
                          {event.timeToPay / 3600} hour
                          {event.timeToPay / 3600 > 1 ? "s" : ""}
                        </>
                      )}
                      {event.timeToPay >= 86400 && (
                        <>
                          {event.timeToPay / 86400} day
                          {event.timeToPay / 86400 > 1 ? "s" : ""}
                        </>
                      )}
                    </span>
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
