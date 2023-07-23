import React, { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import { PairAvatar } from "../avatar/PairAvatar.tsx";
import IconCopyFilled from "../icons/IconCopyFilled.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";
import { cn } from "../../libs/utils.ts";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { Input } from "../ui/Input.tsx";
import { Button } from "../ui/Button.tsx";
import { Switch } from "../ui/switch.tsx";

function EditRow({
  title,
  children,
  className,
  tip,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  tip?: React.ReactNode;
}) {
  return (
    <AccordionItem value={title} className={cn(className)}>
      <AccordionTrigger className="px-5 py-3 tracking-wider ">
        <div className="flex items-center gap-2 text-[16px]">
          <span>{title}</span>
          <ToolTip tip={tip}>
            <span className="opacity-60 hover:opacity-100 cursor-pointer">
              <IconInfoCircle width="16" />
            </span>
          </ToolTip>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-gray-200 px-5 pt-1">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

function EditFieldWithLabel({
  label,
  tip,
  value: val,
  children,
  placeholder,
}: {
  label: ReactNode;
  placeholder?: string;
  tip?: ReactNode;
  value?: string;
  children?: ReactNode;
}) {
  const [value, setValue] = useState(val);

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-2 shrink-0 text-gray-400">
        <div>{label}</div>
        <div className="text-gray-400 hover:text-gray-200 cursor-pointer transition-all duration-500">
          <ToolTip tip={tip}>
            <IconInfoCircle width="15px" />
          </ToolTip>
        </div>
      </div>
      <div className="w-full flex justify-end">
        {!children && (
          <Input
            type="text"
            value={value}
            className="px-3"
            placeholder={placeholder}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        )}

        {children && children}
      </div>
    </div>
  );
}

export function EditMarketSheet({
  children,
  active,
  onOpen,
}: {
  children?: ReactNode;
  active?: boolean;
  onOpen?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(active || false);
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
              Edit Market
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="flex flex-col text-gray-200 ">
          <div className="flex w-full px-5 py-2 items-center bg-card-background border-b border-gray-800">
            <PairAvatar
              base="BTC"
              quote="UNI"
              baseSrc="/images/icons/asset-icons/btc.svg"
              quoteSrc="/images/icons/asset-icons/uni.svg"
              className="[&>span>img]:w-[25px]"
              className2="[&>span>img]:w-[25px] !-ml-5"
            />
            <span className="-ml-1">BTC-UNI</span>
            <span className="flex-1 gap-2 text-sm text-gray-400 flex justify-end">
              <span>ID: 0xAbC</span>
              <span className="">
                <IconCopyFilled
                  width="15"
                  className="hover:text-chinese-green cursor-pointer transition-all duration-300"
                />
              </span>
            </span>
          </div>

          <Accordion type="single" className="mt-0">
            <EditRow title="Commission" tip="Update the market's commission">
              <div className="w-full flex gap-4">
                <Input type="text" className="px-3 py-4" value="0.2" />
                <Button>Update</Button>
              </div>
            </EditRow>

            <EditRow
              title="Dispute"
              tip="Update the market's dispute parameters"
            >
              <div className="flex flex-col gap-2">
                <EditFieldWithLabel
                  label={<div className={"w-[150px]"}>Dispute Delay</div>}
                  tip="The duration to wait before initiating a dispute after a trade is marked as paid."
                  value="86400"
                />
                <EditFieldWithLabel
                  label={<div className={"w-[150px]"}>Evidence Duration</div>}
                  tip="The time frame for submitting and analyzing evidence in a dispute."
                  value="86400"
                />
                <EditFieldWithLabel
                  label={<div className={"w-[150px]"}>Voting Duration</div>}
                  tip="The time frame for voting in a dispute. Half of the time is for vote committing and the other half is for vote revealing."
                  value="86400"
                />
                <Button className="mt-2">Update</Button>
              </div>
            </EditRow>

            <EditRow
              title="Market Manager"
              tip="Market managers can force trades to be released or cancelled. Setting a manager disables on-chain dispute resolution."
            >
              <div className="w-full flex gap-4">
                <Input
                  type="text"
                  className="px-3 py-4"
                  placeholder="Enter an address (ex: 0xAbC...)"
                />
                <Button>Update</Button>
              </div>
            </EditRow>

            <EditRow title="Offer" tip="Update the market's dispute parameters">
              <div className="flex flex-col gap-2">
                <EditFieldWithLabel
                  label={<div className={"w-auto"}>Enable Offer Only mode</div>}
                  tip="Make the market offer-only. This means swaps can only be initiated through offers to liquidity providers. Note: This cannot be undone."
                >
                  <Switch />
                </EditFieldWithLabel>
              </div>
            </EditRow>

            <EditRow
              title="Zero Pricing"
              tip="Update the market's dispute parameters"
            >
              <div className="flex flex-col gap-2">
                <EditFieldWithLabel
                  label={
                    <div className={"w-auto"}>Allow Zero Price Liquidity</div>
                  }
                  tip="Allow liquidity providers to add liquidity with zero price. This is useful for offer-only markets where price is determined after a bargaining process."
                >
                  <Switch />
                </EditFieldWithLabel>
              </div>
            </EditRow>

            <EditRow
              title="Badge Limits"
              tip="Specify required badges liquidity providers or takers must have to trade in this market. Up to 8 badges can be specified."
            >
              <div className="flex flex-col gap-2">
                <EditFieldWithLabel
                  label={<div className={"w-[130px]"}>Liquidity Provider</div>}
                  tip="Specify up to 8 badges that liquidity providers must have to trade in this market. Separate badges with a comma."
                  placeholder="ex: kyc, merchant"
                />
                <EditFieldWithLabel
                  label={<div className={"w-[130px]"}>Taker</div>}
                  tip="Specify up to 8 badges that takers must have to trade in this market. Separate badges with a comma."
                  placeholder="ex: kyc, merchant"
                />
                <Button className="mt-2">Update</Button>
              </div>
            </EditRow>

            <EditRow
              title="Transfer Ownership"
              tip="Transfer ownership of the market to another account. Future commisions will be sent to the new owner. This cannot be undone."
            >
              <div className="w-full flex gap-4">
                <Input
                  type="text"
                  className="px-3 py-4"
                  placeholder="ex: 0xAbC..."
                />
                <Button variant="destructive">Transfer</Button>
              </div>
            </EditRow>

            <EditRow
              title="Renounce Ownership"
              tip="Renounce the right to modify this market. Future commisions will still be sent to the market creator. This cannot be undone."
            >
              <div className="w-full flex gap-4">
                <Button variant="destructive">Renounce</Button>
              </div>
            </EditRow>
          </Accordion>
        </div>
        <div
          className="absolute cursor-pointer text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
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
