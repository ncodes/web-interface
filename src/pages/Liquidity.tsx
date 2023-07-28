import {
  ScrollArea,
  ScrollAreaHorizontal,
} from "../components/ui/scroll-area.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs.tsx";
import Layout from "./Layout.tsx";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import ScrollGradientIndicator from "../components/ScrollGradientIndicator.tsx";
import { LiquidityRow } from "../components/liquidity/LiquidityRow.tsx";
import { Footer } from "../components/Footer.tsx";
import { Label } from "../components/ui/label.tsx";
import { ToolTip } from "../components/ToolTip.tsx";
import EmojiAvatar from "../components/avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../components/avatar/useAvatar.tsx";
import { shortenAddress } from "../libs/helpers.ts";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import {
  SwapSheet,
  SwapSheetContent,
} from "../components/liquidity/SwapSheet.tsx";
import { Button } from "../components/ui/Button.tsx";
import { useState } from "react";

type ActivityType = "add-liquidity" | "remove-liquidity" | "swap";

function ActivityItem({
  initiator,
  type,
}: {
  initiator: string;
  type: ActivityType;
}) {
  return (
    <div className="flex gap-2 tracking-wider items-center px-3 py-3 text-gray-200 font-light text-sm">
      <span className="shrink-0">
        <EmojiAvatar size={AvatarSize.Small} randomStr={initiator} />
      </span>
      <div className="w-full">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            {type === "add-liquidity" && (
              <div>
                <span className="text-white font-normal">
                  {shortenAddress(initiator)}
                </span>{" "}
                added <span className="text-chinese-green">45 BTC</span>{" "}
                liquidity
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400">2 days ago</span>
        </div>
      </div>
    </div>
  );
}

function ActivityLog() {
  return (
    <div className=" pr-0 flex-1">
      <Label className="text-xl flex items-center gap-1 px-5">
        <span>Activity Logs</span>{" "}
        <ToolTip tip="Recent events associated with this liquidity">
          <InfoCircledIcon width="20px" />
        </ToolTip>
      </Label>
      <div className="bg-card-background divide-y divide-gray-800 border rounded-2xl mt-5 border-card-border w-full min-h-[300px]">
        <ScrollGradientIndicator side="bottom">
          <ScrollArea type="scroll" className="h-[400px]">
            <ActivityItem
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              type="add-liquidity"
            />
            <ActivityItem
              initiator="0xf39Fd6e51aad88F6F6ce6aB8827279cffFb92266"
              type="add-liquidity"
            />
            <ActivityItem
              initiator="0xf39Fd6e51aad88F6F5ce6aB8827279cffFb92266"
              type="add-liquidity"
            />
            <ActivityItem
              initiator="0xf39Fd6e51aad88A6F5ce6aB8827279cffFb92266"
              type="add-liquidity"
            />
            <ActivityItem
              initiator="0xA39Fd6e51aad88A6F5ce6aB8827279cffFb92266"
              type="add-liquidity"
            />
            <ActivityItem
              initiator="0xA39FdXe51aad88A6F5ce6aB8827279cffFb92266"
              type="add-liquidity"
            />
            <ActivityItem
              initiator="0xA39Fd6e5Oaad88A6F5ce6aB8827279cffFb92266"
              type="add-liquidity"
            />
            <ActivityItem
              initiator="0xA39Fd6e5Oaad88A6F5ce6aBA827279cffFb92266"
              type="add-liquidity"
            />
            <ActivityItem
              initiator="0xA39Fd6e5Oaad88O6F5ce6aB8827279cffFb92266"
              type="add-liquidity"
            />
            <ActivityItem
              initiator="0xA39Fd6e5Oaad88A6F5ce6aB8827279cffFb92268"
              type="add-liquidity"
            />
          </ScrollArea>
        </ScrollGradientIndicator>
      </div>
    </div>
  );
}

function ReviewItem({
  initiator,
  good,
  msg,
}: {
  initiator: string;
  good?: boolean;
  msg?: string;
}) {
  return (
    <div className="flex gap-2 tracking-wider items-center px-3 py-3 text-gray-200 font-light text-sm">
      <span className="shrink-0">
        {!good && (
          <span className="bg-red-600 block rounded-full p-[5px]">
            <ThumbsDown size={20} className="text-red-200" />
          </span>
        )}
        {good && (
          <span className="bg-green-600 block rounded-full p-[5px]">
            <ThumbsUp size={20} className="text-green-200" />
          </span>
        )}
      </span>
      <div className="w-full">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            {!good && (
              <div>
                <span className="text-white font-normal">
                  {shortenAddress(initiator)}:
                </span>{" "}
                {msg}
              </div>
            )}
            {good && (
              <div>
                <span className="text-white font-normal">
                  {shortenAddress(initiator)}:
                </span>{" "}
                {msg}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400">2 days ago</span>
        </div>
      </div>
    </div>
  );
}

function RecentReviews() {
  return (
    <div className="lg:px-5 flex-1 flex flex-col">
      <Label className="text-xl flex items-center gap-1">
        <span>Recent Reviews</span>{" "}
        <ToolTip tip="Recent reviews posted by takers of this liquidity">
          <InfoCircledIcon width="20px" />
        </ToolTip>
      </Label>
      <div className="flex-1 bg-card-background divide-y divide-gray-800 border rounded-2xl mt-5 border-card-border w-full">
        <ScrollGradientIndicator side="bottom">
          <ScrollArea type="scroll" className="h-[400px]">
            <ReviewItem
              good={true}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="This person is fast and a good communicator"
            />
            <ReviewItem
              good={false}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="I wish i never selected you"
            />
            <ReviewItem
              good={false}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="He held my money for 2 days"
            />
            <ReviewItem
              good={true}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="Best price ever. I will be coming back."
            />
            <ReviewItem
              good={true}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="Patient seller. Could be more quicker though"
            />
            <ReviewItem
              good={false}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="He yelled at me for no reason. I will never come back"
            />
            <ReviewItem
              good={true}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg=""
            />
          </ScrollArea>
        </ScrollGradientIndicator>
      </div>
    </div>
  );
}

function LiquidityTabContent() {
  return (
    <div className="">
      <LiquidityRow base="BTC" quote="UNI" noFocus={true} />
      <div className="flex flex-col gap-5 lg:gap-0 lg:flex-row pt-5">
        <ActivityLog />
        <RecentReviews />
      </div>
    </div>
  );
}

function Page() {
  const [openSwapSheet, setOpenSwapSheet] = useState(false);

  return (
    <Tabs
      defaultValue="liquidity"
      className="w-full h-full transition-all duration-500"
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollGradientIndicator className="[&::before]:rounded-tr-none w-full">
          <ScrollAreaHorizontal type="scroll" className="w-full">
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2">
              <TabsTrigger
                value="liquidity"
                className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
              >
                Liquidity
              </TabsTrigger>
            </div>
          </ScrollAreaHorizontal>
        </ScrollGradientIndicator>
        <div>
          <Button
            variant="secondary"
            size="sm"
            className="xl:hidden w-[100px]"
            onClick={() => {
              setOpenSwapSheet(true);
            }}
          >
            Swap
          </Button>
        </div>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end">
          {/*<DropdownMenu>*/}
          {/*  <DropdownMenuTrigger>*/}
          {/*    <span className="md:hidden justify-center flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green">*/}
          {/*      <DotsVerticalIcon />*/}
          {/*    </span>*/}
          {/*  </DropdownMenuTrigger>*/}
          {/*  <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0"></DropdownMenuContent>*/}
          {/*</DropdownMenu>*/}
        </div>
      </TabsList>
      <TabsContent value="liquidity" className="p-3 pt-0 flex flex-col gap-3">
        <LiquidityTabContent />
        <SwapSheet
          open={openSwapSheet}
          onOpenChange={(open) => {
            setOpenSwapSheet(open);
          }}
        />
      </TabsContent>
    </Tabs>
  );
}

function SwapSheetWrapper() {
  return (
    <div className="flex flex-col pt-3">
      <Label className="text-xl">Swap</Label>
      <div className="border border-gray-700 bg-card-background rounded-xl mt-3 overflow-hidden">
        <SwapSheetContent offsheet={true} />
      </div>
    </div>
  );
}

export default function Liquidity() {
  return (
    <Layout
      tab={<Page />}
      rightSide={
        <div className="flex w-full flex-col h-full mt-2">
          <SwapSheetWrapper />
          <div className="absolute bottom-0">
            <Footer />
          </div>
        </div>
      }
    />
  );
}
