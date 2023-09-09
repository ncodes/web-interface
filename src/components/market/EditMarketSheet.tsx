import { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Accordion } from "../ui/accordion.tsx";
import { Input } from "../ui/Input.tsx";
import { Button } from "../ui/Button.tsx";
import { Switch } from "../ui/switch.tsx";
import { BasicMarketInfoSheetHeader } from "../BasicMarketInfoSheetHeader.tsx";
import { EditFieldWithLabel } from "./EditFieldWithLabel.tsx";
import { EditRow } from "./EditRow.tsx";
import { EditCommission } from "./EditCommission.tsx";
import { EditDisputeDurations } from "./EditDisputeDurations.tsx";
import { EditMarketManager } from "./EditMarketManager.tsx";

export function EditMarketSheet({
  market,
  children,
  active,
  onOpen,
}: {
  market: Market;
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
              Manage Market
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="flex flex-col text-gray-200 ">
          <BasicMarketInfoSheetHeader market={market} />

          <Accordion type="single" className="mt-0">
            <EditCommission market={market} />

            <EditDisputeDurations market={market} />

            <EditMarketManager market={market} />

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
                <Button size="sm" className="mt-2">
                  Update
                </Button>
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
                <Button size="sm" variant="destructive">
                  Transfer
                </Button>
              </div>
            </EditRow>

            <EditRow
              title="Renounce Ownership"
              tip="Renounce the right to modify this market. Future commisions will still be sent to the market creator. This cannot be undone."
            >
              <div className="w-full flex gap-4">
                <Button size="sm" variant="destructive">
                  Renounce
                </Button>
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
