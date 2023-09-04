import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { formatToHighDenom, shortenAddress } from "../../libs/helpers.ts";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import { UserHoverCard } from "../liquidity/UserHoverCard.tsx";
import { Events } from "../../types/enums.ts";

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
              <>
                <span className="block mb-2">Created the offer to swap</span>
                <div className="flex flex-col xs:flex-row gap-1">
                  <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                    Amount:{" "}
                    {formatToHighDenom(
                      event.amount || "0",
                      event.market.baseDecimals
                    )}{" "}
                    {event.market.base}
                  </span>
                  <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                    Price:{" "}
                    {formatToHighDenom(
                      event.price || "0",
                      event.market.quoteDecimals
                    )}{" "}
                    {event.market.quote} / {event.market.base}
                  </span>
                </div>
              </>
            )}

            {/* Offer: Update */}
            {event.action == Events.OfferUpdate && (
              <>
                <span className="block mb-2">Updated the offer</span>
                <div className="flex flex-col xs:flex-row gap-1">
                  <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                    Amount:{" "}
                    {formatToHighDenom(
                      event.amount || "0",
                      event.market.baseDecimals
                    )}{" "}
                    {event.market.base}
                  </span>
                  <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                    Price:{" "}
                    {formatToHighDenom(
                      event.price || "0",
                      event.market.quoteDecimals
                    )}{" "}
                    {event.market.quote} / {event.market.base}
                  </span>
                </div>
              </>
            )}

            {/* Offer: Accepted */}
            {event.action == Events.OfferAccept && (
              <>
                <span className="block mb-2">Accepted the offer to swap</span>
                <div className="flex flex-col xs:flex-row gap-1">
                  <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                    Amount:{" "}
                    {formatToHighDenom(
                      event.amount || "0",
                      event.market.baseDecimals
                    )}{" "}
                    {event.market.base}
                  </span>
                  <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                    Price:{" "}
                    {formatToHighDenom(
                      event.price || "0",
                      event.market.quoteDecimals
                    )}{" "}
                    {event.market.quote} / {event.market.base}
                  </span>
                </div>
              </>
            )}

            {/* Offer: Unaccepted */}
            {event.action == Events.OfferUnaccept && (
              <>
                <span className="block mb-2">Rejected the offer to swap</span>
                <div className="flex flex-col xs:flex-row gap-1">
                  <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                    Amount:{" "}
                    {formatToHighDenom(
                      event.amount || "0",
                      event.market.baseDecimals
                    )}{" "}
                    {event.market.base}
                  </span>
                  <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                    Price:{" "}
                    {formatToHighDenom(
                      event.price || "0",
                      event.market.quoteDecimals
                    )}{" "}
                    {event.market.quote} / {event.market.base}
                  </span>
                </div>
              </>
            )}

            {/* Offer: Cancelled */}
            {event.action == Events.OfferCancel && (
              <>
                <span className="block mb-2">Cancelled the offer</span>
                <div className="flex flex-col xs:flex-row gap-1">
                  <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                    Amount:{" "}
                    {formatToHighDenom(
                      event.amount || "0",
                      event.market.baseDecimals
                    )}{" "}
                    {event.market.base}
                  </span>
                  <span className="text-[10px] relative text-gray-400 bg-gray-800 rounded-full px-2 py-[1px] pb-[3px]">
                    Price:{" "}
                    {formatToHighDenom(
                      event.price || "0",
                      event.market.quoteDecimals
                    )}{" "}
                    {event.market.quote} / {event.market.base}
                  </span>
                </div>
              </>
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
