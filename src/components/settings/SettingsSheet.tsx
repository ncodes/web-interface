import React from "react";
import useStore from "../../hooks/store/useStore.ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { AccountTab } from "./AccountTab.tsx";
import { BalancesTab } from "./BalancesTab.tsx";
import { SettingsFooter } from "./SettingsFooter.tsx";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { cn } from "../../libs/utils.ts";
import { RulesTab } from "./RulesTab.tsx";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";

export function SettingsSheet(props: {
  children?: React.ReactNode;
  onOpen?: (open: boolean) => void;
  openWalletManager?: () => void;
}) {
  const [, sheetSide, styles] = useSheetInfo();
  const { address } = useConnectorContext();
  const openState = useStore((state) => state.openState);
  const toggleOpenState = useStore((state) => state.toggleOpenState);
  const currentTab = useStore((state) => state.currentTab);

  return (
    <Sheet
      open={openState.settingsSheet}
      onOpenChange={(open) => {
        props.onOpen && props.onOpen(open);
        toggleOpenState && toggleOpenState("settingsSheet");
      }}
    >
      <SheetTrigger>{props.children}</SheetTrigger>
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
              Settings
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="px-0 text-white h-full pb-10">
          <Tabs
            defaultValue={currentTab || "balances"}
            className="w-full h-full transition-all duration-500"
          >
            <ScrollOverflowIndicator>
              <ScrollAreaHorizontal type="scroll">
                <TabsList className="justify-start px-3 py-2 border-b border-modal-border">
                  <TabsTrigger
                    value="balances"
                    className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                  >
                    Balances
                  </TabsTrigger>
                  <TabsTrigger
                    value="account"
                    className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                  >
                    Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="rules"
                    className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                  >
                    Rules
                  </TabsTrigger>
                </TabsList>
              </ScrollAreaHorizontal>
            </ScrollOverflowIndicator>
            <BalancesTab address={address} />
            <AccountTab />
            <RulesTab />
            <SettingsFooter
              openWalletManager={() => {
                toggleOpenState && toggleOpenState("settingsSheet");
                props.openWalletManager && props.openWalletManager();
              }}
            />
          </Tabs>
        </div>
        <div
          className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            toggleOpenState && toggleOpenState("settingsSheet");
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
