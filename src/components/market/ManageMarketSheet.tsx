import { Cross2Icon } from "@radix-ui/react-icons";
import { ReactNode, useEffect, useState } from "react";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { cn } from "../../libs/utils.ts";
import { BasicMarketInfoSheetHeader } from "../BasicMarketInfoSheetHeader.tsx";
import { Accordion } from "../ui/accordion.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { EditBadgeRequirements } from "./EditBadgeRequirements.tsx";
import { EditCommission } from "./EditCommission.tsx";
import { EditDisputeDurations } from "./EditDisputeDurations.tsx";
import { EditMarketManager } from "./EditMarketManager.tsx";
import { EditOfferOnlyMode } from "./EditOfferOnlyMode.tsx";
import { EditRenounceOwnership } from "./EditRenounceOwnership.tsx";
import { EditTransferOwnership } from "./EditTransferOwnership.tsx";
import { EditZeroPricedLiquidity } from "./EditZeroPricedLiquidity.tsx";

export function ManageMarketSheet({
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
  const [sheetHeight, sheetSide, styles] = useSheetInfo();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(active || false);
    onOpen && onOpen(active || false);
  }, [active, onOpen]);

  function close() {
    setOpen(false);
    onOpen && onOpen(false);
  }

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
        className={cn(
          styles,
          "w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0"
        )}
        side={sheetSide}
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
          <div>
            <ScrollArea className={cn(sheetHeight)}>
              <Accordion type="single" className="mt-0">
                <EditCommission market={market} close={close} />

                <EditDisputeDurations market={market} close={close} />

                <EditMarketManager market={market} close={close} />

                <EditOfferOnlyMode market={market} close={close} />

                <EditZeroPricedLiquidity market={market} close={close} />

                <EditBadgeRequirements market={market} close={close} />

                <EditTransferOwnership market={market} close={close} />

                <EditRenounceOwnership market={market} close={close} />
              </Accordion>
            </ScrollArea>
          </div>
        </div>
        <div
          className="absolute cursor-pointer text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            setOpen(false);
            onOpen && onOpen(false);
          }}
        >
          <Cross2Icon className="h-6 w-6 transition-all duration-300 hover:text-chinese-green hover:scale-110 cursor-pointer" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
