import { ActivityStream } from "../../components/ActivityStream.tsx";
import {
  ScrollArea,
  ScrollAreaHorizontal,
} from "../../components/ui/scroll-area.tsx";
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
import React, { ReactNode, useEffect, useState } from "react";
import IconHeart from "../../components/icons/IconHeart.tsx";
import { cn } from "../../libs/utils.ts";
import {
  MarketFilter,
  MarketFilterContent,
} from "../../components/MarketFilter.tsx";
import { Footer } from "../../components/Footer.tsx";
import IconFilterOutline from "../../components/icons/IconFilterOutline.tsx";
import { Cross2Icon, DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet.tsx";
import { ToolTip } from "../../components/ToolTip.tsx";

function MarketStat({
  title,
  title2,
  children,
  tip,
  width,
}: {
  title: string;
  title2: React.ReactNode | string;
  tip?: React.ReactNode;
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
            <ToolTip tip={tip}>
              <IconInfoCircle width="15px" />
            </ToolTip>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-0 pb-2 tracking-wide text-chinese-green">
        {children}
      </CardContent>
    </Card>
  );
}

function BadgeSheetContent({ badge }: { badge?: string }) {
  return (
    <div className="flex flex-col">
      <div className="w-full h-[150px] bg-gray-900 cover"></div>
      <div className="p-5 flex flex-col gap-1 tracking-wide border-b border-gray-800">
        <h1 className="text-gray-200 flex items-center gap-2">
          Description{" "}
          <ToolTip tip="Brief information about this badge">
            <IconInfoCircle
              width="15px"
              className="text-gray-400 hover:text-gray-200 cursor-pointer"
            />
          </ToolTip>
        </h1>
        <p className="text-gray-400 font-light text-sm">
          This badge indicates that a user has completed Tier 1 Know Your
          Customer (KYC) registration.
        </p>
        <div className="flex gap-5">
          <div>
            <h1 className="text-gray-200 flex items-center gap-2 mt-4">
              Target{" "}
              <ToolTip tip="The user that is required to have this badge">
                <IconInfoCircle
                  width="15px"
                  className="text-gray-400 hover:text-gray-200 cursor-pointer"
                />
              </ToolTip>
            </h1>
            <p className="text-gray-400 font-light text-sm">
              Liquidity Provider
            </p>
          </div>
          <div>
            <h1 className="text-gray-200 flex items-center gap-2 mt-4">
              Issuer{" "}
              <ToolTip tip="The website of the badge issuer">
                <IconInfoCircle
                  width="15px"
                  className="text-gray-400 hover:text-gray-200 cursor-pointer"
                />
              </ToolTip>
            </h1>
            <p className="text-gray-400 font-light text-sm">
              <a
                href="http://google.com"
                className="hover:text-gray-200 transition-all"
              >
                https://google.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <iframe
          className="w-full h-[400px]"
          src="https://nairaland.com"
        ></iframe>
      </div>
    </div>
  );
}

function BadgePill({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <SheetTrigger>
        <Badge
          className="font-normal tracking-wider cursor-pointer bg-gray-900 border hover:border-chinese-green rounded-full border-gray-700 text-gray-300 hover:bg-chinese-green hover:text-gray-900"
          variant="secondary"
        >
          {name}
        </Badge>
      </SheetTrigger>
      <SheetContent
        className="w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0"
        side="right"
      >
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
              Badge: {name.split(":")[1] || name}
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className=" text-white h-full">
          <ScrollArea type="scroll" className="h-full pb-10">
            <BadgeSheetContent badge />
          </ScrollArea>
        </div>
        <div
          className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            setOpen(false);
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MarketItem({ base, quote }: { base: string; quote: string }) {
  return (
    <div className="bg-card-background border border-gray-800 transition-all hover:border-gray-700 duration-300 hover:scale-[1.002] cursor-pointer rounded-xl">
      <div className="flex h-auto">
        <div className="h-full border-r select-none border-gray-800 shrink-0">
          <div className="flex items-center gap-3 px-3 md:px-5 py-4">
            <PairAvatar
              baseSrc="/images/icons/asset-icons/btc.svg"
              quoteSrc="/images/icons/asset-icons/uni.svg"
            />
            <div className="flex flex-col">
              <span>
                {base} - {quote}
              </span>
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
                tip={`The price of 1 ${base} in USD`}
                title2={
                  <span className="text-green-400 hidden xxs:inline">
                    (+10%)
                  </span>
                }
              >
                $1,234
              </MarketStat>
              <MarketStat
                title="Price"
                title2="(UNI)"
                tip={`The price of 1 ${base} in ${quote}`}
              >
                50,640
              </MarketStat>
              <MarketStat
                title="24hrs Volume"
                title2=""
                tip={`The total volume of ${base} traded in the last 24hrs`}
              >
                <span className="text-gray-200">$45m</span>
              </MarketStat>
              <MarketStat
                title="Total Liquidity"
                title2=""
                tip={`The total amount of ${base} in the market`}
              >
                <span className="text-gray-200">$125m</span>
              </MarketStat>
              <MarketStat
                title="Commission"
                title2="(%)"
                tip={`The commission reserved for the market owner`}
              >
                <span className="text-gray-200"> 0.5</span>
              </MarketStat>
              <MarketStat
                title="Offer Only"
                title2=""
                width="w-[125px]"
                tip={`Only offers can be made on this market. No direct swap.`}
              >
                <span className="text-gray-200">YES</span>
              </MarketStat>
              <MarketStat
                title="PUT Open"
                title2=""
                width="w-[125px]"
                tip={`Liquidity providers must be allow-listed to provider liquidity to this market`}
              >
                <span className="text-gray-200">YES</span>
              </MarketStat>
              <MarketStat
                title="SWAP Open"
                title2=""
                tip={`Takers must be allow-listed to swap liquidity from this market`}
              >
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
            <ToolTip tip="Badges required by the market creator. LP stands for 'Liquidity Provider', TK for 'Taker'">
              <span className="opacity-50 hover:opacity-100 hover:text-chinese-green cursor-pointer transition-all duration-300">
                <IconInfoCircle />
              </span>
            </ToolTip>
          </div>
          <div className="flex-1 overflow-hidden tracking-wider scroll-shadow">
            <ScrollAreaHorizontal type="scroll">
              <div className="flex items-center gap-2 pr-3">
                <BadgePill name="LP:KYC" />
                <BadgePill name="TK:KYC" />
                <BadgePill name="NIGERIAN" />
                <BadgePill name="MERCHANT" />
                <BadgePill name="MERCHANT" />
              </div>
            </ScrollAreaHorizontal>
          </div>
        </div>
        <div className="flex items-center border-l border-gray-800 pl-2">
          <span className="inline-block pb-0 hover:text-chinese-green text-gray-400 transition-all duration-300 hover:scale-110">
            <IconHeart />
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
      className="w-full h-full transition-all duration-500"
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollAreaHorizontal type="scroll" className="w-full">
          <div className="flex flex-1 w-full gap-2 items-center px-2 scroll-shadow py-2">
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
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex xl:hidden gap-1 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green"
            onClick={() => setOpenFilterSheet(true)}
          >
            <IconFilterOutline />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex gap-1 items-center transition-all duration-500 hover:scale-x-105"
          >
            <IconPlus />
            <span className="hidden md:inline">Create Market</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green"
              >
                <DotsVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-2xl bg-modal-background border-gray-600 text-gray-200 tracking-wide">
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  setOpenFilterSheet(true);
                }}
              >
                <IconFilterOutline className="text-chinese-green" /> Filter
                Markets
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="flex gap-2">
                <IconPlus className="text-chinese-green" /> Create Market
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TabsList>
      <TabsContent value="markets" className="p-3 flex flex-col gap-3">
        <MarketItem base="BTC" quote="UNI" />
        {/*<MarketItem />*/}
        {/*<MarketItem />*/}
      </TabsContent>
      <TabsContent value="my-activity" className=""></TabsContent>
      <TabsContent value="top" className="px-5">
        <ActivityStream />
      </TabsContent>
      <MarketFilterSheet
        active={openFilterSheet}
        onOpen={(open) => {
          setOpenFilterSheet(open);
        }}
      />
    </Tabs>
  );
}

function MarketFilterSheet({
  active,
  onOpen,
  children,
}: {
  active?: boolean;
  onOpen?: (open: boolean) => void;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(active);

  useEffect(() => {
    setOpen(active);
    onOpen && onOpen(active || false);
  }, [active, onOpen]);

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        onOpen && onOpen(open);
      }}
    >
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        className="w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0"
        side="right"
      >
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
              Filter Markets
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className=" text-white h-full">
          <ScrollArea type="scroll" className="h-full pb-10">
            <MarketFilterContent />
          </ScrollArea>
        </div>
        <div
          className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            setOpen(false);
            onOpen && onOpen(false);
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Market() {
  return (
    <Layout
      tab={<MarketTabs />}
      rightSide={
        <div className="flex flex-col justify-between h-full">
          <MarketFilter />
          <Footer />
        </div>
      }
    />
  );
}
