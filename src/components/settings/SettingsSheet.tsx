import { Cross2Icon } from "@radix-ui/react-icons";
import React from "react";
import { useLocation } from "react-router-dom";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useStore from "../../hooks/store/useStore.ts";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { cn } from "../../libs/utils.ts";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { AccountTab } from "./AccountTab.tsx";
import { GeneralTab } from "./GeneralTab.tsx";
import { NotificationTab } from "./NotificationTab.tsx";
import { RulesTab } from "./RulesTab.tsx";
import { SettingsFooter } from "./SettingsFooter.tsx";

export function SettingsSheet(props: {
  children?: React.ReactNode;
  onOpen?: (open: boolean) => void;
  openWalletManager?: () => void;
}) {
  const [sheetHeight, sheetSide, styles] = useSheetInfo("h-[90svh]");
  const { address } = useConnectorContext();
  const openState = useStore((state) => state.openState);
  const toggleOpenState = useStore((state) => state.toggleOpenState);
  const currentTab = useStore((state) => state.currentTab);
  const setCurrentTab = useStore((state) => state.setCurrentTab);
  const loc = useLocation();

  // TODO: remove when connect page is removed
  const inConnectPage = loc.pathname.includes("/connect");

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
          "flex flex-col gap-0 pb-0 w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0",
          sheetHeight,
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
        <div className="flex-1 flex px-0 text-white">
          <Tabs
            value={currentTab || "general"}
            className="flex flex-1 flex-col transition-all duration-500"
            onValueChange={(value) => {
              setCurrentTab(value);
            }}
          >
            <ScrollOverflowIndicator
              className="[&::before]:rounded-none"
              showArrow
            >
              <ScrollAreaHorizontal
                type="scroll"
                className="relative h-[50px]"
                viewportClassName="absolute w-full"
              >
                <TabsList className="justify-start w-full px-3 py-2 border-b border-modal-border">
                  <TabsTrigger
                    value="general"
                    className="font-light  font-jersey25 text-[18px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                  >
                    General
                  </TabsTrigger>
                  {!inConnectPage && (
                    <>
                      <TabsTrigger
                        value="account"
                        className="font-light  font-jersey25 text-[18px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                      >
                        Account
                      </TabsTrigger>
                      <TabsTrigger
                        value="notification"
                        className="font-light  font-jersey25 text-[18px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                      >
                        Notification
                      </TabsTrigger>
                      <TabsTrigger
                        value="rules"
                        className="font-light  font-jersey25 text-[18px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                      >
                        Rules
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>
              </ScrollAreaHorizontal>
            </ScrollOverflowIndicator>
            {(currentTab === "general" || !currentTab) && (
              <GeneralTab address={address} />
            )}
            {currentTab === "account" && <AccountTab />}
            {currentTab === "notification" && <NotificationTab />}
            {currentTab === "rules" && <RulesTab />}
          </Tabs>
        </div>
        <div>
          <SettingsFooter
            openWalletManager={() => {
              toggleOpenState && toggleOpenState("settingsSheet");
              props.openWalletManager && props.openWalletManager();
            }}
          />
        </div>
        <div
          className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            toggleOpenState && toggleOpenState("settingsSheet");
          }}
        >
          <Cross2Icon className="h-6 w-6 transition-all duration-300 hover:text-chinese-green hover:scale-110 cursor-pointer" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
