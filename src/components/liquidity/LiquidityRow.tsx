import { DotsVerticalIcon, TimerIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ChevronRight,
  CircleSlash,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import moment from "moment";
import { BaseSyntheticEvent, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import useStore from "../../hooks/store/useStore.ts";
import {
  approxNumber,
  cleanBadgeName,
  formatToHighDenom,
  isMerchant,
  shortenAddress,
} from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { IDBadge } from "../IDBadge.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { USDAmountToolTip } from "../USDAmountToolTip.tsx";
import { UserHoverCard } from "../UserHoverCard.tsx";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { PairAvatar } from "../avatar/PairAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { BadgePill } from "../badge/BadgePill.tsx";
import IconCaution from "../icons/IconCaution.tsx";
import IconEdit from "../icons/IconEdit.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { IconMarket } from "../icons/IconMarket.tsx";
import { IconMessageReceived } from "../icons/IconMessageReceived.tsx";
import IconOffer from "../icons/IconOffer.tsx";
import IconReview from "../icons/IconReview.tsx";
import { IconSettingsOutline } from "../icons/IconSettingsOutline.tsx";
import { FollowLiquidity } from "../market/FollowLiquidity.tsx";
import { InfoCard } from "../market/InfoCard.tsx";
import { PriceChange } from "../market/PriceChange.tsx";
import { SwapOfferCreatorSheet } from "../swap/SwapOfferCreatorSheet.tsx";
import { SwapSheet } from "../swap/SwapSheet.tsx";
import { Button } from "../ui/Button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { Skeleton } from "../ui/skeleton.tsx";
import { ManageLiquiditySheet } from "./ManageLiquiditySheet.tsx";
import { VerifiedBadge } from "./VerifiedBadge.tsx";

function ProviderInfoSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="w-full h-5"></Skeleton>
      <Skeleton className="w-8/12 h-5"></Skeleton>
    </div>
  );
}

