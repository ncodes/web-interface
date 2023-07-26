import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { Accordion } from "../ui/accordion.tsx";

import { FilterItem } from "../FilterItem.tsx";
import { Input } from "../ui/Input.tsx";
import { Slider } from "../ui/slider.tsx";
import { Switch } from "../ui/switch.tsx";
import { Button } from "../ui/Button.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";

export function ManageLiquiditySheet(props: {
  open: boolean;
  onOpenChange: (open) => void;
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
              Manage Liquidity
            </SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="h-full">
          <div className=" text-white h-full">
            <p className="p-5 py-3 font-light text-gray-300 text-sm">
              Manage your liquidity. You can add, remove, restrict or pause your
              liquidity.
            </p>

            <Accordion defaultValue={["Amount"]} type="multiple">
              <FilterItem
                title="Amount"
                tip="Increase or reduce the amount of liquidity"
              >
                <div>
                  <div className="flex gap-4 items-center">
                    <Input value="34000" className="px-2" />
                    <div className="flex flex-col text-gray-400 text-xs">
                      <span className="">Current</span>
                      <span className="text-xs text-chinese-green">34,000</span>
                    </div>
                  </div>
                  {/*<p className="flex text-gray-500 text-xs pt-2 items-center gap-1">*/}
                  {/*  <IconInfoCircle width="14px" /> Subtracted amount is returned*/}
                  {/*  to the wallet.*/}
                  {/*</p>*/}
                  {/*<p className="flex text-gray-500 text-xs pt-2 items-center gap-1">*/}
                  {/*  <IconInfoCircle width="14px" /> Additional amount may require*/}
                  {/*  approval.*/}
                  {/*</p>*/}
                </div>
              </FilterItem>

              <FilterItem
                title="Price"
                tip="Update the price of your liquidity"
              >
                <div className="flex gap-4 items-center">
                  <Input value="35.00" className="px-2" />
                  <div className="flex shrink-0 flex-col text-gray-400 text-xs">
                    <span className="">Current</span>
                    <span className="text-xs text-chinese-green">
                      35.50 <span className="text-gray-200">UNI</span>
                    </span>
                  </div>
                </div>
              </FilterItem>

              <FilterItem
                title="Minimum Swap Amount"
                tip="Update the minimum swap amount"
              >
                <div className="flex gap-4 items-center">
                  <Input value="200" className="px-2" />
                  <div className="flex shrink-0 flex-col text-gray-400 text-xs">
                    <span className="">Current</span>
                    <span className="text-xs text-chinese-green">200</span>
                  </div>
                </div>
              </FilterItem>

              <FilterItem
                title="Maximum Swap Amount"
                tip="Update the maximum swap amount"
              >
                <div className="flex gap-4 items-center">
                  <Input value="530" className="px-2" />
                  <div className="flex shrink-0 flex-col text-gray-400 text-xs">
                    <span className="">Current</span>
                    <span className="text-xs text-chinese-green">530</span>
                  </div>
                </div>
              </FilterItem>

              <FilterItem
                title="Payment Time"
                tip="Update time you expect to receive payment (in seconds)"
              >
                <div className="flex gap-4">
                  <div className="flex flex-col gap-3">
                    <Input value="4500" type="number" className="px-2" />
                    <Slider defaultValue={[1800]} min={0} max={3600} step={1} />
                  </div>
                  <div className="flex shrink-0 flex-col text-gray-400 text-xs">
                    <span className="">Payment Time</span>
                    <span className="text-xs text-chinese-green">
                      15 minutes
                    </span>
                  </div>
                </div>
              </FilterItem>

              <FilterItem
                title="Target"
                tip="Specify an address that will only be allowed to swap the liquidity"
              >
                <div className="flex gap-4">
                  <div className="flex flex-col gap-3">
                    <Input value="0x1234567890" type="text" className="px-2" />
                  </div>
                  <div className="flex shrink-0 flex-col text-gray-400 text-xs">
                    <span className="">Current</span>
                    <span className="text-xs text-chinese-green">
                      0x123..XyZ
                    </span>
                  </div>
                </div>
              </FilterItem>

              <FilterItem
                title="Pause"
                tip="Pause the liquidity so it cannot be swapped"
              >
                <div className="flex gap-4">
                  <div className="flex flex-col gap-3">
                    <Switch checked={true} />
                  </div>
                </div>
              </FilterItem>
            </Accordion>
          </div>
        </ScrollArea>
        <div className="bottom-0 absolute w-full p-3 border-t border-gray-800 flex flex-col gap-2">
          {/*<Button size="full" variant="secondary">*/}
          {/*  Approve*/}
          {/*</Button>*/}
          <Button size="full">Update</Button>
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
