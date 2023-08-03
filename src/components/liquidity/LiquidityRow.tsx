import { BaseSyntheticEvent, useState } from "react";
import { LiqAvatarHoverCard } from "./LiqAvatarHoverCard.tsx";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { ToolTip } from "../ToolTip.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
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
import { IconExchange } from "../icons/IconExchange.tsx";

export function LiquidityRow({
  base,
  quote,
  ownerMode,
  noFocus,
  className,
}: {
  base: string;
  quote: string;
  ownerMode?: boolean;
  noFocus?: boolean;
  className?: string;
}) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [openManageLiquiditySheet, setOpenManageLiquiditySheet] =
    useState(false);
  const [openSwapSheet, setOpenSwapSheet] = useState(false);
  const { openState, toggleOpenState } = useStore((state) => ({
    openState: state.openState,
    toggleOpenState: state.toggleOpenState,
  }));

  return (
    <div
      onClick={(e: BaseSyntheticEvent) => {
        const canTrigger = e.target.getAttribute("data-click-trigger");
        if (canTrigger && canTrigger == "1" && !noFocus) {
          setOpenSwapSheet(!openSwapSheet);
        }
      }}
    >
      <div
        data-click-trigger="1"
        className={cn(
          "border bg-card-background border-card-border transition-all duration-300 rounded-xl",
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
              <LiqAvatarHoverCard>
                <EmojiAvatar size={AvatarSize.Small} randomStr="abcen" />
              </LiqAvatarHoverCard>
            </div>
            <div
              className="flex py-3 md:py-0 w-full md:w-auto flex-col xxs:flex-row md:flex-col justify-start xxs:justify-between md:justify-start z-[6] xxs:items-center md:items-start"
              data-click-trigger="1"
            >
              <span className="flex text-gray-100 items-center gap-1">
                <span data-click-trigger="1">0xAbc..xYz</span>
                <VerifiedBadge />
              </span>
              <ToolTip tip="Click to open reviews">
                <div className="flex items-center gap-1 text-blue-200">
                  <span>
                    <IconStarSmile width="15px" />
                  </span>
                  <span
                    onClick={() => {
                      toggleOpenState("reviewSheet");
                    }}
                    className="text-blue-200 text-xs font-light hover:text-chinese-green/80 hover:underline decoration-dashed decoration-1 underline-offset-4"
                  >
                    84% (256 trades)
                  </span>
                </div>
              </ToolTip>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ScrollGradientIndicator>
              <ScrollAreaHorizontal className="flex mr-[1px]">
                <div
                  className="flex-1 flex py-2 px-2 gap-2"
                  data-click-trigger="1"
                >
                  <StatCard
                    title="Price ($)"
                    tip={`The price of 1 ${base} in USD`}
                    title2={
                      <span className="text-green-400 hidden xxs:inline">
                        (+10%)
                      </span>
                    }
                  >
                    $1,234
                  </StatCard>
                  <StatCard
                    title={`Price (${quote})`}
                    tip={`The price of 1 ${base} in ${quote}`}
                  >
                    $1,234
                  </StatCard>
                  <StatCard
                    title={`Available`}
                    tip={`The amount ${base} available for swap`}
                  >
                    <span className="text-gray-200">1,300</span>
                  </StatCard>
                  <StatCard
                    title={`Min. Amount`}
                    tip={`The minimum amount ${base} you can swap`}
                  >
                    <span className="text-gray-200">100</span>
                  </StatCard>
                  <StatCard
                    title={`Max. Amount`}
                    tip={`The maximum amount ${base} you can swap`}
                  >
                    <span className="text-gray-200">1,500</span>
                  </StatCard>
                  <StatCard
                    title={`Payment Time`}
                    tip={`The duration payment is expected to be made`}
                  >
                    <span className="text-gray-200">30 mins</span>
                  </StatCard>
                  <StatCard
                    title={`24hrs Volume`}
                    tip={`The volume of ${base} traded in the last 24hrs`}
                  >
                    <span className="text-gray-200">$3.5m</span>
                  </StatCard>
                  <StatCard
                    title={`Open Disputes`}
                    tip={`The number of open disputes for this liquidity`}
                  >
                    <span className="text-gray-200">2</span>
                  </StatCard>
                  <StatCard
                    title={`Total Disputes`}
                    tip={`The total number of disputes started for this liquidity`}
                  >
                    <span className="text-gray-200">100</span>
                  </StatCard>
                  <StatCard
                    title={`Total Swaps`}
                    tip={`The total number of swaps this liquidity has completed`}
                  >
                    <span className="text-gray-200">345</span>
                  </StatCard>
                </div>
              </ScrollAreaHorizontal>
            </ScrollGradientIndicator>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-800">
          <div
            data-click-trigger="1"
            className="flex items-center w-full gap-2 px-3 pr-0 md:px-3 md:pr-0 overflow-hidden"
          >
            <div className=" flex border-r border-gray-800 py-2 pr-2 tracking-wide items-center gap-1 text-sm text-gray-300 font-extralight">
              {/*<span className="hidden sm:inline">Badges</span>*/}
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
              <ScrollGradientIndicator className="[&::before]:rounded-none">
                <ScrollAreaHorizontal type="scroll">
                  <div
                    className="flex items-center gap-2 pr-3"
                    data-click-trigger="1"
                  >
                    <BadgePill name="LP:KYC" />
                    <BadgePill name="TK:KYC" />
                    <BadgePill name="NIGERIAN" />
                    <BadgePill name="MERCHANT" />
                    <BadgePill name="MERCHANT" />
                  </div>
                </ScrollAreaHorizontal>
              </ScrollGradientIndicator>
            </div>
          </div>
          <div
            data-click-trigger="1"
            className="flex items-center border-l border-gray-800 shrink-0"
          >
            {ownerMode && (
              <span className="hidden lg:inline border-r border-gray-800 shrink-0">
                <Button
                  variant="link"
                  rounded="none"
                  className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
                  onClick={() => setOpenManageLiquiditySheet(true)}
                >
                  <IconEdit width="15px" /> Manage
                </Button>
              </span>
            )}
            <span className="flex items-center px-2 pb-0 hover:text-chinese-green text-gray-400 transition-all duration-300 hover:scale-110">
              {!ownerMode && <IconHeart />}
            </span>
            <Button
              variant="link"
              rounded="none"
              className="text-sm px-2 text-gray-900 flex items-center gap-1 bg-chinese-green lg:rounded-br-xl"
              onClick={() => setOpenSwapSheet(true)}
            >
              <IconExchange width="20px" /> SWAP
            </Button>
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