export function LiquidityRow({
  ownerMode,
  noFocus,
  className,
  liquidity,
  onFollowUpdate,
}: {
  ownerMode?: boolean;
  noFocus?: boolean;
  className?: string;
  liquidity: Liquidity;
  onFollowUpdate?: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const isVirtualWallet = useStore((state) => state.isVirtualWallet);
  const [openManageLiquiditySheet, setOpenManageLiquiditySheet] =
    useState(false);
  const restricted = useStore((state) => state.restricted);
  const [openSwapSheet, setOpenSwapSheet] = useState(false);
  const contractsParams = useStore((state) => state.contractsParams);
  const { toggleOpenState } = useStore((state) => ({
    openState: state.openState,
    toggleOpenState: state.toggleOpenState,
  }));
  const { getUser } = useUserService();
  const getProvider = useQuery({
    queryKey: [
      "getUser",
      { addressOrUserId: liquidity.provider, noAuth: true },
    ],
    queryFn: getUser,
    enabled: !!liquidity.provider,
  });

  function isLiquidityPaused(liquidity: Liquidity): [boolean, string] {
    if (liquidity.openOrders >= (contractsParams.core?.maxOpenOrders ?? 0)) {
      return [
        true,
        `Max. (${contractsParams.core?.maxOpenOrders}) open orders reached. Cannot accept new orders until open orders are concluded.`,
      ];
    }

    if (
      liquidity.openDisputes >= (contractsParams.core?.maxOpenDisputes ?? 0)
    ) {
      return [
        true,
        `Max. (${contractsParams.core?.maxOpenDisputes}) open disputes reached. Cannot accept new orders until open disputes are resolved.`,
      ];
    }

    if (liquidity.paused) {
      return [
        true,
        "This liquidity is paused and cannot accept new orders until unpaused.",
      ];
    }

    return [false, ""];
  }

  let reason = "";
  const pausedCheck = isLiquidityPaused(liquidity);
  if (pausedCheck[0]) {
    reason = pausedCheck[1];
  }

  if (liquidity.amount == "0") {
    reason = "This liquidity holds zero (0) " + liquidity.base + ". ";
    if (ownerMode) {
      reason += "Add liquidity to begin accepting swaps.";
    }
  }

  return (
    <div
      className="select-none"
      onClick={(e: BaseSyntheticEvent) => {
        const canTrigger = e.target.getAttribute("data-click-trigger");
        if (canTrigger && canTrigger == "1" && !noFocus) {
          navigate(
            `/liquidity/${liquidity.marketAddress}/${liquidity.provider}/${liquidity.lid}`
          );
        }
      }}
    >
      <div
        data-click-trigger="1"
        className={cn(
          "border bg-card-background xborder-card-border border-chinese-green  transition-all duration-300 xborder-b-gray-600 rounded-xl",
          {
            "hover:border-chinese-green cursor-pointer": !noFocus,
          },
          className
        )}
      >
        <div className="flex flex-col md:flex-row" data-click-trigger="1">
          <div
            data-click-trigger="1"
            className="md:w-[220px] flex gap-2 px-3 py-0 items-center shrink-0 border-r border-gray-800"
          >
            <div data-click-trigger="1">
              {!ownerMode && (
                <UserHoverCard
                  user={getProvider.data as User}
                  liquidity={liquidity}
                >
                  <EmojiAvatar
                    size={AvatarSize.Small}
                    randomStr={liquidity.provider}
                  />
                </UserHoverCard>
              )}

              {ownerMode && (
                <PairAvatar
                  base={liquidity?.market?.base}
                  quote={liquidity?.market.quote}
                  baseSrc={liquidity?.market.baseLogo}
                  quoteSrc={liquidity?.market.quoteLogo}
                />
              )}
            </div>
            <div
              className="flex py-3 md:py-0 w-full md:w-auto flex-col xxs:flex-row md:flex-col justify-start xxs:justify-between md:justify-start z-[6] xxs:items-center md:items-start"
              data-click-trigger="1"
            >
              {getProvider.isError && !getProvider.isLoading && (
                <div className="w-[130px]">
                  <div className="flex text-xs items-center gap-1 text-red-500">
                    <IconCaution
                      width="20"
                      height="20"
                      fillA="#ed3d2d"
                      fillB="#000000"
                    />
                    <span>Error</span>
                  </div>
                </div>
              )}

              {getProvider.isLoading && (
                <div className="w-[130px]">
                  <ProviderInfoSkeleton />
                </div>
              )}

              {!ownerMode && !getProvider.isLoading && !getProvider.isError && (
                <div
                  data-click-trigger="1"
                  className="w-full md:w-[150px] flex gap-1 items-center md:items-start md:flex-col justify-between md:justify-start"
                >
                  <span
                    data-click-trigger="1"
                    className="flex text-gray-100 items-center gap-1"
                  >
                    <span
                      data-click-trigger="1"
                      className="flex text-sm items-center gap-2"
                    >
                      <span>{shortenAddress(liquidity.provider)}</span>
                      {liquidity.online && (
                        <ToolTip tip="Online">
                          <span className="flex items-center gap-1 text-green-400">
                            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                            <span className="font-light text-[10px]">on</span>
                          </span>
                        </ToolTip>
                      )}
                      {!liquidity.online && (
                        <ToolTip
                          tip={`Last Seen: ${moment(
                            liquidity.lastTimeOnline
                          ).fromNow()}`}
                        >
                          <span className="flex items-center gap-1 text-gray-400">
                            <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                          </span>
                        </ToolTip>
                      )}
                    </span>
                    {isMerchant(getProvider.data?.badges || []) && (
                      <VerifiedBadge />
                    )}
                  </span>
                  <ToolTip tip="Click to open reviews">
                    <div className="flex items-center gap-1 text-yellow-200">
                      <span>
                        <IconReview width="15px" />
                      </span>
                      <Button
                        variant="link"
                        onClick={() => {
                          toggleOpenState(
                            "reviewSheet",
                            undefined,
                            liquidity.provider
                          );
                        }}
                        className="text-blue-200 p-0 h-auto text-xs font-light hover:text-chinese-green/80 hover:underline decoration-dashed decoration-1 underline-offset-4 -mt-1"
                      >
                        {getProvider.data?.completionRate}% (
                        {approxNumber(getProvider.data?.totalSwaps)} swap
                        {(getProvider.data?.totalSwaps as number) > 1
                          ? "s"
                          : ""}
                        )
                      </Button>
                    </div>
                  </ToolTip>
                </div>
              )}

              {ownerMode && !getProvider.isLoading && (
                <div
                  data-click-trigger="1"
                  className="w-full md:w-[100px] flex gap-1 justify-between items-center md:items-start md:justify-start md:flex-col"
                >
                  <span
                    data-click-trigger="1"
                    className="flex text-xs xs:text-[16px]"
                  >
                    {liquidity.base}
                    <span className="text-gray-500 inline-block mx-1">/</span>
                    {liquidity.quote}
                  </span>

                  {pausedCheck[0] && liquidity.amount != "0" && (
                    <span
                      data-click-trigger="1"
                      className="flex bg-yellow-400/30 rounded-full px-[4px] text-xs items-center font-medium tracking-wider border-yellow-400 text-yellow-400"
                    >
                      <ToolTip className="flex items-center gap-1" tip={reason}>
                        <PauseCircle width="15" />
                        <span className="hidden xs:inline">Paused</span>
                        <IconInfoCircle
                          width="15"
                          className="hidden xs:inline text-yellow-400"
                        />
                      </ToolTip>
                    </span>
                  )}

                  {!pausedCheck[0] && liquidity.amount != "0" && (
                    <span
                      data-click-trigger="1"
                      className="flex bg-green-400/30 rounded-full px-[4px] text-xs items-center font-medium tracking-wider border-green-400 text-green-400"
                    >
                      <ToolTip
                        className="flex items-center gap-1"
                        tip={`This liquidity is ready to accept new swaps`}
                      >
                        <PlayCircle width="15" />
                        <span className="hidden xs:inline">Active</span>
                        <IconInfoCircle
                          width="15"
                          className="hidden xs:inline text-green-400"
                        />
                      </ToolTip>
                    </span>
                  )}

                  {liquidity.amount == "0" && (
                    <span
                      data-click-trigger="1"
                      className="flex bg-red-400/30 rounded-full px-[4px] text-xs items-center font-medium tracking-wider border-red-400 text-red-400"
                    >
                      <ToolTip
                        className="flex items-center gap-1"
                        tip={`This liquidity holds zero (0) ${liquidity.base}. Add liquidity begin accepting swaps.`}
                      >
                        <CircleSlash width="15" />
                        <span className="hidden xs:inline">Empty</span>
                        <IconInfoCircle
                          width="15"
                          className="hidden xs:inline text-red-400"
                        />
                      </ToolTip>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden" data-click-trigger="1">
            <ScrollOverflowIndicator>
              <ScrollAreaHorizontal
                className="flex mr-[1px]"
                data-click-trigger="1"
              >
                <div
                  className="flex-1 flex py-2 px-2 gap-2"
                  data-click-trigger="1"
                >
                  <InfoCard
                    className="w-[210px]"
                    title={`Price (${liquidity.quote})`}
                    tip={`The price of 1 ${liquidity.base} in ${liquidity.quote}`}
                    title2={<PriceChange priceChange={liquidity.priceChange} />}
                  >
                    <span className="flex gap-1">
                      <span data-click-trigger="1">
                        {formatToHighDenom(
                          liquidity.price,
                          liquidity.market.quoteDecimals,
                          undefined,
                          undefined,
                          99999999
                        )}
                      </span>
                      <USDAmountToolTip v={liquidity.priceUsd} />
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`Available`}
                    title2={`(${liquidity.base})`}
                    tip={`The amount ${liquidity.base} available for swap`}
                  >
                    <span className="flex gap-1" data-click-trigger="1">
                      <span className="text-gray-200">
                        {formatToHighDenom(
                          liquidity.amount,
                          liquidity.market.baseDecimals,
                          undefined,
                          undefined,
                          99999999
                        )}
                      </span>
                      <USDAmountToolTip v={liquidity.amountUsd} />
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`Swapped (${liquidity.base})`}
                    tip={`Total ${liquidity.base} swapped`}
                  >
                    <span
                      className="text-gray-200 text-sm"
                      data-click-trigger="1"
                    >
                      {formatToHighDenom(
                        liquidity.amountSwapped,
                        liquidity.market.baseDecimals
                      )}
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`Min. Swap`}
                    title2={`(${liquidity.base})`}
                    tip={`The minimum amount of ${liquidity.base} that can be swapped`}
                  >
                    <span className="flex gap-1" data-click-trigger="1">
                      <span className="text-gray-200">
                        {formatToHighDenom(
                          liquidity.minSwap,
                          liquidity.market.baseDecimals
                        )}
                      </span>
                      <USDAmountToolTip v={liquidity.minSwapUsd} />
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`Max. Amount`}
                    title2={`(${liquidity.base})`}
                    tip={`The maximum amount of ${liquidity.base} that can be swapped`}
                    className="w-auto"
                  >
                    <span className="flex gap-1" data-click-trigger="1">
                      <span className="text-gray-200">
                        {formatToHighDenom(
                          liquidity.maxSwap,
                          liquidity.market.baseDecimals
                        )}
                      </span>
                      <USDAmountToolTip v={liquidity.maxSwapUsd} />
                    </span>
                  </InfoCard>
                  {/*<InfoCard*/}
                  {/*  title={`Payment Time`}*/}
                  {/*  tip={`The duration payment is expected to be made`}*/}
                  {/*>*/}
                  {/*  <span*/}
                  {/*    className="text-gray-200 text-sm"*/}
                  {/*    data-click-trigger="1"*/}
                  {/*  >*/}
                  {/*    {humanizeDur(liquidity.timeToPay)}*/}
                  {/*  </span>*/}
                  {/*</InfoCard>*/}
                  {/*<InfoCard*/}
                  {/*  title={`24hrs Volume`}*/}
                  {/*  tip={`The volume of ${liquidity.base} traded in the last 24hrs`}*/}
                  {/*>*/}
                  {/*  <span className="text-gray-200">*/}
                  {/*    ${approxNumber(parseFloat(liquidity.volume24h), 3)}*/}
                  {/*  </span>*/}
                  {/*</InfoCard>*/}
                  <InfoCard
                    title={`Total Swaps`}
                    tip={`The total number of swaps this liquidity has completed`}
                  >
                    <span className="text-gray-200" data-click-trigger="1">
                      {liquidity.totalSwaps}
                    </span>
                  </InfoCard>
                  {!liquidity.market.instant && (
                    <>
                      <InfoCard
                        title={`Open Disputes`}
                        tip={`The number of open disputes for this liquidity`}
                      >
                        <span className="text-gray-200" data-click-trigger="1">
                          {liquidity.openDisputes}
                        </span>
                      </InfoCard>
                      <InfoCard
                        title={`Total Disputes`}
                        tip={`The total number of disputes started for this liquidity`}
                      >
                        <span className="text-gray-200" data-click-trigger="1">
                          {liquidity.totalDisputes}
                        </span>
                      </InfoCard>
                    </>
                  )}
                </div>
              </ScrollAreaHorizontal>
            </ScrollOverflowIndicator>
          </div>
        </div>

        {reason && (
          <div className="flex items-center gap-3 px-3 border-t border-gray-800">
            <AlertTriangle width="15" className="text-red-400 flex-shrink-0" />
            <div className=" py-2 font-light text-xs text-gray-400 tracking-wider">
              {reason}
            </div>
          </div>
        )}

        <div
          className="border-t border-gray-800 text-gray-400 px-3 py-1 flex justify-between"
          data-click-trigger="1"
        >
          <div className="flex gap-2 items-center">
            {liquidity.messagingEnabled && (
              <ToolTip
                tip="User can receive message"
                className="hover:scale-110  transition-all duration-300"
              >
                <IconMessageReceived className="text-gray-400 hover:text-gray-300" />
              </ToolTip>
            )}
            <IDBadge
              prefix={liquidity.provider + "/"}
              id={liquidity.lid}
              tip="Liquidity ID"
            />
          </div>

          <span
            data-click-trigger="1"
            className="flex py-1 text-[12px] text-gray-400 gap-1 items-center tracking-wide font-light"
          >
            <span className="text-gray-500" data-click-trigger="1">
              <ToolTip
                tip={moment(liquidity.createdAt).fromNow()}
                className="flex gap-1 items-center"
              >
                <span>
                  <TimerIcon />
                </span>
                <span>
                  {moment(liquidity.createdAt)
                    .format("DD MMM YYYY, h:mm:ss a")
                    .toUpperCase()}
                </span>
              </ToolTip>
            </span>
          </span>
        </div>
        <div
          className="flex justify-between border-t border-gray-800"
          data-click-trigger="1"
        >
          <div
            data-click-trigger="1"
            className="flex items-center w-full  px-3 pr-0 md:px-3 md:pr-0 overflow-hidden"
          >
            <div
              data-click-trigger="1"
              className="flex border-r border-gray-800 py-2 pr-2 tracking-wide items-center gap-1 text-sm text-gray-300 font-extralight"
            >
              <ToolTip
                tip={
                  <span className="tracking-wider">
                    Liquidity-level badge is used to limit access to market
                    functions or describe a preference. It is set by the
                    liquidity provider.
                    <br />
                    <br />
                    A badge prefixed with:
                    <br />
                    <br />
                    <b className="text-chinese-green">TK</b>: requires the{" "}
                    <b>Taker</b> to have the badge before they can swap the
                    liquidity (ex: <i>TK: verified</i> means the taker must have
                    the <i>verified</i> badge).
                    <br />
                    <br />
                    <b className="text-chinese-green">PM</b>: requires the{" "}
                    <b>Taker</b> to pay or expect to be paid with a specific
                    payment method (ex: <i>PM: verified</i> means the taker must
                    have the <i>verified</i> badge).
                  </span>
                }
              >
                <span
                  data-click-trigger="1"
                  className="block text-gray-400 hover:text-chinese-green cursor-pointer transition-all duration-300"
                >
                  <IconInfoCircle width="22px" />
                </span>
              </ToolTip>
            </div>
            <div
              className="flex-1 overflow-hidden tracking-wider"
              data-click-trigger="1"
            >
              <ScrollOverflowIndicator className="[&::before]:rounded-none">
                <ScrollAreaHorizontal type="scroll">
                  <div
                    className="flex items-center gap-2 px-2"
                    data-click-trigger="1"
                  >
                    {liquidity.requiredSwapBadges.map((badge) => (
                      <BadgePill
                        key={badge}
                        name={badge.toUpperCase()}
                        prefix="TK"
                        tip={
                          <>
                            Takers must have "<b>{badge.toUpperCase()}</b>"
                            badge to be permitted to swap this liquidity
                          </>
                        }
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-400"
                        prefixClassName="text-yellow-700 bg-yellow-200"
                      />
                    ))}
                    {liquidity.requiredSwapBadges.length == 0 &&
                      liquidity.paymentMethods.length == 0 && (
                        <span
                          className="hidden xs:inline text-xs text-gray-500 font-light"
                          data-click-trigger="1"
                        >
                          No badge required
                        </span>
                      )}
                    {liquidity.paymentMethods.map((badge) => (
                      <BadgePill
                        key={badge}
                        noOpen={true}
                        name={cleanBadgeName(badge).toUpperCase()}
                        prefix="PM"
                        className="bg-green-100 hover:bg-green-400 text-green-800"
                        prefixClassName="text-green-800 bg-green-200"
                        tip={
                          <>
                            Takers can pay or may expect to be paid using "
                            <b>{cleanBadgeName(badge).toUpperCase()}</b>"
                            payment method
                          </>
                        }
                      />
                    ))}
                  </div>
                </ScrollAreaHorizontal>
              </ScrollOverflowIndicator>
            </div>
          </div>
          <div
            data-click-trigger="1"
            className="flex items-center border-gray-800 shrink-0"
          >
            {!location.pathname.includes("/market/") && (
              <span className="hidden lg:inline border-l border-gray-800 shrink-0">
                <NavLink to={`/market/${liquidity.marketAddress}`}>
                  <Button
                    variant="link"
                    rounded="none"
                    className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
                  >
                    View Market
                  </Button>
                </NavLink>
              </span>
            )}

            {!restricted && !ownerMode && (
              <span className="hidden lg:inline border-l border-gray-800 shrink-0">
                <Button
                  variant="link"
                  rounded="none"
                  className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
                  onClick={() => {
                    toggleOpenState("createOfferSheet");
                  }}
                >
                  Create Offer
                </Button>
              </span>
            )}

            {ownerMode && (
              <span className="hidden lg:inline border-gray-800 border-l shrink-0">
                <Button
                  variant="link"
                  rounded="none"
                  className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
                  onClick={() => setOpenManageLiquiditySheet(true)}
                >
                  <IconSettingsOutline width="15px" /> Manage
                </Button>
              </span>
            )}

            {!ownerMode && (
              <FollowLiquidity
                liquidity={liquidity}
                onFollowUpdate={onFollowUpdate}
              />
            )}

            {location.pathname.includes("/my/liquidity") && (
              <span className="hidden md:flex border-l border-gray-800 pl-1">
                <NavLink
                  to={`/liquidity/${liquidity.marketAddress}/${liquidity.provider}/${liquidity.lid}`}
                >
                  <Button
                    title="Open Liquidity"
                    variant="link"
                    rounded="lg"
                    scale="sm"
                    className="text-sm px-1 text-gray-300 flex items-center gap-1"
                  >
                    <ChevronRight />
                  </Button>
                </NavLink>
              </span>
            )}

            {!restricted && !isVirtualWallet && (
              <span className="flex border-l border-gray-800 pl-1">
                <Button
                  variant="link"
                  rounded="lg"
                  scale="sm"
                  className="text-sm animate-pulse hover:animate-none duration-3000 px-4 text-gray-900 flex items-center gap-1 bg-chinese-green  h-8 mx-1 lg:rounded-br-lg"
                  onClick={() => setOpenSwapSheet(true)}
                >
                  Swap
                </Button>
              </span>
            )}

            <span className="lg:hidden border-l border-gray-800">
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
                  {ownerMode && (
                    <DropdownMenuItem
                      className="flex gap-2"
                      onClick={() => {
                        setOpenManageLiquiditySheet(true);
                      }}
                    >
                      <IconEdit width="15px" /> Manage Liquidity
                    </DropdownMenuItem>
                  )}
                  {!restricted && !ownerMode && (
                    <DropdownMenuItem
                      className="flex gap-2"
                      disabled={isVirtualWallet}
                      onClick={() => {
                        toggleOpenState && toggleOpenState("createOfferSheet");
                      }}
                    >
                      <IconOffer width="15px" /> Create Offer
                    </DropdownMenuItem>
                  )}
                  <NavLink to={`/market/${liquidity.marketAddress}`}>
                    <DropdownMenuItem className="flex gap-2">
                      <IconMarket width="15px" /> View Market
                    </DropdownMenuItem>
                  </NavLink>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </div>
        </div>
      </div>

      <SwapSheet
        liquidity={liquidity}
        market={liquidity.market}
        open={openSwapSheet}
        onOpenChange={(open) => {
          setOpenSwapSheet(open);
        }}
      />
      <ManageLiquiditySheet
        liquidity={liquidity}
        market={liquidity.market}
        open={openManageLiquiditySheet}
        onOpenChange={(open) => {
          setOpenManageLiquiditySheet(open);
        }}
      />
      <SwapOfferCreatorSheet liquidity={liquidity} />
    </div>
  );
}
