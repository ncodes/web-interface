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
import { Button } from "../components/ui/Button.tsx";
import { IconPlus } from "../components/icons/IconPlus.tsx";
import IconFilterOutline from "../components/icons/IconFilterOutline.tsx";
import ScrollGradientIndicator from "../components/ScrollGradientIndicator.tsx";
import { LiquidityRow } from "../components/liquidity/LiquidityRow.tsx";
import { ManageLiquiditySheet } from "../components/liquidity/ManageLiquiditySheet.tsx";
import { Paginator } from "../components/Paginator.tsx";

function MarketTabContent() {
  return (
    <MarketRow
      base="BTC"
      quote="UNI"
      className="rounded-none border-x-0 border-t-0"
      noFocus
    />
  );
}

function MarketTabs() {
  const [openFilterSheet, setOpenFilterSheet] = useState(false);
  const [openAddLiquiditySheet, setOpenAddLiquiditySheet] = useState(false);

  return (
    <Tabs
      defaultValue="markets"
      className="w-full h-full transition-all duration-500 "
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollAreaHorizontal type="scroll" className="w-full">
          <ScrollGradientIndicator>
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="markets"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Market
              </TabsTrigger>
            </div>
          </ScrollGradientIndicator>
        </ScrollAreaHorizontal>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end">
          <Button
            size="sm"
            className="flex gap-1 items-center transition-all duration-500 hover:scale-x-105"
            onClick={() => {
              setOpenAddLiquiditySheet(true);
            }}
          >
            <IconPlus />
            <span>Add Liquidity</span>
          </Button>
        </div>
      </TabsList>
      <TabsContent
        value="markets"
        className="p-3 px-0 mt-0 pt-0 flex flex-col gap-3"
      >
        <MarketTabContent />
        <div className="flex items-center justify-between">
          <h1 className="p-5 py-3 pb-0 text-xl">Liquidities</h1>
          <div className="md:hidden">
            <Button
              variant="link"
              className="gap-2"
              rounded="none"
              onClick={() => {
                setOpenFilterSheet(true);
              }}
            >
              <span>
                <IconFilterOutline width="15px" />
              </span>
              <span>Filter</span>
            </Button>
          </div>
        </div>
        <div>
          <Paginator className="border-b-0" />
          <div className="flex gap-2 flex-col z-[6] px-3 mt-3">
            <LiquidityRow base="BTC" quote="UNI" />
          </div>
        </div>
      </TabsContent>
      <LiquidityFilterSheet
        active={openFilterSheet}
        onOpen={(open) => {
          setOpenFilterSheet(open);
        }}
      />
      <ManageLiquiditySheet
        addMode={true}
        open={openAddLiquiditySheet}
        onOpenChange={(open) => {
          setOpenAddLiquiditySheet(open);
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
