import { DotsVerticalIcon, TimerIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Clock2Icon, LucideTimerOff, XCircle } from "lucide-react";
import moment from "moment/moment";
import { BaseSyntheticEvent, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import useCoreContract from "../../hooks/services/contracts/useCoreContract.ts";
import useStore from "../../hooks/store/useStore.ts";
import { useToast } from "../../hooks/useToast.tsx";
import {
  canExecuteOffer,
  isOfferExpired,
  isOfferPending,
  isOfferer,
} from "../../libs/api_utils.ts";
import {
  delay,
  formatToHighDenom,
  isDev,
  isMerchant,
  shortenAddress,
} from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { CountDown } from "../Countdown.tsx";
import { IDBadge } from "../IDBadge.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { USDAmountToolTip } from "../USDAmountToolTip.tsx";
import { UserHoverCard } from "../UserHoverCard.tsx";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import IconCopyFilled from "../icons/IconCopyFilled.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { InfoCard } from "../market/InfoCard.tsx";
import { MessengerSheet } from "../messenger/MessengerSheet.tsx";
import { ChatButton } from "../swap/ChatButton.tsx";
import { SwapOfferCreatorSheet } from "../swap/SwapOfferCreatorSheet.tsx";
import { Button } from "../ui/Button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { VerifiedBadge } from "./VerifiedBadge.tsx";

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
  const { address, getChainInfo } = useConnectorContext();
  const { notifySuccess, notifyError } = useToast();
  const [renderOfferCreatorSheet, setRenderOfferCreatorSheet] = useState(false);
  const { cancelOffer, acceptOffer, unacceptOffer, humanizeErrors } =
    useCoreContract();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const toggleOpenState = useStore((s) => s.toggleOpenState);
  const [disableButtons, setDisableButtons] = useState<ButtonEnableState>({
    accept: false,
    execute: false,
  });

  const getProvider = useQuery({
    queryKey: ["getUser", { address: offer.creator, noAuth: true }],
    queryFn: getUser,
    enabled: !!offer.creator,
  });

  async function doCancel() {
    try {
      setLoading(true);
      const [txHash] = await cancelOffer(BigInt(offer.offerId));
      await delay(5000);

      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Offer was successfully cancelled`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });

      if (location.pathname.includes("my/offers")) {
        await queryClient.refetchQueries(["getOffersAsParticipant"]);
      } else if (location.pathname.includes("/offer/")) {
        await queryClient.refetchQueries(["getOffer"]);
        await queryClient.refetchQueries(["getOfferEvents"]);
      } else if (location.pathname.match("/liquidity/.*/offers")) {
        await queryClient.refetchQueries(["getLiquidityOffers"]);
      }
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function doAccept() {
    try {
      setLoading(true);
      const [txHash] = await acceptOffer(BigInt(offer.offerId), BigInt(0));
      await delay(5000);

      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Offer was successfully accepted`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });

      if (location.pathname.includes("my/offers")) {
        await queryClient.refetchQueries(["getOffersAsParticipant"]);
      } else if (location.pathname.includes("/offer/")) {
        await queryClient.refetchQueries(["getOffer"]);
        await queryClient.refetchQueries(["getOfferEvents"]);
      } else if (location.pathname.match("/liquidity/.*/offers")) {
        await queryClient.refetchQueries(["getLiquidityOffers"]);
      }
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function doUnaccept() {
    try {
      setLoading(true);
      const [txHash] = await unacceptOffer(BigInt(offer.offerId));
      await delay(5000);

      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Offer was successfully unaccepted`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });

      if (location.pathname.includes("my/offers")) {
        await queryClient.refetchQueries(["getOffersAsParticipant"]);
      } else if (location.pathname.includes("/offer/")) {
        await queryClient.refetchQueries(["getOffer"]);
        await queryClient.refetchQueries(["getOfferEvents"]);
      } else if (location.pathname.match("/liquidity/.*/offers")) {
        await queryClient.refetchQueries(["getLiquidityOffers"]);
      }
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
    }
  }

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
          className,
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
                <EmojiAvatar
                  size={AvatarSize.Small}
                  randomStr={offer.creator}
                />
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
                  !offer.executed &&
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
                  <InfoCard
                    title={`Price (${offer.market.quote})`}
                    tip={`The offer price for 1 ${offer.market.base} in ${offer.market.quote}`}
                  >
                    <span className="flex gap-1" data-click-trigger="1">
                      {formatToHighDenom(
                        offer.price,
                        offer.market.quoteDecimals,
                      )}
                      <USDAmountToolTip v={offer.priceUsd} />
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`Amount (${offer.market.base})`}
                    tip={`The amount of ${offer.market.base} the offer creator wants (including swap fees).`}
                  >
                    <span
                      className="text-gray-200 flex gap-1"
                      data-click-trigger="1"
                    >
                      {formatToHighDenom(
                        offer.amount,
                        offer.market.baseDecimals,
                      )}
                      <USDAmountToolTip v={offer.amountUsd} />
                    </span>
                  </InfoCard>
                  {!offer.executed && !offer.cancelled && (
                    <InfoCard
                      title={isOfferExpired(offer) ? "Expired" : `Expires In`}
                      tip={`When the offer will expire`}
                    >
                      <ToolTip
                        tip={moment(offer.deadline).format(
                          "DD MMM YYYY, h:mm:ss a",
                        )}
                      >
                        <span
                          className="text-gray-200 text-sm flex gap-1 items-center"
                          data-click-trigger="1"
                        >
                          {!offer.cancelled && (
                            <>
                              <span>{moment(offer.deadline).fromNow()}</span>
                              <span>
                                <IconInfoCircle width="15" />
                              </span>
                            </>
                          )}
                        </span>
                      </ToolTip>
                    </InfoCard>
                  )}
                  {(offer.executed || offer.cancelled) && (
                    <InfoCard
                      title={`Status`}
                      tip={`The current status of the offer`}
                    >
                      <span
                        className="text-gray-200 text-sm flex gap-1 items-center"
                        data-click-trigger="1"
                      >
                        {offer.executed && "Executed"}
                        {offer.cancelled && "Cancelled"}
                      </span>
                    </InfoCard>
                  )}
                </div>
              </ScrollAreaHorizontal>
            </ScrollOverflowIndicator>
          </div>
        </div>

        {/* Level 2 */}
        <div
          data-click-trigger="1"
          className="border-t text-gray-400 border-gray-800 px-3 py-1 flex flex-col md:flex-row md:justify-between"
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
                <span className="duration-1000">
                  {!isOfferer(offer, address)
                    ? "Waiting for your acceptance"
                    : "Waiting for acceptance"}
                  .
                </span>
                <IconInfoCircle width="15" />
              </ToolTip>
            </span>
          )}

          {offer.accepted &&
            !offer.executed &&
            !offer.cancelled &&
            !isOfferExpired(offer) && (
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
                  <span className="duration-1000">
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
            className="flex justify-between py-1 text-[12px] text-gray-400 gap-1 items-center tracking-wide font-light"
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
            <span>
              <IDBadge id={offer.offerId} tip="Offer ID" />
            </span>
          </span>
        </div>

        {/* Level 3 */}
        <div
          data-click-trigger="1"
          className="flex justify-between border-t border-t-gray-800"
        >
          <div
            data-click-trigger="1"
            className="flex items-center w-full gap-2 px-1 overflow-hidden pr-1 py-1"
          >
            {/* offer is pending */}
            {address && isOfferPending(offer) && (
              <>
                {!isOfferer(offer, address) && (
                  <Button
                    size="sm"
                    rounded="lg"
                    className="min-w-[100px]  text-xs md:text-sm"
                    scale="sm"
                    disabled={disableButtons.accept || loading}
                    onClick={doAccept}
                  >
                    <span>
                      {!loading && (
                        <>
                          <span className="mr-1">Accept</span>
                          <CountDown
                            isoDate={offer.deadline}
                            onDone={() => {
                              setDisableButtons({
                                ...disableButtons,
                                accept: true,
                              });
                            }}
                          />
                        </>
                      )}
                      {loading && (
                        <IconSpinner
                          width="15"
                          className="animate-spin"
                          fill="fill-gray-800"
                        />
                      )}
                    </span>
                  </Button>
                )}
                {isOfferer(offer, address) && (
                  <Button
                    size="sm"
                    variant="outline"
                    rounded="lg"
                    className="min-w-[100px] text-xs md:text-sm hover:bg-background hover:text-white hover:border-gray-600"
                    scale="sm"
                    disabled={loading}
                    onClick={doCancel}
                  >
                    {!loading && "Cancel"}
                    {loading && (
                      <IconSpinner
                        width="15"
                        className="animate-spin"
                        fill="fill-gray-300"
                      />
                    )}
                  </Button>
                )}
              </>
            )}

            {/* offer is accepted */}
            {canExecuteOffer(offer) && (
              <>
                {!isOfferer(offer, address) && (
                  <Button
                    size="sm"
                    variant="outline"
                    rounded="lg"
                    className="min-w-[100px] text-xs md:text-sm hover:bg-background hover:text-white hover:border-gray-600"
                    scale="sm"
                    disabled={loading}
                    onClick={doUnaccept}
                  >
                    {!loading && "Unaccept"}
                    {loading && (
                      <IconSpinner
                        width="15"
                        className="animate-spin"
                        fill="fill-gray-300"
                      />
                    )}
                  </Button>
                )}
                {isOfferer(offer, address) && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      rounded="lg"
                      className="min-w-[100px]  text-xs md:text-sm"
                      scale="sm"
                      disabled={disableButtons.execute}
                      onClick={() => {
                        toggleOpenState?.("createOfferSheet");
                        setRenderOfferCreatorSheet(true);
                      }}
                    >
                      <span className="mr-1">Execute</span>
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
                      className="min-w-[100px] text-xs md:text-sm hover:bg-background hover:text-white hover:border-gray-600"
                      scale="sm"
                      disabled={loading}
                      onClick={doCancel}
                    >
                      {!loading && "Cancel"}
                      {loading && (
                        <IconSpinner
                          width="15"
                          className="animate-spin"
                          fill="fill-gray-300"
                        />
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* If offer is not executed and user is offerer, show edit button*/}
            {!offer.executed && !offer.cancelled && !isOfferExpired(offer) && (
              <>
                {isOfferer(offer, address) && (
                  <Button
                    size="sm"
                    variant="link"
                    rounded="lg"
                    className="text-xs text-gray-400 md:text-sm hover:bg-background hover:text-white hover:border-gray-600"
                    scale="sm"
                    onClick={() => {
                      toggleOpenState?.("createOfferSheet", undefined, "edit");
                      setRenderOfferCreatorSheet(true);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </>
            )}
          </div>

          <div
            data-click-trigger="1"
            className="flex items-center border-gray-800 shrink-0"
          >
            <span
              className={cn(
                "hidden md:inline border-gray-800 border-l shrink-0",
                {
                  "!hidden": !offer.swap || offer.swap.orderId == undefined,
                },
              )}
            >
              <NavLink to={`/swap/${offer.swap?.orderId}`}>
                <Button
                  variant="link"
                  rounded="none"
                  className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
                >
                  View Swap
                </Button>
              </NavLink>
            </span>
            <span
              className={cn(
                "hidden md:inline border-gray-800 border-l shrink-0",
                {
                  "!hidden": location.pathname.match("^/liquidity"),
                },
              )}
            >
              <NavLink
                to={`/liquidity/${offer.marketAddress}/${offer.provider}/${offer.lid}`}
              >
                <Button
                  variant="link"
                  rounded="none"
                  className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
                >
                  View Liquidity
                </Button>
              </NavLink>
            </span>

            <span
              className={cn("xl:hidden border-gray-800 border-l shrink-0", {
                "!hidden": location.pathname.match("^/liquidity"),
              })}
            >
              {offer && (
                <ChatButton
                  address={address}
                  offer={offer}
                  className="rounded-none text-gray-400 hover:bg-transparent hover:text-chinese-green font-light text-xs"
                />
              )}
            </span>

            <span className="lg:hidden border-l border-gray-800 shrink-0 ">
              <DropdownMenu
                onOpenChange={(open) => {
                  setMoreMenuOpen(open);
                }}
              >
                <DropdownMenuTrigger className="outline-0 ring-0">
                  <span
                    className={cn(
                      "px-2 py-3 outline-0 ring-0 flex gap-1  items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green",
                      { "scale-x-105 text-chinese-green": moreMenuOpen },
                    )}
                  >
                    <DotsVerticalIcon />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
                  {offer.swap && (
                    <NavLink to={`/swap/${offer.swap?.orderId}`}>
                      <DropdownMenuItem
                        className={cn("flex md:hidden gap-2", {
                          "!hidden":
                            !offer.swap || offer.swap.orderId == undefined,
                        })}
                      >
                        View Swap
                      </DropdownMenuItem>
                    </NavLink>
                  )}
                  <NavLink
                    to={`/liquidity/${offer.marketAddress}/${offer.provider}/${offer.lid}`}
                  >
                    <DropdownMenuItem
                      className={cn("flex md:hidden gap-2", {
                        "!hidden": location.pathname.match("^/liquidity"),
                      })}
                    >
                      View Liquidity
                    </DropdownMenuItem>
                  </NavLink>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </div>
        </div>
      </div>

      {offer && <MessengerSheet offer={offer} />}

      {renderOfferCreatorSheet && (
        <SwapOfferCreatorSheet liquidity={offer.liquidity} offer={offer} />
      )}
    </div>
  );
}
