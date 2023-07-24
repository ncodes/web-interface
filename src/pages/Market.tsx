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
import IconCopy from "../components/icons/IconCopy.tsx";
import { StatCard } from "../components/market/StatCard.tsx";

function MarketTabContent() {
  return <MarketRow base="BTC" quote="UNI" />;
}

function LiquidityRow({ base, quote }: { base: string; quote: string }) {
  return (
    <div className="bg-card-background border border-gray-800 rounded-xl">
      <div className="flex">
        <div className="flex gap-2 p-5 py-0 items-center shrink-0">
          <div>
            <EmojiAvatar size={AvatarSize.Small} randomStr="abcen" />
          </div>
          <div className="flex flex-col">
            <span className="flex text-gray-100 items-center gap-1">
              <span>0xAbc..xYz</span>
              <span className="text-gray-400 hover:text-chinese-green cursor-pointer transition-all duration-300 active:-scale-110">
                <IconCopy width="14px" />
              </span>
            </span>
            <span className="text-gray-400 text-xs font-light">
              84% (256 trades)
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ScrollAreaHorizontal className="flex">
            <div className="flex-1 flex py-2 pr-2 gap-2">
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
        </div>
      </div>
      <div></div>
    </div>
  );
}

function MarketTabs() {
  const [openFilterSheet, setOpenFilterSheet] = useState(false);

  return (
    <Tabs
      defaultValue="markets"
      className="w-full h-full transition-all duration-500"
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollAreaHorizontal type="scroll" className="w-full">
          <div className="flex flex-1 w-full gap-2 items-center px-2 scroll-shadow py-2">
            <TabsTrigger
              value="markets"
              className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
            >
              Market
            </TabsTrigger>
          </div>
        </ScrollAreaHorizontal>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end"></div>
      </TabsList>
      <TabsContent value="markets" className="p-3 pt-0 flex flex-col gap-3">
        <MarketTabContent />
        <h1 className="p-5 py-3 text-xl">Liquidities</h1>
        <div className="flex gap-2 flex-col">
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
          <LiquidityRow base="BTC" quote="UNI" />
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
        <div className="flex flex-col h-full">
          <LiquidityFilter />
          <div className="text-gray-200">
            <Footer />
          </div>
        </div>
      }
    />
  );
}
