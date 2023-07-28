import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { Avatar } from "../avatar/Avatar.tsx";
import { Input } from "../ui/Input.tsx";
import { cn } from "../../libs/utils.ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";
import { Label } from "../ui/label.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { IconSettingsOutline } from "../icons/IconSettingsOutline.tsx";
import { Button } from "../ui/Button.tsx";

function SwapInput(props: { avatar: string; avatarFallback: string }) {
  const [focus, setFocus] = useState(false);
  return (
    <div
      className={cn(
        "rounded-full h-12 bg-card-background border border-gray-700 hover:border-chinese-green flex pl-[6px] pt-[3px] transition-all duration-300",
        { "border-chinese-green scale-105": focus }
      )}
    >
      <Avatar
        src={props.avatar}
        className="w-[35px]"
        fallback={props.avatarFallback}
      />
      <Input
        type="number"
        variant="ghost"
        placeholder="0.0"
        className="ml-1 mt-[3px] mr-2 rounded-full pl-2 text-xl"
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
      />
    </div>
  );
}

export function CreateOfferSheet(props: {
  open: boolean;
  onOpenChange?: (open) => void;
}) {
  const [open, setOpen] = React.useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <Sheet open={open} onOpenChange={props.onOpenChange}>
      <SheetContent
        className="w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0"
        side="right"
      >
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
              Create Offer
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className=" text-white h-full">
          <div className="flex text-gray-400 w-full px-5 py-2 items-center bg-card-background border-b border-gray-900">
            <span className="flex gap-2 items-center text-sm">
              <span>
                1 BTC <span className="text-gray-400">@</span>
              </span>
              <span className="flex  flex-co items-center gap-2">
                <span>240.56 UNI</span>
                <span className="text-gray-500 text-xs">($24,000)</span>
              </span>
            </span>
          </div>

          <div className="px-4 pt-5 mb-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 pl-4 text-gray-200 tracking-wide">
                  <span>Amount</span>
                  <ToolTip tip="The amount of BASE you want">
                    <IconInfoCircle width="15px" className="text-gray-400" />
                  </ToolTip>
                </span>
                <span className="font-extralight text-xs text-blue-300 pr-5">
                  $2,300
                </span>
              </div>
              <div className="flex flex-col">
                <SwapInput
                  avatar="/images/icons/asset-icons/btc.svg"
                  avatarFallback="BTC"
                />
                <div className="flex gap-2 text-gray-400 text-xs pl-3 pt-2">
                  <span>
                    <span className="text-gray-300">Available: </span>10,000
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-5">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 pl-4 text-gray-200 tracking-wide">
                  <span>Price</span>
                  <ToolTip tip="The price you are willing to pay">
                    <IconInfoCircle width="15px" className="text-gray-400" />
                  </ToolTip>
                </span>
                <span className="font-extralight text-xs text-blue-300 pr-5">
                  $2,300
                </span>
              </div>
              <div className="flex flex-col">
                <SwapInput
                  avatar="/images/icons/asset-icons/uni.svg"
                  avatarFallback="UNI"
                />
                <div className="flex flex-col text-gray-400 text-xs pl-3 pt-2">
                  <span>
                    <span className="text-gray-300">Current Price: </span>45.50
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 pt-0 px-3">
            <Accordion type="single" collapsible>
              <AccordionItem value="advanced" className="border-none p-1">
                <AccordionTrigger className="transition-all duration-300 rounded-full hover:bg-gray-800 text-xs !text-gray-300 pb-1 tracking-wide p-1 px-3">
                  <div className="flex items-center gap-2">
                    <IconSettingsOutline width="15px" /> Advanced Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 px-3 tracking-wide">
                  <div className="flex justify-between mt-3">
                    <Label className="font-normal flex items-center gap-1">
                      <span>Expire</span>
                      <ToolTip tip="The number of seconds within which the offer is expected to be executed, otherwise, it is cancelled.">
                        <IconInfoCircle width="13px" />
                      </ToolTip>
                    </Label>
                    <div>
                      <Input
                        type="number"
                        className="w-[100px] pl-2"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bottom-0 absolute w-full p-3 border-t border-gray-800 flex flex-col gap-2">
            <Button size="full">Create</Button>
          </div>
        </div>
        <div
          className="absolute cursor-pointer text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            setOpen(false);
            props.onOpenChange && props.onOpenChange(false);
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
