import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion.tsx";
import { Input } from "./ui/Input.tsx";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group.tsx";
import { Label } from "./ui/label.tsx";
import IconInfoCircle from "./icons/IconInfoCircle.tsx";
import React from "react";
import { cn } from "../libs/utils.ts";
import { Button } from "./ui/Button.tsx";

function FilterItem({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AccordionItem value={title} className={cn(className)}>
      <AccordionTrigger className="px-5 py-3 tracking-wider">
        <div className="flex items-center gap-2">
          <span>{title}</span>
          <span className="opacity-60 hover:opacity-100 cursor-pointer">
            <IconInfoCircle width="15" />
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-gray-200 px-5 pt-1">
        <div className="flex gap-2">
          <div className="flex-1 flex">{children}</div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function MarketFilterContent() {
  return (
    <div>
      <Accordion defaultValue={["Price"]} type="multiple">
        <FilterItem title="Price">
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

        <FilterItem title="Available Liquidity">
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

        <FilterItem title="Merchants Only">
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

        <FilterItem title="KYC'd Liquidity Providers">
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

        <FilterItem title="KYC'd Takers">
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

        <FilterItem title="Offer Only">
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

        <FilterItem title="By Market ID">
          <Input type="text" placeholder="e.g. 0x0..." className="pl-2" />
        </FilterItem>

        <FilterItem title="By Creator">
          <Input type="text" placeholder="e.g. 0x0..." className="pl-2" />
        </FilterItem>

        <FilterItem title="PUT Permissioned">
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

        <FilterItem title="SWAP Permissioned">
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

        <FilterItem title="PUT Badges">
          <RadioGroup defaultValue="false" className="flex flex-1 gap-3">
            <Input
              type="text"
              placeholder="e.g merchant, bitcoiner"
              className="pl-2"
            />
          </RadioGroup>
        </FilterItem>

        <FilterItem title="SWAP Badges" className="border-none">
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

export function MarketFilter() {
  return (
    <div className="pt-3">
      <h1 className="text-lg md:text-xl mb-3">Filter Markets</h1>
      <div className="bg-card-background border border-gray-800 rounded-2xl w-full ">
        <MarketFilterContent />
      </div>
    </div>
  );
}
