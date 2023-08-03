import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs.tsx";
import Layout from "./Layout.tsx";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import ScrollGradientIndicator from "../components/ScrollGradientIndicator.tsx";
import { SwapRow } from "../components/swap/SwapRow.tsx";
import { Label } from "../components/ui/label.tsx";
import IconInfoCircle from "../components/icons/IconInfoCircle.tsx";
import { Button } from "../components/ui/Button.tsx";
import { ToolTip } from "../components/ToolTip.tsx";
import EmojiAvatar from "../components/avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../components/avatar/useAvatar.tsx";
import { shortenAddress } from "../libs/helpers.ts";
import { Messenger } from "../components/messenger/Messenger.tsx";
import { MessengerSheet } from "../components/messenger/MessengerSheet.tsx";
import { useMediaQuery } from "usehooks-ts";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

type EventType = "mark-paid";

function EventItem({
  initiator,
  type,
}: {
  initiator: string;
  type: EventType;
}) {
  return (
    <div className="flex gap-2 tracking-wider items-center px-3 py-3 text-gray-200 font-light text-sm">
      <span className="shrink-0">
        <EmojiAvatar size={AvatarSize.Small} randomStr={initiator} />
      </span>
      <div className="w-full">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            {type === "mark-paid" && (
              <div>
                <span className="text-white font-normal">
                  {shortenAddress(initiator)}
                </span>{" "}
                has marked the swap as paid
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400">2 days ago</span>
        </div>
      </div>
    </div>
  );
}

function Page() {
  const [openMessengerSheet, setOpenMessengerSheet] = useState(false);
  const isLg = useMediaQuery("(min-width: 1024px)");

  return (
    <Tabs
      defaultValue="my-swaps"
      className="w-full h-full transition-all duration-500"
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollGradientIndicator className="[&::before]:rounded-tr-none w-full">
          <ScrollAreaHorizontal type="scroll" className="w-full">
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="my-swaps"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Swap (ID: 001)
              </TabsTrigger>
            </div>
          </ScrollAreaHorizontal>
        </ScrollGradientIndicator>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="md:hidden justify-center flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green">
                <DotsVerticalIcon />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0"></DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TabsList>
      <TabsContent
        value="my-swaps"
        className="p-3 pt-0 flex flex-col gap-3 px-0 mt-0"
      >
        <SwapRow
          base="BTC"
          quote="UNI"
          className="rounded-none border-x-0 border-t-0"
          noFocus
        />
        <div className="flex flex-col md:gap-5 md:flex-row px-3">
          <div className="mt-3 flex-1">
            <Label className="text-xl md:px-5 flex justify-between">
              <div className="flex items-center gap-1">
                <span>Progress</span>
                <span className="mt-[2px]">
                  <ToolTip tip="Track the progress of the swap">
                    <IconInfoCircle width="18px" />
                  </ToolTip>
                </span>
              </div>
              <div>
                <Button
                  variant="ghost"
                  className="flex font-semibold items-center gap-1 text-chinese-green"
                  onClick={() => {
                    if (isLg) return;
                    setOpenMessengerSheet(true);
                  }}
                >
                  <MessageSquare width="20px" /> Chat
                  <div className="rounded-full h-[20px] min-w-[20px] px-[5px] leading-[20px] flex justify-center items-center  bg-red-600 text-[10px]">
                    2
                  </div>
                </Button>
              </div>
            </Label>
            <div>
              <div className="bg-card-background border rounded-2xl border-card-border w-full mt-3 pb-5">
                {/* -- when not payer -- */}

                {/* ---- when awaiting payment -- */}
                {/*<Label className="block p-5 py-3 pb-1 text-lg">*/}
                {/*  Awaiting Payment*/}
                {/*</Label>*/}
                {/*<div className="px-5 font-light text-gray-300 text-sm">*/}
                {/*  Waiting for the other party to send payment. This swap will be*/}
                {/*  eligible for cancellation when the waiting time is over.*/}
                {/*</div>*/}
                {/*<div className="px-5 text-2xl py-2 mt-3 mb-3 flex flex-col">*/}
                {/*  <span className="text-xs text-gray-500">CANCELABLE IN</span>*/}
                {/*  <span className="text-red-500">00:32:50</span>*/}
                {/*</div>*/}
                {/*<div className="px-5 mt-2">*/}
                {/*  <Button variant="destructive" size="full">*/}
                {/*    Cancel*/}
                {/*  </Button>*/}
                {/*</div>*/}
                {/* ---- end when awaiting payment */}

                {/* ---- when payment was made -- */}
                {/*<Label className="block p-5 py-3 pb-1 text-lg">Release</Label>*/}
                {/*<div className="px-5 font-light text-gray-300 text-sm">*/}
                {/*  The other party has made payment.{" "}*/}
                {/*  <b className="text-white tracking-wider">*/}
                {/*    Release the asset after you have verified the payment with*/}
                {/*    your payment method provider*/}
                {/*  </b>*/}
                {/*  .*/}
                {/*  <br />*/}
                {/*  <br />*/}
                {/*  <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">*/}
                {/*    <span>*/}
                {/*      <IconInfoCircle className="text-yellow-500" />*/}
                {/*    </span>*/}
                {/*    <span>*/}
                {/*      If you do not release the asset before the timer below*/}
                {/*      expires, the swap may be disputed.*/}
                {/*    </span>*/}
                {/*  </span>*/}
                {/*  <span className="p-2 mt-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">*/}
                {/*    <span>*/}
                {/*      <IconInfoCircle className="text-yellow-400" />*/}
                {/*    </span>*/}
                {/*    <span>*/}
                {/*      If you did not see the payment or there was a problem with*/}
                {/*      the payment, you can dispute the swap.*/}
                {/*    </span>*/}
                {/*  </span>*/}
                {/*  <span className="p-2 mt-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">*/}
                {/*    <span>*/}
                {/*      <IconInfoCircle className="text-yellow-400" />*/}
                {/*    </span>*/}
                {/*    <span>*/}
                {/*      Dispute may lock the liquidity for extended period of*/}
                {/*      time, so attempt to resolve any issue with the other party*/}
                {/*      using the messaging system first.*/}
                {/*    </span>*/}
                {/*  </span>*/}
                {/*</div>*/}
                {/*<div className="px-5 text-2xl py-2 mt-3 mb-3 flex flex-col">*/}
                {/*  <span className="text-xs text-gray-500">DISPUTABLE IN</span>*/}
                {/*  <span className="text-yellow-400">00:32:50</span>*/}
                {/*</div>*/}
                {/*<div className="flex px-5 mt-2 gap-2">*/}
                {/*  <Button*/}
                {/*    variant="default"*/}
                {/*    className="bg-green-500"*/}
                {/*    size="full"*/}
                {/*  >*/}
                {/*    Release*/}
                {/*  </Button>*/}
                {/*  <Button variant="outline" className="w-[150px]" disabled>*/}
                {/*    Dispute*/}
                {/*  </Button>*/}
                {/*</div>*/}
                {/* ---- end when payment was made */}
                {/* -- end when not payer -- */}

                {/* -- when payer -- */}
                {/* ---- when payment is requested -- */}
                {/*<Label className="block p-5 py-3 pb-1 text-lg">*/}
                {/*  Send Payment*/}
                {/*</Label>*/}
                {/*<div className="px-5 font-light text-gray-300 text-sm">*/}
                {/*  The other party requires payment.{" "}*/}
                {/*  <b className="text-white tracking-wider">*/}
                {/*    Send payment to the other party using the payment method*/}
                {/*    they shared with you in the chat.*/}
                {/*  </b>*/}
                {/*  .*/}
                {/*  <br />*/}
                {/*  <br />*/}
                {/*  <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">*/}
                {/*    <span>*/}
                {/*      <IconInfoCircle className="text-yellow-500" />*/}
                {/*    </span>*/}
                {/*    <span>*/}
                {/*      Click <b className="text-white">"I have Paid"</b> button*/}
                {/*      below after you have sent the payment.*/}
                {/*    </span>*/}
                {/*  </span>*/}
                {/*  <br />*/}
                {/*  <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">*/}
                {/*    <span>*/}
                {/*      <IconInfoCircle className="text-yellow-500" />*/}
                {/*    </span>*/}
                {/*    <span>*/}
                {/*      If you do not send payment before the timer below expires,*/}
                {/*      the swap will be eligible for cancellation.*/}
                {/*    </span>*/}
                {/*  </span>*/}
                {/*</div>*/}
                {/*<div className="px-5 text-2xl py-2 mt-3 mb-3 flex flex-col">*/}
                {/*  <span className="text-xs text-gray-500">CANCELABLE IN</span>*/}
                {/*  <span className="text-red-500">00:32:50</span>*/}
                {/*</div>*/}
                {/*<div className="flex px-5 mt-2 gap-2">*/}
                {/*  <Button*/}
                {/*    variant="default"*/}
                {/*    className="px-0 xxs:px-4"*/}
                {/*    size="full"*/}
                {/*  >*/}
                {/*    I have Paid*/}
                {/*  </Button>*/}
                {/*  <Button variant="outline" className="w-[150px]" disabled>*/}
                {/*    Cancel*/}
                {/*  </Button>*/}
                {/*</div>*/}
                {/* --- end when payment is requested */}

                {/* ---- when waiting for release -- */}
                <Label className="block p-5 py-3 pb-1 text-lg">
                  Awaiting Release
                </Label>
                <div className="px-5 font-light text-gray-300 text-sm">
                  The other party must verify your payment and is expected to
                  release the swap once your payment is confirmed.
                  <br />
                  <br />
                  <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                    <span>
                      <IconInfoCircle className="text-yellow-500" />
                    </span>
                    <span>
                      If the other party does not release the swap before the
                      timer below expires, you can start a dispute.
                    </span>
                  </span>
                  <br />
                  <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                    <span>
                      <IconInfoCircle className="text-yellow-500" />
                    </span>
                    <span>
                      You are encouraged to use the messaging system to resolve
                      issues with the other party before initiating a dispute.
                    </span>
                  </span>
                </div>
                <div className="px-5 text-2xl py-2 mt-3 mb-3 flex flex-col">
                  <span className="text-xs text-gray-500">DISPUTABLE IN</span>
                  <span className="text-yellow-500">00:32:50</span>
                </div>
                <div className="flex px-5 mt-2 gap-2">
                  <Button
                    variant="secondary"
                    className="px-0 xxs:px-4"
                    size="full"
                  >
                    Dispute
                  </Button>
                </div>
                {/* ---- end when waiting for release -- */}

                {/* -- end when payer -- */}
              </div>
            </div>
          </div>
          <div className="flex-1 pt-2 mt-5 md:mt-0">
            <Tabs
              defaultValue="instructions"
              className="w-full h-full  transition-all duration-500"
            >
              <ScrollGradientIndicator>
                <ScrollAreaHorizontal type="scroll" className="">
                  <TabsList className="justify-start px-3 py-2 pb-1 gap-2">
                    <TabsTrigger
                      value="instructions"
                      className="font-light px-3 lg:px-5 text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                    >
                      Instructions
                    </TabsTrigger>
                    <TabsTrigger
                      value="logs"
                      className="font-light px-3 lg:px-5 text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                    >
                      Events
                    </TabsTrigger>
                  </TabsList>
                </ScrollAreaHorizontal>
              </ScrollGradientIndicator>
              <TabsContent value="instructions" className="px-0 mt-4">
                <div className="bg-card-background border flex flex-col gap-2 rounded-2xl border-card-border w-full pb-3">
                  <div>
                    <Label className="block p-5 py-3 pb-1 text-lg">
                      Liquidity Instruction
                    </Label>
                    <p className="px-5 font-light text-sm text-gray-300">
                      I pay very fast. I will release the coins as soon as I
                      receive payment and confirm it. I will not release the
                      coins if I do not receive payment. Share your phone number
                      to get paid faster.
                    </p>
                  </div>

                  <div>
                    <Label className="block p-5 py-3 pb-1 text-lg">
                      Provider Instruction
                    </Label>
                    <p className="px-5 font-light text-sm text-gray-300">
                      I only trade with verified users that have a good
                      reputation and a good track record.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="logs" className="">
                <ScrollGradientIndicator
                  side="bottom"
                  className="[&>span.grad-indicator]:mb-[1px]"
                >
                  <div className="bg-card-background striped scrollbar-hide divide-y divide-gray-900 border rounded-2xl border-card-border w-full min-h-[200px] max-h-[400px] overflow-y-auto mt-4">
                    <EventItem
                      initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                      type="mark-paid"
                    />
                    <EventItem
                      initiator="0xf39Fd6e51aad88F6F6ce6aB8827279cffFb92266"
                      type="mark-paid"
                    />
                    <EventItem
                      initiator="0xf39Fd6e51aad88F6F6ce6aB8827279cffFb92266"
                      type="mark-paid"
                    />{" "}
                    <EventItem
                      initiator="0xf39Fd6e51aad88F6F6ce6aB8827279cffFb92266"
                      type="mark-paid"
                    />{" "}
                    <EventItem
                      initiator="0xf39Fd6e51aad88F6F6ce6aB8827279cffFb92266"
                      type="mark-paid"
                    />{" "}
                    <EventItem
                      initiator="0xf39Fd6e51aad88F6F6ce6aB8827279cffFb92266"
                      type="mark-paid"
                    />{" "}
                    <EventItem
                      initiator="0xf39Fd6e51aad88F6F6ce6aB8827279cffFb92266"
                      type="mark-paid"
                    />{" "}
                    <EventItem
                      initiator="0xf39Fd6e51aad88F6F6ce6aB8827279cffFb92266"
                      type="mark-paid"
                    />{" "}
                    {/*<EventItem*/}
                    {/*  initiator="0xf39Fd6e51aad88F6F6ce6aB8827279cffFb92266"*/}
                    {/*  type="mark-paid"*/}
                    {/*/>{" "}*/}
                    {/*<EventItem*/}
                    {/*  initiator="0xf39Fd6e51aad88F6F6ce6aB8827279cffFb92266"*/}
                    {/*  type="mark-paid"*/}
                    {/*/>{" "}*/}
                    {/*<EventItem*/}
                    {/*  initiator="0xf39Fd6e51aad88F6F6ce6aB8827279cffFb92266"*/}
                    {/*  type="mark-paid"*/}
                    {/*/>*/}
                  </div>
                </ScrollGradientIndicator>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <MessengerSheet
          open={openMessengerSheet}
          onOpenChange={(open) => {
            setOpenMessengerSheet(open);
          }}
        />
      </TabsContent>
    </Tabs>
  );
}

export default function Swap() {
  return (
    <Layout
      tab={<Page />}
      rightSide={
        <div className="flex flex-col w-full h-full py-3">
          <Messenger sheetMode={false} />
          {/*<Footer />*/}
        </div>
      }
    />
  );
}
