import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs.tsx";
import Layout from "./Layout.tsx";
import { useState } from "react";
import { Footer } from "../components/Footer.tsx";
import { MarketRow } from "../components/market/MarketRow.tsx";
import {
  LiquidityFilter,
  LiquidityFilterSheet,
} from "../components/market/LiquidityFilter.tsx";
import { AvatarSize } from "../components/avatar/useAvatar.tsx";
import EmojiAvatar from "../components/avatar/EmojiAvatar.tsx";
import { StatCard } from "../components/market/StatCard.tsx";
import { Button } from "../components/ui/Button.tsx";
import { IconPlus } from "../components/icons/IconPlus.tsx";
import IconHeart from "../components/icons/IconHeart.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import { cn } from "../libs/utils.ts";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import IconFilterOutline from "../components/icons/IconFilterOutline.tsx";
import { ToolTip } from "../components/ToolTip.tsx";
import IconInfoCircle from "../components/icons/IconInfoCircle.tsx";
import { BadgePill } from "../components/market/BadgePill.tsx";
import IconArrowDownUp from "../components/icons/IconArrowDownUp.tsx";
import { IconFlagVerified } from "../components/icons/IconVerifiedBadge.tsx";
import ScrollGradientIndicator from "../components/ScrollGradientIndicator.tsx";
import { LiqAvatarHoverCard } from "../components/liquidity/LiqAvatarHoverCard.tsx";

function MarketTabContent() {
  return <MarketRow base="BTC" quote="UNI" noFocus />;
}

function LiquidityRow({
  base,
  quote,
  ownerMode,
}: {
  base: string;
  quote: string;
  ownerMode?: boolean;
}) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [openEditLiqSheet, setOpenEditLiqSheet] = useState(false);

  return (
    <div className="border border-gray-800 transition-all hover:border-chinese-green duration-300 hover:scale-[1.002] cursor-pointer rounded-xl">
      <div className="flex">
        <div className="flex gap-2 p-5 px-3 py-0 items-center shrink-0 border-r border-gray-800">
          <div>
            <LiqAvatarHoverCard>
              <EmojiAvatar size={AvatarSize.Small} randomStr="abcen" />
            </LiqAvatarHoverCard>
          </div>
          <div className="flex flex-col">
            <span className="flex text-gray-100 items-center gap-1">
              <span>0xAbc..xYz</span>
              <span className="transition-all duration-500 cursor-pointer hover:scale-110">
                <IconFlagVerified width="14px" />
              </span>
            </span>
            <ToolTip tip="Click to open reviews">
              <div className="flex items-center gap-1 text-gray-300">
                <span>
                  <IconArrowDownUp width="12px" />
                </span>
                <span className="text-gray-400 text-xs font-light hover:text-chinese-green/80 hover:underline decoration-dashed decoration-1 underline-offset-4">
                  84% (256 trades)
                </span>
              </div>
            </ToolTip>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ScrollGradientIndicator>
            <ScrollAreaHorizontal className="flex mr-[1px]">
              <div className="flex-1 flex py-2 px-2 gap-2">
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
      <div className="flex pr-2 justify-between border-t border-gray-800">
        <div className="flex w-full items-center gap-2 px-3 pr-0 md:px-3 md:pr-0 overflow-hidden">
          <div className="flex border-r border-gray-800 py-2 pr-2 tracking-wide items-center gap-1 text-sm text-gray-300 font-extralight">
            {/*<span className="hidden sm:inline">Badges</span>*/}
            <ToolTip tip="Badges required of the taker by the liquidity owner">
              <span className="text-gray-600 hover:text-chinese-green cursor-pointer transition-all duration-300">
                <IconInfoCircle />
              </span>
            </ToolTip>
          </div>
          <div className="flex-1 overflow-hidden tracking-wider">
            <ScrollGradientIndicator>
              <ScrollAreaHorizontal type="scroll">
                <div className="flex items-center gap-2 pr-3">
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
        <div className="flex items-center border-l border-gray-800 pl-2">
          <span className="inline-block pb-0 hover:text-chinese-green text-gray-400 transition-all duration-300 hover:scale-110">
            {!ownerMode && <IconHeart />}
            {ownerMode && (
              <DropdownMenu
                onOpenChange={(open) => {
                  setMoreMenuOpen(open);
                }}
              >
                <DropdownMenuTrigger className="outline-0 ring-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "outline-0 ring-0 flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green",
                      { "scale-x-105 text-chinese-green": moreMenuOpen }
                    )}
                  >
                    <DotsVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
                  <DropdownMenuItem
                    className="flex gap-2"
                    onClick={() => {
                      setOpenEditLiqSheet(true);
                    }}
                  >
                    <IconFilterOutline /> Edit Liquidity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function MarketTabs() {
  const [openFilterSheet, setOpenFilterSheet] = useState(false);

  return (
    <Tabs
      defaultValue="markets"
      className="w-full h-full transition-all duration-500 "
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollAreaHorizontal type="scroll" className="w-full">
          <ScrollGradientIndicator>
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2">
              <TabsTrigger
                value="markets"
                className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
              >
                Market
              </TabsTrigger>
            </div>
          </ScrollGradientIndicator>
        </ScrollAreaHorizontal>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            className="flex gap-1 items-center transition-all duration-500 hover:scale-x-105"
          >
            <IconPlus />
            <span>Add Liquidity</span>
          </Button>
        </div>
      </TabsList>
      <TabsContent value="markets" className="p-3 pt-0 flex flex-col gap-3">
        <MarketTabContent />
        <h1 className="p-5 py-3 text-xl">Liquidities</h1>
        <div className="flex gap-2 flex-col">
          <LiquidityRow base="BTC" quote="UNI" />
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
          {/*<LiquidityRow base="BTC" quote="UNI" />*/}
        </div>
      </TabsContent>
      <LiquidityFilterSheet
        active={openFilterSheet}
        onOpen={(open) => {
          setOpenFilterSheet(open);
        }}
      />
    </Tabs>
  );
}

export default function Market() {
  return (
    <Layout
      tab={<MarketTabs />}
      rightSide={
        <div className="flex flex-col h-full mt-2">
          <LiquidityFilter />
          <div className="text-gray-200">
            <Footer />
          </div>
        </div>
      }
    />
  );
}
