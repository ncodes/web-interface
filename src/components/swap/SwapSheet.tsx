import { Cross2Icon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { cn } from "../../libs/utils.ts";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet.tsx";
import { SwapOfferCreatorContent } from "./SwapOfferCreatorContent.tsx";

export function SwapSheet(props: {
  market: Market;
  liquidity: Liquidity;
  open: boolean;
  onOpenChange?: (open) => void;
}) {
  const [, sheetSide, styles] = useSheetInfo();
  const [open, setOpen] = React.useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <Sheet open={open} onOpenChange={props.onOpenChange}>
      <SheetContent
        className={cn(
          styles,
          "w-full border-l focus-visible:outline-0 border-gray-800 pt-0 px-0 h-[90vh] md:h-[100vh]"
        )}
        side={sheetSide}
      >
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
              Swap
            </SheetTitle>
          </div>
        </SheetHeader>
        <SwapOfferCreatorContent
          liquidity={props.liquidity}
          market={props.market}
        />
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
