import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { shortenAddress } from "../../libs/helpers.ts";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import { Events } from "../../types/enums.ts";
import { EventContentOfferCreate } from "./event/EventContentOfferCreate.tsx";
import { EventContentOfferUpdate } from "./event/EventContentOfferUpdate.tsx";
import { EventContentOfferAccept } from "./event/EventContentOfferAccept.tsx";
import { EventContentOfferUnaccept } from "./event/EventContentOfferUnaccept.tsx";
import { EventContentOfferCancel } from "./event/EventContentOfferCancel.tsx";
import { UserHoverCard } from "../UserHoverCard.tsx";

export default function OfferEvent({ event }: { event: Event }) {
  const { getUser } = useUserService();
  const user = useQuery({
    queryKey: ["getUser", { address: event.creator, noAuth: true }],
    queryFn: getUser,
    enabled: !!event,
  });

  return (
    <div className="flex gap-2 w-full md:w-[500px]">
      <div>
        <UserHoverCard user={user.data as User}>
          <EmojiAvatar size={AvatarSize.Medium} randomStr={event.creator} />
        </UserHoverCard>
      </div>
      <div className="flex flex-1 flex-col  bg-card-background rounded-xl rounded-tl-none border border-gray-800">
        <div className="flex justify-between border-b border-gray-800 p-2">
          <span className="text-gray-400 text-xs tracking-wide font-light">
            @{shortenAddress(event.creator)}
          </span>
          <span className="text-gray-400 font-light text-xs">
            {moment(event.createdAt).fromNow()}
          </span>
        </div>
        <div className="p-2 text-sm tracking-wide">
          <div className=" items-center text-gray-200 font-normal">
            {/* Offer: Create */}
            {event.action == Events.OfferCreate && (
              <EventContentOfferCreate
                amount={event.amount}
                market={event.market}
                price={event.price}
              />
            )}

            {/* Offer: Update */}
            {event.action == Events.OfferUpdate && (
              <EventContentOfferUpdate
                amount={event.amount}
                market={event.market}
                price={event.price}
              />
            )}

            {/* Offer: Accepted */}
            {event.action == Events.OfferAccept && (
              <EventContentOfferAccept
                amount={event.amount}
                market={event.market}
                price={event.price}
              />
            )}

            {/* Offer: Unaccepted */}
            {event.action == Events.OfferUnaccept && (
              <EventContentOfferUnaccept
                amount={event.amount}
                market={event.market}
                price={event.price}
              />
            )}

            {/* Offer: Cancelled */}
            {event.action == Events.OfferCancel && (
              <EventContentOfferCancel
                amount={event.amount}
                market={event.market}
                price={event.price}
              />
            )}
          </div>
          {/*<div className="mt-4">*/}
          {/*  <Button*/}
          {/*    variant="outline"*/}
          {/*    size="full"*/}
          {/*    className="border-gray-800 text-sm"*/}
          {/*  >*/}
          {/*    Accept*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
}
