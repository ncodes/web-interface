import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog.tsx";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import IconArrowsScrollH from "../icons/IconScrollHorizontal.tsx";
import { IconSettingsOutline } from "../icons/IconSettingsOutline.tsx";
import IconDisconnect from "../icons/IconDisconnect.tsx";
import useConnector from "../../hooks/connectors/useConnector.tsx";
import { shortenAddress } from "../../libs/helpers.ts";
import IconCopy from "../icons/IconCopy.tsx";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useToast } from "../../hooks/toast/toast.tsx";
import { ReactElement } from "react";

function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" height="20px" width="20px" {...props}>
      <path
        fill="currentColor"
        d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"
      />
    </svg>
  );
}

function BalanceCard(props: {
  symbol?: string;
  balance: string;
  children?: ReactElement;
}) {
  return (
    <Card className="w-[200px] shrink-0 border border-card-border bg-card-background shadow-gray-900  shadow-lg">
      <CardHeader className="p-0">
        <CardTitle className="text-center p-0 text-xl tracking-wider font-normal">
          <IconInfoCircle className="float-right relative top-2 -left-2 z-10 cursor-pointer text-card-icon/80 hover:text-card-icon transition-all duration-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 py-2 flex flex-col relative -top-3 text-[24px] text-center text-chinese-green tracking-wider">
        <span className="relative text-gray-100 text-[17px]">
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
    <a
      href="#"
      className="w-full block text-gray-400 py-2 cursor-pointer rounded-b-xl hover:bg-gray-800 hover:text-white"
    >
      {props.title}
    </a>
  );
}

function TabContentHeader(props: { address: string }) {
  const { notifySuccess, simpleSuccess } = useToast();

  return (
    <div className="flex pt-1 justify-between pl-2 pr-5 !select-none text-gray-500  relative -top-1 text-[12px] font-light pb-2">
      <span className="border border-gray-700 text-chinese-green  px-2 rounded-full flex font-medium tracking-widest gap-1 items-center">
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
      <span
        className="hidden xxs:flex items-center"
        onClick={() => {
          notifySuccess("hello", { label: "hi" });
        }}
      >
        <IconArrowsScrollH /> Scroll left or right
      </span>
    </div>
  );
}

export default function ModalMyWallet(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  openWalletManager: (() => void) | undefined;
}) {
  const { disconnect, address } = useConnector();

  return (
    <Dialog {...props}>
      <DialogContent className="w-[310px] xxs:w-[360px] xs:w-[400px] md:w-[644px] mt-[100px] md:mt-[200px] border-modal-border/50 bg-modal-background p-0 text-gray-100 shadow-[2px_2px_7px_0_rgba(27,36,48,0.4)]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center text-gray-100 border-b border-modal-border/60 p-5 tracking-wide">
            <span>My Wallet</span>
            <DialogPrimitive.Close
              aria-label="Close"
              className="text-gray-300 hover:text-gray-100 transition-all duration-300 outline-0"
            >
              <IconClose className="h-[24px] w-[24px]" viewBox="0 0 20 20" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogTitle>

          <div>
            <Tabs defaultValue="balances" className="w-full h-full">
              <TabsList className="justify-start px-5 border-b border-modal-border/60">
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

              <TabsContent value="balances" className="pr-0">
                <TabContentHeader address={address} />
                <div className="px-2 mb-5  overflow-auto scrollbar-hide">
                  <div className="flex gap-5 items-start box-border min-w-full float-left pr-3">
                    <BalanceCard symbol="ETH" balance="12.5">
                      <BalanceCardLink title="Convert to WETH" />
                    </BalanceCard>
                    <BalanceCard symbol="WETH" balance="345.32">
                      <BalanceCardLink title="Convert to ETH" />
                    </BalanceCard>
                    <BalanceCard symbol="P2P" balance="34,000" />
                    <BalanceCard symbol="POUCH (P2P)" balance="34,000" />
                    <BalanceCard symbol="POUCH (P2P)" balance="34,000" />
                    <BalanceCard symbol="POUCH (P2P)" balance="34,000" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="fee-purse" className="px-5">
                dsads
              </TabsContent>
            </Tabs>
            <div className="flex justify-between px-5 py-3 border-t border-modal-border/50">
              <div className="flex items-center text-sm font-light gap-1 text-gray-400 hover:text-gray-300 transition-all duration-500 cursor-pointer">
                <span>
                  <IconSettingsOutline />
                </span>
                <span
                  className="select-none"
                  onClick={() => {
                    props.onOpenChange(false);
                    if (props.openWalletManager) props.openWalletManager();
                  }}
                >
                  Manage Wallet
                </span>
              </div>
              <div className="flex items-center text-sm font-light gap-1 text-gray-400 hover:text-gray-300 transition-all duration-500 cursor-pointer">
                <span>
                  <IconDisconnect />
                </span>
                <span className="select-none" onClick={disconnect}>
                  Disconnect
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
