import { Accordion } from "../ui/accordion.tsx";
import { Input } from "../ui/Input.tsx";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group.tsx";
import { Label } from "../ui/label.tsx";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "../ui/Button.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";

import { FilterItem } from "../FilterItem.tsx";

export function FilterContent() {
  return (
    <div>
      <Accordion defaultValue={["Price"]} type="multiple">
        <FilterItem title="Price" tip="Filter by price (QUOTE)">
          <div>
            <Input
              placeholder="0.00"
              className="w-[121px] px-2 hover:border-chinese-green hover:scale-x-105 focus:scale-x-105"
            />
          </div>
          <div className="flex-1 px-3 flex">
            <RadioGroup defaultValue="lower" className="flex flex-1 gap-3">
              <span className="flex items-center gap-2">
                <RadioGroupItem value="lower" id="lower" />
                <Label htmlFor="lower" className="font-light tracking-wider">
                  Lower
                </Label>
              </span>
              <span className="flex items-center gap-2">
                {" "}
                <RadioGroupItem value="higher" id="higher" />
                <Label htmlFor="higher" className="font-light tracking-wider">
                  Higher
                </Label>
              </span>
            </RadioGroup>
          </div>
        </FilterItem>

        <FilterItem
          title="Available Liquidity"
          tip="Find liquidity with certain available amount"
        >
          <div>
            <Input
              placeholder="0.00"
              className="w-[121px] px-2 hover:border-chinese-green hover:scale-x-105 focus:scale-x-105"
            />
          </div>
          <div className="flex-1 px-3 flex">
            <RadioGroup defaultValue="lower" className="flex flex-1 gap-3">
              <span className="flex items-center gap-2">
                <RadioGroupItem value="lower" id="lower" />
                <Label htmlFor="lower" className="font-light tracking-wider">
                  Lower
                </Label>
              </span>
              <span className="flex items-center gap-2">
                {" "}
                <RadioGroupItem value="higher" id="higher" />
                <Label htmlFor="higher" className="font-light tracking-wider">
                  Higher
                </Label>
              </span>
            </RadioGroup>
          </div>
        </FilterItem>

        <FilterItem
          title="Merchants Only"
          tip="Find liquidities provided by merchants"
        >
          <RadioGroup defaultValue="false" className="flex flex-1 gap-3">
            <span className="flex items-center gap-2">
              <RadioGroupItem value="false" id="no" />
              <Label htmlFor="no" className="font-light tracking-wider">
                No
              </Label>
            </span>
            <span className="flex items-center gap-2">
              {" "}
              <RadioGroupItem value="true" id="yes" />
              <Label htmlFor="yes" className="font-light tracking-wider">
                Yes
              </Label>
            </span>
          </RadioGroup>
        </FilterItem>

        <FilterItem
          title="KYC'd Liquidity Providers"
          tip="Find liquidities provided by users who have completed KYC"
        >
          <RadioGroup defaultValue="false" className="flex flex-1 gap-3">
            <span className="flex items-center gap-2">
              <RadioGroupItem value="false" id="no" />
              <Label htmlFor="all" className="font-light tracking-wider">
                No
              </Label>
            </span>
            <span className="flex items-center gap-2">
              {" "}
              <RadioGroupItem value="true" id="yes" />
              <Label htmlFor="yes" className="font-light tracking-wider">
                Yes
              </Label>
            </span>
          </RadioGroup>
        </FilterItem>

        <FilterItem
          title="KYC'd Takers"
          tip="Find liquidities only available to takers that have completed KYC"
        >
          <RadioGroup defaultValue="false" className="flex flex-1 gap-3">
            <span className="flex items-center gap-2">
              <RadioGroupItem value="false" id="no" />
              <Label htmlFor="all" className="font-light tracking-wider">
                No
              </Label>
            </span>
            <span className="flex items-center gap-2">
              {" "}
              <RadioGroupItem value="true" id="yes" />
              <Label htmlFor="yes" className="font-light tracking-wider">
                Yes
              </Label>
            </span>
          </RadioGroup>
        </FilterItem>

        <FilterItem
          title="By Provider"
          tip="Find a liquidity by its owner's address"
        >
          <Input type="text" placeholder="e.g. 0x0..." className="pl-2" />
        </FilterItem>

        <FilterItem
          title="SWAP Badges"
          className="border-none"
          tip="Find liquidities that require takers to have one or more badges"
        >
          <RadioGroup defaultValue="false" className="flex flex-1 gap-3">
            <Input
              type="text"
              placeholder="e.g kyc, trekkie"
              className="pl-2"
            />
          </RadioGroup>
        </FilterItem>
      </Accordion>
      <div className="px-5 py-5">
        <Button size="full">Filter</Button>
      </div>
    </div>
  );
}

export function LiquidityFilter() {
  return (
    <div className="pt-3 flex-1">
      <h1 className="text-lg md:text-xl mb-3">Filter Liquidity</h1>
      <div className="bg-card-background border border-gray-800 rounded-2xl w-full ">
        <FilterContent />
      </div>
    </div>
  );
}

export function LiquidityFilterSheet({
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
            <FilterContent />
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
