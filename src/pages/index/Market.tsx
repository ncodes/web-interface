import { ActivityStream } from "../../components/ActivityStream.tsx";
import { ScrollAreaHorizontal } from "../../components/ui/scroll-area.tsx";
import { TabsList, TabsTrigger } from "../../components/ui/Tabs.tsx";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import Layout from "./Layout.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { IconPlus } from "../../components/icons/IconPlus.tsx";
import { PairAvatar } from "../../components/region/PairAvatar.tsx";
import IconCopyFilled from "../../components/icons/IconCopyFilled.tsx";
import IconInfoCircle from "../../components/icons/IconInfoCircle.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.tsx";
import React from "react";
import IconHeart from "../../components/icons/IconHeart.tsx";
import { cn } from "../../libs/utils.ts";

function MarketStat({
  title,
  title2,
  children,
  width,
}: {
  title: string;
  title2: React.ReactNode | string;
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <Card
      className={cn(
        "w-[150px] border border-card-border bg-card-background shadow-sm shadow-gray-900",
        width
      )}
    >
      <CardHeader className="px-3 py-2 pt-1 pb-[2px]">
        <CardTitle className="text-xs tracking-wide font-light text-gray-400 flex items-center gap-2">
          <span>{title}</span>
          <span>{title2}</span>
          <span className="flex-1 flex justify-end cursor-pointer opacity-50 hover:opacity-100 transition-all duration-500">
            <IconInfoCircle width="15px" />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-0 pb-2 tracking-wide text-chinese-green">
        {children}
      </CardContent>
    </Card>
  );
}

function MarketItem() {
  return (
    <div className="bg-gray-900 border border-gray-800 transition-all hover:border-gray-700 duration-300 hover:scale-[1.002] cursor-pointer rounded-xl">
      <div className="flex h-auto">
        <div className="h-full border-r select-none border-gray-800 shrink-0">
          <div className="flex items-center gap-3 px-3 md:px-5 py-4">
            <PairAvatar
              baseSrc="/images/icons/asset-icons/btc.svg"
              quoteSrc="/images/icons/asset-icons/uni.svg"
            />
            <div className="flex flex-col">
              <span>BTC - UNI</span>
              <span className="flex items-center gap-1 text-sm font-extralight text-blue-200">
                <span>
                  ID:<span className="hidden md:inline"> 0x83...a73b</span>
                </span>
                <IconCopyFilled
                  width="13px"
                  height="13px"
                  className="opacity-70 hover:opacity-100 hover:text-chinese-green cursor-pointer transition-all duration-300 active:text-white active:scale-50"
                />
              </span>
            </div>
          </div>
        </div>
        <div className="w-full overflow-hidden scroll-shadow">
          <ScrollAreaHorizontal type="scroll">
            <div className="py-[8px] flex gap-2 px-3">
              <MarketStat
                title="Price ($)"
                title2={
                  <span className="text-green-400 hidden xxs:inline">
                    (+10%)
                  </span>
                }
              >
                $1,234
              </MarketStat>
              <MarketStat title="Price" title2="(UNI)">
                50,640
              </MarketStat>
              <MarketStat title="24hrs Volume" title2="">
                <span className="text-gray-200">$45m</span>
              </MarketStat>
              <MarketStat title="Total Liquidity" title2="">
                <span className="text-gray-200">$125m</span>
              </MarketStat>
              <MarketStat title="Commission" title2="(%)">
                <span className="text-gray-200"> 0.5</span>
              </MarketStat>
              <MarketStat title="Offer Only" title2="" width="w-[125px]">
                <span className="text-gray-200">YES</span>
              </MarketStat>
              <MarketStat title="PUT Open" title2="" width="w-[125px]">
                <span className="text-gray-200">YES</span>
              </MarketStat>
              <MarketStat title="SWAP Open" title2="">
                <span className="text-gray-200">NO</span>
              </MarketStat>
            </div>
          </ScrollAreaHorizontal>
        </div>
      </div>
      <div className="flex pr-2 justify-between border-t border-gray-800">
        <div className="flex w-full items-center gap-2 px-3 pr-0 md:px-5 md:pr-0 overflow-hidden">
          <div className="flex border-r border-gray-800 py-2 pr-2 tracking-wide items-center gap-1 text-sm text-gray-300 font-extralight">
            <span className="hidden sm:inline">Badges</span>
            <span className="opacity-50 hover:opacity-100 hover:text-chinese-green cursor-pointer transition-all duration-300">
              <IconInfoCircle />
            </span>
          </div>
          <div className="py-2 flex-1 overflow-hidden tracking-wider scroll-shadow">
            <ScrollAreaHorizontal type="scroll">
              <div className="flex items-center gap-2 pr-3">
                <Badge
                  className="cursor-pointer bg-gray-900 border rounded-full border-gray-700 text-gray-300 hover:bg-chinese-green hover:text-gray-900"
                  variant="secondary"
                >
                  KYC
                </Badge>
                <Badge
                  className="cursor-pointer bg-gray-900 border rounded-full border-gray-700 text-gray-300 hover:bg-chinese-green hover:text-gray-900"
                  variant="secondary"
                >
                  NIGERIAN
                </Badge>
                <Badge
                  className="cursor-pointer bg-gray-900 border rounded-full border-gray-700 text-gray-300 hover:bg-chinese-green hover:text-gray-900"
                  variant="secondary"
                >
                  MERCHANT
                </Badge>
                <Badge
                  className="cursor-pointer bg-gray-900 border rounded-full border-gray-700 text-gray-300 hover:bg-chinese-green hover:text-gray-900"
                  variant="secondary"
                >
                  MERCHANT
                </Badge>
              </div>
            </ScrollAreaHorizontal>
          </div>
        </div>
        <div className="flex items-center border-l border-gray-800 pl-2">
          <span className="inline-block pb-0 hover:text-chinese-green text-gray-400">
            <IconHeart />
          </span>
        </div>
      </div>
    </div>
  );
}

function MarketTabs() {
  return (
    <Tabs
      defaultValue="markets"
      className="w-full h-full transition-all duration-500"
    >
      <TabsList className="flex justify-start w-full items-center border-b border-modal-border">
        <ScrollAreaHorizontal type="scroll" className="w-full">
          <div className="flex flex-1 w-full gap-2 items-center px-2 scroll-shadow2 py-2">
            <TabsTrigger
              value="markets"
              className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
            >
              Markets
            </TabsTrigger>
            <TabsTrigger
              value="my-market"
              className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
            >
              My Market
            </TabsTrigger>
            <TabsTrigger
              value="watching"
              className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
            >
              Watching
            </TabsTrigger>
          </div>
        </ScrollAreaHorizontal>
        <div className="flex shrink-0 pr-5  justify-end ">
          <Button
            variant="outline"
            size="sm"
            rounded="md"
            className="flex gap-1 items-center"
          >
            <IconPlus />
            <span className="hidden md:inline">Create Market</span>
          </Button>
        </div>
      </TabsList>
      <TabsContent value="markets" className="p-3 flex flex-col gap-3">
        <MarketItem />
        {/*<MarketItem />*/}
        {/*<MarketItem />*/}
      </TabsContent>
      <TabsContent value="my-activity" className=""></TabsContent>
      <TabsContent value="top" className="px-5">
        <ActivityStream />
      </TabsContent>
    </Tabs>
  );
}

export default function Market() {
  return <Layout tab={<MarketTabs />} />;
}
