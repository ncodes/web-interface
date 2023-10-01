import { BaseSyntheticEvent, useState } from "react";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { StatCard } from "../market/StatCard.tsx";
import { cn } from "../../libs/utils.ts";
import { Button } from "../ui/Button.tsx";
import { DotsVerticalIcon, TimerIcon } from "@radix-ui/react-icons";
import {
  CheckCircle,
  Clock2Icon,
  LucideTimerOff,
  MessageCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import { useQuery } from "@tanstack/react-query";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import {
  formatToHighDenom,
  isMerchant,
  shortenAddress,
} from "../../libs/helpers.ts";
import { VerifiedBadge } from "./VerifiedBadge.tsx";
import IconCopyFilled from "../icons/IconCopyFilled.tsx";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  isOfferer,
  isOfferExpired,
  isOfferPending,
} from "../../libs/api_utils.ts";
import moment from "moment/moment";
import IconSpinner from "../icons/IconSpinner.tsx";
import { CountDown } from "../Countdown.tsx";
import { USDAmountToolTip } from "../USDAmountToolTip.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { UserHoverCard } from "../UserHoverCard.tsx";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";

interface ButtonEnableState {
  accept: boolean;
  execute: boolean;
}

export function OfferRow({
  className,
  offer,
}: {
  offer: Offer;
  ownerMode?: boolean;
  className?: string;
}) {
  const navigate = useNavigate();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const { getUser } = useUserService();
  const { address } = useConnectorContext();
  const location = useLocation();
  const [disableButtons, setDisableButtons] = useState<ButtonEnableState>({
    accept: false,
    execute: false,
  });
  const getProvider = useQuery({
    queryKey: ["getUser", { address: offer.creator, noAuth: true }],
    queryFn: getUser,
    enabled: !!offer.creator,
  });

  return (
    <div
      onClick={(e: BaseSyntheticEvent) => {
        const canTrigger = e.target.getAttribute("data-click-trigger");
        if (canTrigger && canTrigger == "1") {
          navigate(`/offer/${offer.offerId}`);
        }
      }}
    >
      <div
        data-click-trigger="1"
        className={cn(
          "border bg-card-background border-card-border transition-all duration-300 rounded-xl hover:border-chinese-green cursor-pointer border-b-gray-600",
          className
        )}
      >
        {/* Level 1 */}
        <div className="flex flex-col md:flex-row" data-click-trigger="1">
          <div
            data-click-trigger="1"
            className="flex gap-2 p-5 px-3 py-0 items-center shrink-0 border-r border-gray-800"
          >
            <div data-click-trigger="1">
              <UserHoverCard user={getProvider.data as User}>
                <EmojiAvatar size={AvatarSize.Small} randomStr="abcen" />
              </UserHoverCard>
            </div>
            <div
              className="flex py-3 md:py-0 w-full md:w-auto  md:flex-col justify-start xxs:justify-between md:justify-start z-[6] xxs:items-center md:items-start gap-1"
              data-click-trigger="1"
            >
              <span data-click-trigger="1" className="flex gap-1 text-sm">
                {shortenAddress(offer.creator)}
                {isMerchant(getProvider?.data?.badges || []) && (
                  <div className="flex gap-1 font-light text-xs text-gray-400">
                    <VerifiedBadge />
                  </div>
                )}
                <span>
                  <CopyToClipboard text={offer.creator}>
                    <IconCopyFilled
                      width="13px"
                      className="text-gray-400 cursor-pointer hover:text-chinese-green transition-all duration-300 active:scale-90"
                    />
                  </CopyToClipboard>
                </span>
              </span>

              {/* STATUS */}
              <span className="flex items-center gap-1 text-xs font-light tracking-wider text-green-400">
                {isOfferPending(offer) && (
                  <span className="flex bg-gray-300/30 rounded-full px-[4px] text-xs items-center gap-1 font-medium tracking-wider text-gray-300">
                    <ToolTip className="flex items-center gap-1" tip="">
                      <Clock2Icon width="15" />{" "}
                      <span className="hidden xs:inline">Pending</span>
                      <IconInfoCircle
                        width="15"
                        className="hidden xs:inline text-gray-300"
                      />
                    </ToolTip>
                  </span>
                )}

                {offer.accepted &&
                  !offer.cancelled &&
                  !isOfferExpired(offer) && (
                    <span className="flex bg-yellow-300/30 rounded-full px-[4px] text-xs items-center gap-1 font-medium tracking-wider text-yellow-300">
                      <ToolTip
                        className="flex items-center gap-1"
                        tip="The offer was accepted"
                      >
                        <CheckCircle width="15" />{" "}
                        <span className="hidden xs:inline">Accepted</span>
                        <IconInfoCircle
                          width="15"
                          className="hidden xs:inline text-yellow-300"
                        />
                      </ToolTip>
                    </span>
                  )}

                {offer.cancelled && (
                  <span className="flex bg-red-300/30 rounded-full px-[4px] text-xs items-center gap-1 font-medium tracking-wider text-red-300">
                    <ToolTip
                      className="flex items-center gap-1"
                      tip="The offer was cancelled"
                    >
                      <XCircle width="15" />{" "}
                      <span className="hidden xs:inline">Cancelled</span>
                      <IconInfoCircle
                        width="15"
                        className="hidden xs:inline text-red-300"
                      />
                    </ToolTip>
                  </span>
                )}

                {offer.executed && (
                  <span className="flex bg-green-300/30 rounded-full px-[4px] text-xs items-center gap-1 font-medium tracking-wider text-green-300">
                    <ToolTip
                      className="flex items-center gap-1"
                      tip="The offer was executed"
                    >
                      <CheckCircle width="15" />{" "}
                      <span className="hidden xs:inline">Executed</span>
                      <IconInfoCircle
                        width="15"
                        className="hidden xs:inline text-green-300"
                      />
                    </ToolTip>
                  </span>
                )}

                {isOfferExpired(offer) && (
                  <span className="flex bg-red-300/30 rounded-full px-[4px] text-xs items-center gap-1 font-medium tracking-wider text-red-300">
                    <ToolTip
                      className="flex items-center gap-1"
                      tip="The offer has expired"
                    >
                      <LucideTimerOff width="15" />{" "}
                      <span className="hidden xs:inline">Expired</span>
                      <IconInfoCircle
                        width="15"
                        className="hidden xs:inline text-red-300"
                      />
                    </ToolTip>
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ScrollOverflowIndicator>
              <ScrollAreaHorizontal className="flex mr-[1px]">
                <div
                  className="flex-1 flex py-2 px-2 gap-2"
                  data-click-trigger="1"
                >
                  <StatCard
                    title={`Price (${offer.market.quote})`}
                    tip={`The offer price for 1 ${offer.market.base} in ${offer.market.quote}`}
                  >
                    <span className="flex gap-1" data-click-trigger="1">
                      {formatToHighDenom(
                        offer.price,
                        offer.market.quoteDecimals
                      )}
                      <USDAmountToolTip v={offer.priceUsd} />
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Amount`}
                    tip={`The amount of ${offer.market.base} being requested`}
                  >
                    <span
                      className="text-gray-200 flex gap-1"
                      data-click-trigger="1"
                    >
                      {formatToHighDenom(
                        offer.amount,
                        offer.market.baseDecimals
                      )}
                      <USDAmountToolTip v={offer.amountUsd} />
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Expires In`}
                    tip={`When the offer will expire`}
                  >
                    <ToolTip
                      tip={moment(offer.deadline).format(
                        "DD MMM YYYY, h:mm:ss a"
                      )}
                    >
                      <span
                        className="text-gray-200 flex gap-1 items-center"
                        data-click-trigger="1"
                      >
                        <span>{moment(offer.deadline).fromNow()}</span>
                        <span>
                          <IconInfoCircle width="15" />
                        </span>
                      </span>
                    </ToolTip>
                  </StatCard>
                </div>
              </ScrollAreaHorizontal>
            </ScrollOverflowIndicator>
          </div>
        </div>

        {/* Level 2 */}
        <div
          data-click-trigger="1"
          className="border-t border-gray-800 px-3 py-1 flex flex-col md:flex-row md:justify-between"
        >
          {address && isOfferPending(offer) && (
            <span
              data-click-trigger="1"
              className="flex gap-1 text-xs items-center font-light tracking-wide"
            >
              <IconSpinner width="15" className="animate-spin" />{" "}
              <ToolTip
                className="flex gap-1 w-full justify-between md:justify-start"
                tip={
                  !isOfferer(offer, address)
                    ? "Accept the offer to start a swap only if you like the terms."
                    : "Waiting for the liquidity provider to accept your offer."
                }
              >
                <span className="animate-pulse duration-1000">
                  {!isOfferer(offer, address)
                    ? "Waiting for your acceptance"
                    : "Waiting for acceptance"}
                  .
                </span>
                <IconInfoCircle width="15" />
              </ToolTip>
            </span>
          )}

          {offer.accepted && !offer.cancelled && !isOfferExpired(offer) && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <IconSpinner width="15" className="animate-spin" />{" "}
              <ToolTip
                className="flex gap-1 w-full justify-between md:justify-start"
                tip={
                  !isOfferer(offer, address)
                    ? "You accepted the offer. Now waiting for the offer creator to execute the offer which will start a new swap."
                    : "The liquidity provider accepted the offer. You can now execute the offer to start a swap."
                }
              >
                <span className="animate-pulse duration-1000">
                  {!isOfferer(offer, address)
                    ? "Waiting for offer execution"
                    : "Waiting for you to execute the offer"}
                  .
                </span>
                <IconInfoCircle width="15" />
              </ToolTip>
            </span>
          )}

          {offer.cancelled && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <XCircle width="15" />{" "}
              <ToolTip
                className="flex gap-1 w-full justify-between md:justify-start"
                tip={
                  !isOfferer(offer, address)
                    ? "The offer creator cancelled the offer."
                    : "You cancelled the offer."
                }
              >
                <span>
                  {!isOfferer(offer, address)
                    ? "Offer was cancelled"
                    : "You cancelled the offer"}
                  .
                </span>
                <IconInfoCircle width="15" />
              </ToolTip>
            </span>
          )}

          {offer.executed && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <CheckCircle width="15" />{" "}
              <ToolTip
                className="flex gap-1 w-full justify-between md:justify-start"
                tip={
                  !isOfferer(offer, address)
                    ? "The offer creator executed the offer. A new swap has been created."
                    : "You executed the offer. A new swap has been created."
                }
              >
                <span>
                  {!isOfferer(offer, address)
                    ? "Offer was executed"
                    : "You executed the offer"}
                  .
                </span>
                <IconInfoCircle width="15" />
              </ToolTip>
            </span>
          )}

          {isOfferExpired(offer) && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <LucideTimerOff width="15" />{" "}
              <ToolTip
                className="flex gap-1 w-full justify-between md:justify-start"
                tip={"The offer expired"}
              >
                <span className="duration-">
                  The offer exceeded the deadline.
                </span>
                <IconInfoCircle width="15" />
              </ToolTip>
            </span>
          )}

          <span
            data-click-trigger="1"
            className="flex py-1 text-[12px] text-gray-400 gap-1 items-center tracking-wide font-light"
          >
            <span className="text-gray-500">
              <ToolTip
                tip={"Updated: " + moment(offer.updatedAt).fromNow()}
                className="flex gap-1 items-center"
              >
                <span>
                  <TimerIcon />
                </span>
                <span>
                  {moment(offer.updatedAt)
                    .format("DD MMM YYYY, h:mm:ss a")
                    .toUpperCase()}
                </span>
              </ToolTip>
            </span>
          </span>
        </div>

        {/* Level 3 */}
        <div
          data-click-trigger="1"
          className="flex justify-between border-t border-card-border"
        >
          <div
            data-click-trigger="1"
            className="flex items-center w-full gap-2 px-1 overflow-hidden pr-1"
          >
            {/* offer is pending */}
            {address && isOfferPending(offer) && (
              <>
                {!isOfferer(offer, address) && (
                  <Button
                    size="sm"
                    rounded="lg"
                    className="rounded-tl-none text-xs md:text-sm"
                    scale="sm"
                    disabled={disableButtons.accept}
                  >
                    Accept{" "}
                    <CountDown
                      isoDate={offer.deadline}
                      onDone={() => {
                        setDisableButtons({ ...disableButtons, accept: true });
                      }}
                    />
                  </Button>
                )}
                {isOfferer(offer, address) && (
                  <Button
                    size="sm"
                    variant="outline"
                    rounded="lg"
                    className="text-xs md:text-sm hover:bg-background hover:text-white hover:border-gray-600"
                    scale="sm"
                  >
                    Cancel
                  </Button>
                )}
              </>
            )}

            {/* offer is accepted */}
            {offer.accepted && !offer.cancelled && !isOfferExpired(offer) && (
              <>
                {!isOfferer(offer, address) && (
                  <Button
                    size="sm"
                    variant="outline"
                    rounded="lg"
                    className="text-xs md:text-sm hover:bg-background hover:text-white hover:border-gray-600"
                    scale="sm"
                  >
                    Unaccept
                  </Button>
                )}
                {isOfferer(offer, address) && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      rounded="lg"
                      className="rounded-tl-none text-xs md:text-sm"
                      scale="sm"
                      disabled={disableButtons.execute}
                    >
                      Execute{" "}
                      <CountDown
                        isoDate={offer.deadline}
                        onDone={() => {
                          setDisableButtons({
                            ...disableButtons,
                            accept: true,
                          });
                        }}
                      />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      rounded="lg"
                      className="text-xs md:text-sm hover:bg-background hover:text-white hover:border-gray-600"
                      scale="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div
            data-click-trigger="1"
            className="flex items-center border-l border-gray-800 shrink-0 px-2"
          >
            <span
              className={cn(
                "hidden md:inline border-r border-gray-800 shrink-0",
                { "!hidden": !offer.swap }
              )}
            >
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                View Swap
              </Button>
            </span>
            <span
              className={cn(
                "hidden md:inline border-r border-gray-800 shrink-0",
                { "!hidden": location.pathname.match("^/liquidity") }
              )}
            >
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                View Liquidity
              </Button>
            </span>
            <span className="border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                <MessageCircle width="20px" />{" "}
                <span className="hidden md:inline">Message</span>
                <span className="hidden xs:inline md:hidden">Chat </span>
                <div className="rounded-full h-[20px] min-w-[20px] px-[5px] leading-[20px] flex justify-center items-center bg-red-600 text-[10px] text-white">
                  2
                </div>
              </Button>
            </span>

            <span className="lg:hidden ">
              <DropdownMenu
                onOpenChange={(open) => {
                  setMoreMenuOpen(open);
                }}
              >
                <DropdownMenuTrigger className="outline-0 ring-0">
                  <span
                    className={cn(
                      "px-2 py-3 outline-0 ring-0 flex gap-1  items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green",
                      { "scale-x-105 text-chinese-green": moreMenuOpen }
                    )}
                  >
                    <DotsVerticalIcon />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
                  <DropdownMenuItem
                    className={cn("flex md:hidden gap-2", {
                      "!hidden": !offer.swap,
                    })}
                  >
                    View Swap
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn("flex md:hidden gap-2", {
                      "!hidden": location.pathname.match("^/liquidity"),
                    })}
                  >
                    View Liquidity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
