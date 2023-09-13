import { BaseSyntheticEvent, useState } from "react";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { ToolTip } from "../ToolTip.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { StatCard } from "../market/StatCard.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { BadgePill } from "../market/BadgePill.tsx";
import { Button } from "../ui/Button.tsx";
import IconOffer from "../icons/IconOffer.tsx";
import IconEdit from "../icons/IconEdit.tsx";
import IconHeart from "../icons/IconHeart.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { cn } from "../../libs/utils.ts";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { VerifiedBadge } from "./VerifiedBadge.tsx";
import { ManageLiquiditySheet } from "./ManageLiquiditySheet.tsx";
import { SwapSheet } from "../swap/SwapSheet.tsx";
import { ReviewViewerSheet } from "./ReviewViewerSheet.tsx";
import { CreateOfferSheet } from "./CreateOfferSheet.tsx";
import { IconStarSmile } from "../icons/IconStarSmile.tsx";
import useStore from "../../hooks/store/useStore.ts";
import {
  approxNumber,
  formatToHighDenom,
  humanizeDur,
  shortenAddress,
  isMerchant,
} from "../../libs/helpers.ts";
import { IconSettingsOutline } from "../icons/IconSettingsOutline.tsx";
import { useQuery } from "@tanstack/react-query";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import { Skeleton } from "../ui/skeleton.tsx";
import IconCaution from "../icons/IconCaution.tsx";
import { PairAvatar } from "../avatar/PairAvatar.tsx";
import { PlayCircle } from "lucide-react";
import { USDAmountToolTip } from "../USDAmountToolTip.tsx";
import { useNavigate } from "react-router-dom";
import { UserHoverCard } from "../UserHoverCard.tsx";

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
}: {
  ownerMode?: boolean;
  noFocus?: boolean;
  className?: string;
  liquidity: Liquidity;
}) {
  const navigate = useNavigate();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [openManageLiquiditySheet, setOpenManageLiquiditySheet] =
    useState(false);
  const [openSwapSheet, setOpenSwapSheet] = useState(false);
  const { openState, toggleOpenState } = useStore((state) => ({
    openState: state.openState,
    toggleOpenState: state.toggleOpenState,
  }));
  const { getUser } = useUserService();
  const getProvider = useQuery({
    queryKey: ["getUser", { address: liquidity.provider, noAuth: true }],
    queryFn: getUser,
    enabled: !!liquidity.provider,
  });

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
          "border bg-card-background border-card-border transition-all duration-300 border-b-gray-600 rounded-xl",
          {
            "hover:scale-[1.002] hover:border-chinese-green cursor-pointer":
              !noFocus,
          },
          className
        )}
      >
        <div className="flex flex-col md:flex-row" data-click-trigger="1">
          <div
            data-click-trigger="1"
            className="flex gap-2 p-5 px-3 py-0 items-center shrink-0 border-r border-gray-800"
          >
            <div>
              {!ownerMode && (
                <UserHoverCard user={getProvider.data as User}>
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
              {getProvider.isError && (
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
                <div className="w-full md:w-[130px] flex items-center md:items-start md:flex-col justify-between md:justify-start">
                  <span className="flex text-gray-100 items-center gap-1">
                    <span data-click-trigger="1">
                      {shortenAddress(liquidity.provider)}
                    </span>
                    {isMerchant(getProvider.data?.badges || []) && (
                      <VerifiedBadge />
                    )}
                  </span>
                  <ToolTip tip="Click to open reviews">
                    <div className="flex items-center gap-1 text-yellow-200">
                      <span>
                        <IconStarSmile width="15px" />
                      </span>
                      <span
                        onClick={() => {
                          toggleOpenState("reviewSheet");
                        }}
                        className="text-blue-200 text-xs font-light hover:text-chinese-green/80 hover:underline decoration-dashed decoration-1 underline-offset-4"
                      >
                        {getProvider.data?.completionRate}% (
                        {getProvider.data?.totalSwaps} trade
                        {(getProvider.data?.totalSwaps as number) > 1
                          ? "s"
                          : ""}
                        )
                      </span>
                    </div>
                  </ToolTip>
                </div>
              )}

              {ownerMode && (
                <div className="w-full md:w-[100px] flex gap-1 justify-between items-center md:items-start md:justify-start md:flex-col">
                  <span className="flex text-xs xs:text-[16px]">
                    {liquidity.base}
                    <span className="text-gray-500 inline-block mx-1">/</span>
                    {liquidity.quote}
                  </span>

                  {liquidity.paused && (
                    <span className="flex bg-yellow-400/30 rounded-full px-[4px] text-xs items-center font-medium tracking-wider border-yellow-400 text-yellow-400">
                      <ToolTip
                        className="flex items-center gap-1"
                        tip={`This liquidity is paused and cannot accept new swaps`}
                      >
                        <PlayCircle width="15" />
                        <span className="hidden xs:inline">Paused</span>
                        <IconInfoCircle
                          width="15"
                          className="hidden xs:inline text-yellow-400"
                        />
                      </ToolTip>
                    </span>
                  )}

                  {!liquidity.paused && liquidity.amount != "0" && (
                    <span className="flex bg-green-400/30 rounded-full px-[4px] text-xs items-center font-medium tracking-wider border-green-400 text-green-400">
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
                    <span className="flex bg-red-400/30 rounded-full px-[4px] text-xs items-center font-medium tracking-wider border-red-400 text-red-400">
                      <ToolTip
                        className="flex items-center gap-1"
                        tip={`This liquidity holds zero (0) ${liquidity.base}. Add liquidity begin accepting swaps.`}
                      >
                        <PlayCircle width="15" />
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
          <div className="flex-1 overflow-hidden">
            <ScrollOverflowIndicator>
              <ScrollAreaHorizontal className="flex mr-[1px]">
                <div
                  className="flex-1 flex py-2 px-2 gap-2"
                  data-click-trigger="1"
                >
                  <StatCard
                    title={`Price (${liquidity.quote})`}
                    tip={`The price of 1 ${liquidity.base} in ${liquidity.quote}`}
                    title2={
                      <span
                        className={cn("hidden xxs:inline text-[10px]", {
                          "text-green-400": liquidity?.priceChange > 0,
                          "text-red-400": liquidity?.priceChange < 0,
                          "text-gray-200": liquidity?.priceChange == 0,
                        })}
                      >
                        ({liquidity?.priceChange < 0 && "-"}
                        {liquidity?.priceChange == 0 && ""}
                        {liquidity?.priceChange > 0 && "+"}
                        {liquidity?.priceChange.toString().replace("-", "")}
                        %)
                      </span>
                    }
                  >
                    <span className="flex gap-1">
                      <span>
                        {formatToHighDenom(
                          liquidity.price,
                          liquidity.market.quoteDecimals
                        )}
                      </span>
                      <USDAmountToolTip v={liquidity.priceUsd} />
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Available`}
                    title2={`(${liquidity.base})`}
                    tip={`The amount ${liquidity.base} available for swap`}
                  >
                    <span className="flex gap-1">
                      <span className="text-gray-200">
                        {formatToHighDenom(
                          liquidity.amount,
                          liquidity.market.baseDecimals
                        )}
                      </span>
                      <USDAmountToolTip v={liquidity.amountUsd} />
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Min. Swap`}
                    title2={`(${liquidity.base})`}
                    tip={`The minimum amount of ${liquidity.base} that can be swapped`}
                  >
                    <span className="flex gap-1">
                      <span className="text-gray-200">
                        {formatToHighDenom(
                          liquidity.minSwap,
                          liquidity.market.baseDecimals
                        )}
                      </span>
                      <USDAmountToolTip v={liquidity.minSwapUsd} />
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Max. Amount`}
                    title2={`(${liquidity.base})`}
                    tip={`The maximum amount of ${liquidity.base} that can be swapped`}
                  >
                    <span className="flex gap-1">
                      <span className="text-gray-200">
                        {formatToHighDenom(
                          liquidity.maxSwap,
                          liquidity.market.baseDecimals
                        )}
                      </span>
                      <USDAmountToolTip v={liquidity.maxSwapUsd} />
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Payment Time`}
                    tip={`The duration payment is expected to be made`}
                  >
                    <span className="text-gray-200">
                      {humanizeDur(liquidity.timeToPay)}
                    </span>
                  </StatCard>
                  <StatCard
                    title={`24hrs Volume`}
                    tip={`The volume of ${liquidity.base} traded in the last 24hrs`}
                  >
                    <span className="text-gray-200">
                      ${approxNumber(parseFloat(liquidity.volume24h), 3)}
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Total Swaps`}
                    tip={`The total number of swaps this liquidity has completed`}
                  >
                    <span className="text-gray-200">
                      {liquidity.totalSwaps}
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Open Disputes`}
                    tip={`The number of open disputes for this liquidity`}
                  >
                    <span className="text-gray-200">
                      {liquidity.openDisputes}
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Total Disputes`}
                    tip={`The total number of disputes started for this liquidity`}
                  >
                    <span className="text-gray-200">
                      {liquidity.totalDisputes}
                    </span>
                  </StatCard>
                </div>
              </ScrollAreaHorizontal>
            </ScrollOverflowIndicator>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-800">
          <div
            data-click-trigger="1"
            className="flex items-center w-full  px-3 pr-0 md:px-3 md:pr-0 overflow-hidden"
          >
            <div className="flex border-r border-gray-800 py-2 pr-2 tracking-wide items-center gap-1 text-sm text-gray-300 font-extralight">
              <ToolTip tip="Badges required of the taker by the liquidity owner">
                <span
                  data-click-trigger="1"
                  className="block text-gray-400 hover:text-chinese-green cursor-pointer transition-all duration-300"
                >
                  <IconInfoCircle width="22px" />
                </span>
              </ToolTip>
            </div>
            <div className="flex-1 overflow-hidden tracking-wider">
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
                        tip={`Takers must have "${badge}" badge to be allowed to swap this liquidity`}
                      />
                    ))}
                    {liquidity.requiredSwapBadges.length == 0 && (
                      <span className="hidden xs:inline text-xs text-gray-500 font-light">
                        No badge required
                      </span>
                    )}
                  </div>
                </ScrollAreaHorizontal>
              </ScrollOverflowIndicator>
            </div>
          </div>
          <div
            data-click-trigger="1"
            className="flex items-center border-gray-800 shrink-0"
          >
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
              <span className="flex items-center px-2 h-full border-l border-gray-800 hover:text-chinese-green text-gray-400 transition-all duration-300 hover:scale-110">
                <IconHeart />
              </span>
            )}

            {!ownerMode && (
              <Button
                variant="link"
                rounded="lg"
                scale="sm"
                className="xl:hidden text-sm px-4 text-gray-900 flex items-center gap-1 bg-chinese-green  h-8 mx-1 lg:rounded-br-lg"
                onClick={() => setOpenSwapSheet(true)}
              >
                Swap
              </Button>
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
                  {!ownerMode && (
                    <DropdownMenuItem
                      className="flex gap-2"
                      onClick={() => {
                        toggleOpenState && toggleOpenState("createOfferSheet");
                      }}
                    >
                      <IconOffer width="15px" /> Create Offer
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </div>
        </div>
      </div>

      <SwapSheet
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
      <ReviewViewerSheet
        open={openState.reviewSheet || false}
        onOpenChange={() => {
          toggleOpenState && toggleOpenState("reviewSheet");
        }}
      />
      <CreateOfferSheet />
    </div>
  );
}
