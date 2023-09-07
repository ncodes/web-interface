import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet.tsx";
import React, { useEffect } from "react";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs.tsx";
import { ManageBasicLiquidityTab } from "./ManageBasicLiquidityTab.tsx";
import ManageLiquidityInstructionsTab from "./ManageLiquidityInstructionsTab.tsx";

export function ManageLiquiditySheet(props: {
  liquidity?: Liquidity;
  open: boolean;
  onOpenChange: (open) => void;
  addMode?: boolean;
}) {
  const [open, setOpen] = React.useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <Sheet
      key={"axs"}
      open={open}
      onOpenChange={props.onOpenChange}
      modal={true}
    >
      <SheetContent
        className="w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0"
        side="right"
      >
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            {!props.addMode && (
              <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
                Manage Liquidity
              </SheetTitle>
            )}
            {props.addMode && (
              <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
                Add Liquidity
              </SheetTitle>
            )}
          </div>
        </SheetHeader>

        <Tabs
          defaultValue={"basic"}
          className="w-full h-full transition-all duration-500"
        >
          <ScrollGradientIndicator>
            <ScrollAreaHorizontal type="scroll">
              {!props.addMode && (
                <TabsList className="justify-start px-3 py-2 border-b border-modal-border">
                  <TabsTrigger
                    value="basic"
                    className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                  >
                    Basic
                  </TabsTrigger>
                  <TabsTrigger
                    value="instructions"
                    className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                  >
                    Instructions
                  </TabsTrigger>
                </TabsList>
              )}
            </ScrollAreaHorizontal>
          </ScrollGradientIndicator>

          <ManageBasicLiquidityTab
            liquidity={props.liquidity}
            addMode={props.addMode}
            onClick={() => {
              setOpen(false);
              props.onOpenChange && props.onOpenChange(false);
            }}
          />

          <ManageLiquidityInstructionsTab
            liquidity={props.liquidity as Liquidity}
          />
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
