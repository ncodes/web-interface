import React, { ReactElement } from "react";
import useStore from "../hooks/store/useStore.ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ScrollArea } from "./ui/scroll-area.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card.tsx";
import IconInfoCircle from "./icons/IconInfoCircle.tsx";
import { Button } from "./ui/Button.tsx";
import { useToast } from "../hooks/toast/toast.tsx";
import { shortenAddress } from "../libs/helpers.ts";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconCopy from "./icons/IconCopy.tsx";
import useConnector from "../hooks/connectors/useConnector.tsx";
import { IconSettingsOutline } from "./icons/IconSettingsOutline.tsx";
import IconDisconnect from "./icons/IconDisconnect.tsx";
import { Input } from "./ui/Input.tsx";

function BalanceCard(props: {
  symbol?: string;
  balance: string;
  hideHelp?: boolean;
  children?: ReactElement;
}) {
  return (
    <Card className="w-full shrink-0 border border-card-border bg-card-background shadow-gray-900 shadow-lg">
      <CardHeader className="p-0">
        <CardTitle className="text-center p-0 tracking-wider font-normal h-0 pt-3 float-right">
          {!props.hideHelp && (
            <IconInfoCircle className="float-right relative -top-1 -left-2 z-10 cursor-pointer text-card-icon/80 hover:text-card-icon transition-all duration-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-3 flex flex-col relative  text-[18px] text-center text-chinese-green tracking-wider">
        <span className="relative text-gray-100 text-[15px]">
          {props.symbol}
        </span>
        <p>{props.balance}</p>
      </CardContent>
      {props.children && (
        <CardFooter className="border-t border-card-border py-0 px-0 font-light text-sm text-center">
          {props.children}
        </CardFooter>
      )}
    </Card>
  );
}

function BalanceCardLink(props: { title: string }) {
  return (
    <Button
      variant="ghost"
      className="w-full text-center rounded-none rounded-b-xl transition-all duration-300 hover:bg-gray-800 hover:text-gray-100 md:block text-gray-300 border-gray-600"
      asChild
    >
      <a href="#" className="hover:text-[15px]">
        {props.title}
      </a>
    </Button>
  );
}

function TabContentHeader(props: { address: string }) {
  const { simpleSuccess } = useToast();

  return (
    <div className="!select-none text-gray-500 text-[12px] font-light">
      <span className="text-white w-full px-5 py-2 border-b border-gray-800 flex font-light tracking-widest gap-1 items-center">
        <span className="text-chinese-green">Address:</span>
        <span className="flex items-center gap-1">
          {shortenAddress(props.address)}
          <CopyToClipboard
            text={props.address}
            onCopy={() => {
              simpleSuccess("Copied", { position: "top-center" });
            }}
          >
            <IconCopy
              width="15px"
              height="15px"
              className="opacity-50 hover:opacity-100 hover:text-chinese-green cursor-pointer transition-all duration-300 active:text-white active:scale-50"
            />
          </CopyToClipboard>
        </span>
      </span>
    </div>
  );
}

function MyWalletFooter(props: { openWalletManager: () => void }) {
  const { disconnect } = useConnector();
  const toggleMyWalletSheetOpen = useStore(
    (state) => state.toggleMyWalletSheetOpen
  );

  return (
    <div className="absolute bottom-0 w-full p-5 border-t border-gray-600 bg-modal-background flex justify-between py-3 border-t border-modal-border/50">
      <div className="flex items-center text-sm font-light gap-1 text-gray-400 hover:text-gray-300 transition-all duration-500 cursor-pointer">
        <span>
          <IconSettingsOutline />
        </span>
        <span className="select-none" onClick={props.openWalletManager}>
          Manage Wallet
        </span>
      </div>
      <div className="flex items-center text-sm font-light gap-1 text-gray-400 hover:text-gray-300 transition-all duration-500 cursor-pointer">
        <span>
          <IconDisconnect />
        </span>
        <span
          className="select-none"
          onClick={async () => {
            await disconnect();
            toggleMyWalletSheetOpen && toggleMyWalletSheetOpen();
          }}
        >
          Disconnect
        </span>
      </div>
    </div>
  );
}

function BalancesTab(props: {
  address: string;
  openWalletManager: () => void;
}) {
  return (
    <TabsContent value="balances" className="p-0 mt-0 h-full">
      <TabContentHeader address={props.address} />
      <ScrollArea type="scroll" className="h-full pb-[100px]">
        <div className="mb-5 overflow-auto scrollbar-hide px-5 pt-3">
          <div className="flex flex-col gap-4 box-border min-w-full float-left">
            <BalanceCard symbol="ETH" balance="12.5">
              <BalanceCardLink title="Convert to WETH" />
            </BalanceCard>
            <BalanceCard symbol="WETH" balance="345.32">
              <BalanceCardLink title="Convert to ETH" />
            </BalanceCard>
            <BalanceCard symbol="P2P" balance="34,000" />
            <BalanceCard symbol="POUCH (P2P)" balance="34,000" />
          </div>
        </div>
      </ScrollArea>
      <MyWalletFooter openWalletManager={props.openWalletManager} />
    </TabsContent>
  );
}

function FeePouchTab(props: { openWalletManager: () => void }) {
  return (
    <TabsContent value="fee-purse" className="w-full h-full mt-3 px-0">
      <div className="flex flex-col px-5">
        <BalanceCard symbol="Pouch (P2P)" balance="34.50" hideHelp>
          <BalanceCardLink title="Withdraw" />
        </BalanceCard>
        <div className="flex flex-col gap-2 mt-5 text-left">
          <h1 className="font-normal tracking-wider text-[18px]">Fund Pouch</h1>
          <p className="font-light text-[13px] text-gray-400 tracking-wide">
            Add P2P to your Pouch to pay trading fees for your liquidity in
            non-ERC20 markets.
          </p>
          <div className="flex gap-2 pb-5 mt-2">
            <Input type="number" variant="primary" placeholder="0.00" w="sm" />
            <Button variant="secondary" rounded="md" size="sm">
              Approve
            </Button>
            <Button variant="default" rounded="md" size="sm">
              Deposit
            </Button>
          </div>
        </div>
      </div>
      <MyWalletFooter openWalletManager={props.openWalletManager} />
    </TabsContent>
  );
}

export function MyWalletSheet(props: {
  children?: React.ReactNode;
  onOpen?: (open: boolean) => void;
  openWalletManager?: () => void;
}) {
  const { address } = useConnector();
  const myWalletSheetOpen = useStore((state) => state.myWalletSheetOpen);
  const toggleMyWalletSheetOpen = useStore(
    (state) => state.toggleMyWalletSheetOpen
  );

  return (
    <Sheet
      open={myWalletSheetOpen}
      onOpenChange={(open) => {
        props.onOpen && props.onOpen(open);
        toggleMyWalletSheetOpen && toggleMyWalletSheetOpen();
      }}
    >
      <SheetTrigger>{props.children}</SheetTrigger>
      <SheetContent
        className="w-full border-l focus-visible:outline-0 border-gray-800 pt-0 px-0"
        side="right"
      >
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
              My Wallet
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="px-0 text-white h-full pb-10">
          <Tabs
            defaultValue="balances"
            className="w-full h-full transition-all duration-500"
          >
            <TabsList className="justify-start px-5 pt-2 border-b border-modal-border">
              <TabsTrigger
                value="balances"
                className="font-normal text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-[12px] data-[state=active]:font-normal"
              >
                Balances
              </TabsTrigger>
              <TabsTrigger
                value="fee-purse"
                className="font-normal text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-[12px] data-[state=active]:font-normal"
              >
                Fee Pouch
              </TabsTrigger>
            </TabsList>
            <BalancesTab
              address={address}
              openWalletManager={() => {
                toggleMyWalletSheetOpen && toggleMyWalletSheetOpen();
                props.openWalletManager && props.openWalletManager();
              }}
            />
            <FeePouchTab
              openWalletManager={() => {
                toggleMyWalletSheetOpen && toggleMyWalletSheetOpen();
                props.openWalletManager && props.openWalletManager();
              }}
            />
          </Tabs>
        </div>
        <div
          className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            toggleMyWalletSheetOpen && toggleMyWalletSheetOpen();
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
