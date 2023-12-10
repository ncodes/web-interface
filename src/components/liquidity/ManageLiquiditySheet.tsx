import React, { useEffect } from "react";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { cn } from "../../libs/utils.ts";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet.tsx";
import { ManageGeneralLiquidityTab } from "./ManageGeneralLiquidityTab.tsx";
import ManageLiquidityPaymentTab from "./ManageLiquidityPaymentTab.tsx";
import ManageLiquidityRulesTab from "./ManageLiquidityRulesTab.tsx";

export function ManageLiquiditySheet(props: {
  liquidity?: Liquidity;
  market: Market;
  open: boolean;
  onOpenChange: (open) => void;
}) {
  const [sheetHeight, sheetSide, styles] = useSheetInfo("h-[90svh]");
  const [open, setOpen] = React.useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <Sheet open={open} onOpenChange={props.onOpenChange} modal={true}>
      <SheetContent
        className={cn(
          styles,
          "flex flex-col gap-0 w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0 pb-0",
          sheetHeight,
        )}
        side={sheetSide}
      >
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            {props.liquidity && (
              <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
                Manage Liquidity
              </SheetTitle>
            )}
            {!props.liquidity && (
              <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
                Add Liquidity
              </SheetTitle>
            )}
          </div>
        </SheetHeader>

        <Tabs
          defaultValue={"general"}
          className="flex flex-col w-full h-full transition-all duration-500"
        >
          <ScrollOverflowIndicator>
            <ScrollAreaHorizontal type="scroll">
              {props.liquidity && (
                <TabsList className="justify-start px-3 py-2 border-b border-modal-border">
                  <TabsTrigger
                    value="general"
                    className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                  >
                    General
                  </TabsTrigger>
                  <TabsTrigger
                    value="payment"
                    className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                  >
                    Payment
                  </TabsTrigger>
                  <TabsTrigger
                    value="rules"
                    className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                  >
                    Rules
                  </TabsTrigger>
                </TabsList>
              )}
            </ScrollAreaHorizontal>
          </ScrollOverflowIndicator>

          <ManageGeneralLiquidityTab
            liquidity={props.liquidity as Liquidity}
            market={props.market}
            close={() => {
              setOpen(false);
              props.onOpenChange && props.onOpenChange(false);
            }}
            onClick={() => {
              setOpen(false);
              props.onOpenChange && props.onOpenChange(false);
            }}
          />

          <ManageLiquidityRulesTab liquidity={props.liquidity as Liquidity} />

          <ManageLiquidityPaymentTab liquidity={props.liquidity as Liquidity} />
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
