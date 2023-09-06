import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { shortenAddress } from "../../libs/helpers.ts";
import moment from "moment";
import { Events } from "../../types/enums.ts";
import { EventContentSwapPaid } from "../swap/event/EventContentSwapPaid.tsx";
import { EventContentSwapReleased } from "../swap/event/EventContentSwapReleased.tsx";
import { EventContentSwapCancelled } from "../swap/event/EventContentSwapCancelled.tsx";
import { EventContentSwapDisputed } from "../swap/event/EventContentSwapDisputed.tsx";
import { EventContentSwapDrafted } from "../swap/event/EventContentSwapDrafted.tsx";
import { EventContentSwapCommitted } from "../swap/event/EventContentSwapCommitted.tsx";
import { EventContentSwapRevealed } from "../swap/event/EventContentSwapRevealed.tsx";
import { EventContentSwapExecuted } from "../swap/event/EventContentSwapExecuted.tsx";
import { EventContentSwapUndrafted } from "../swap/event/EventContentSwapUndrafted.tsx";
import { EventContentLiquidityAdd } from "../liquidity/event/EventContentLiquidityAdd.tsx";
import { EventContentLiquidityRemove } from "../liquidity/event/EventContentLiquidityRemove.tsx";
import { EventContentLiquiditySwap } from "../liquidity/event/EventContentLiquiditySwap.tsx";
import { EventContentLiquidityNewOffer } from "../liquidity/event/EventContentLiquidityNewOffer.tsx";
import { EventContentLiquidityPause } from "../liquidity/event/EventContentLiquidityPause.tsx";
import { EventContentLiquidityManagerUpdate } from "../liquidity/event/EventContentLiquidityManagerUpdate.tsx";
import { EventContentLiquidityTargetUpdate } from "../liquidity/event/EventContentLiquidityTargetUpdate.tsx";
import { EventContentLiquidityPriceUpdate } from "../liquidity/event/EventContentLiquidityPriceUpdate.tsx";
import { EventContentLiquiditySwapLimitUpdate } from "../liquidity/event/EventContentLiquiditySwapLimitUpdate.tsx";
import { EventContentLiquidityTimeToPayUpdate } from "../liquidity/event/EventContentLiquidityTimeToPayUpdate.tsx";
import { EventContentOfferCreate } from "../offer/event/EventContentOfferCreate.tsx";
import { EventContentOfferUpdate } from "../offer/event/EventContentOfferUpdate.tsx";
import { EventContentOfferAccept } from "../offer/event/EventContentOfferAccept.tsx";
import { EventContentOfferUnaccept } from "../offer/event/EventContentOfferUnaccept.tsx";
import { EventContentOfferCancel } from "../offer/event/EventContentOfferCancel.tsx";
import { useQuery } from "@tanstack/react-query";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";

import { UserHoverCard } from "../UserHoverCard.tsx";

export default function TimelineEvent({ event }: { event: Event }) {
  const { getUser } = useUserService();
  const creator = useQuery({
    queryKey: ["getUser", { address: event.creator, noAuth: true }],
    queryFn: getUser,
    enabled: !!event.creator,
  });

  return (
    <div className="flex gap-2 w-full md:w-[500px]">
      <div>
        <UserHoverCard user={creator.data as User}>
          <EmojiAvatar size={AvatarSize.Medium} randomStr={event.creator} />
        </UserHoverCard>
      </div>
      <div className="flex flex-1 flex-col gap-1 bg-card-background rounded-xl rounded-tl-none border border-gray-800">
        <div className="flex justify-between border-b border-gray-800 p-2">
          <span className="text-gray-500 text-sm font-light">
            @{shortenAddress(event.creator)}
          </span>
          <span className="text-gray-400 font-light text-xs">
            {moment(event.createdAt).fromNow()}
          </span>
        </div>
        <div className="px-2 pb-2 text-sm">
          {/* Swap: Paid */}
          {event.action == Events.SwapPaid && (
            <EventContentSwapPaid inTimeline />
          )}

          {/* Swap: Released */}
          {event.action == Events.SwapReleased && (
            <EventContentSwapReleased inTimeline />
          )}

          {/* Swap: Cancelled */}
          {event.action == Events.SwapCancelled && (
            <EventContentSwapCancelled inTimeline />
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

          {/* Liquidity: Add */}
          {event.action == Events.LiquidityAdd && (
            <EventContentLiquidityAdd
              event={event}
              market={event.market}
              liquidity={event.liquidity}
              inTimeline
            />
          )}

          {/* Liquidity: Remove */}
          {event.action == Events.LiquidityRemove && (
            <EventContentLiquidityRemove
              event={event}
              market={event.market}
              liquidity={event.liquidity}
              inTimeline
            />
          )}

          {/* Liquidity: Swap */}
          {event.action == Events.LiquiditySwap && (
            <EventContentLiquiditySwap
              swap={event.swap}
              market={event.market}
              liquidity={event.liquidity}
              inTimeline
            />
          )}

          {/* Liquidity: New Offer */}
          {event.action == Events.LiquidityOffer && (
            <EventContentLiquidityNewOffer
              event={event}
              market={event.market}
              liquidity={event.liquidity}
              inTimeline
            />
          )}

          {/* Liquidity: Pause */}
          {event.action == Events.LiquidityPause && (
            <EventContentLiquidityPause
              event={event}
              market={event.market}
              inTimeline
            />
          )}

          {/* Liquidity: Manager Update */}
          {event.action == Events.LiquidityManagerUpdate && (
            <EventContentLiquidityManagerUpdate
              event={event}
              market={event.market}
              liquidity={event.liquidity}
              inTimeline
            />
          )}

          {/* Liquidity: Target Update */}
          {event.action == Events.LiquidityTargetUpdate && (
            <EventContentLiquidityTargetUpdate
              event={event}
              market={event.market}
              liquidity={event.liquidity}
              inTimeline
            />
          )}

          {/* Liquidity: Price Update */}
          {event.action == Events.LiquidityPriceUpdate && (
            <EventContentLiquidityPriceUpdate
              event={event}
              market={event.market}
              liquidity={event.liquidity}
              inTimeline
            />
          )}

          {/* Liquidity: Min/Max Swap */}
          {event.action == Events.LiquiditySwapLimitUpdate && (
            <EventContentLiquiditySwapLimitUpdate
              event={event}
              market={event.market}
              liquidity={event.liquidity}
              inTimeline
            />
          )}

          {/* Liquidity: Time To Pay Update */}
          {event.action == Events.LiquidityTimeToPayUpdate && (
            <EventContentLiquidityTimeToPayUpdate
              event={event}
              market={event.market}
              liquidity={event.liquidity}
              inTimeline
            />
          )}

          {/* Offer: Create */}
          {event.action == Events.OfferCreate && (
            <EventContentOfferCreate
              amount={event.amount}
              market={event.market}
              liquidity={event.offer.liquidity}
              price={event.price}
              inTimeline
            />
          )}

          {/* Offer: Update */}
          {event.action == Events.OfferUpdate && (
            <EventContentOfferUpdate
              amount={event.amount}
              market={event.market}
              liquidity={event.offer.liquidity}
              price={event.price}
              inTimeline
            />
          )}

          {/* Offer: Accepted */}
          {event.action == Events.OfferAccept && (
            <EventContentOfferAccept
              amount={event.amount}
              market={event.market}
              price={event.price}
              liquidity={event.offer.liquidity}
              inTimeline
            />
          )}

          {/* Offer: Unaccepted */}
          {event.action == Events.OfferUnaccept && (
            <EventContentOfferUnaccept
              amount={event.amount}
              market={event.market}
              price={event.price}
              offer={event.offer}
              liquidity={event.offer.liquidity}
              inTimeline
            />
          )}

          {/* Offer: Cancelled */}
          {event.action == Events.OfferCancel && (
            <EventContentOfferCancel
              amount={event.amount}
              market={event.market}
              price={event.price}
              liquidity={event.offer.liquidity}
              inTimeline
            />
          )}

          {/*<div className="mt-4">*/}
          {/*  <Button*/}
          {/*    variant="outline"*/}
          {/*    size="full"*/}
          {/*    className="border-gray-800 text-sm"*/}
          {/*  >*/}
          {/*    View Liquidity*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
}
