import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useStore from "../../hooks/store/useStore.ts";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { formatToHighDenom } from "../../libs/helpers.ts";
import { TabsContent } from "../ui/Tabs.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { Switch } from "../ui/switch.tsx";
import { BalanceCard, NativeTokenWrapper } from "./BalanceCard.tsx";
import { TabContentHeader } from "./TabContentHeader.tsx";

export function GeneralTab(props: { address: string }) {
  const [sheetHeight] = useSheetInfo("h-[50vh]");
  const { getBalance, getTokenBalance, getChainInfo, address } =
    useConnectorContext();
  const [nativeBalance, setNativeBalance] = useState(BigInt(0));
  const [wrappedBalance, setWrappedBalance] = useState(BigInt(0));
  const [p2pBalance, setP2pBalance] = useState(BigInt(0));
  const { enabledSafeMode, setEnabledSafeMode } = useStore((s) => ({
    enabledSafeMode: s.enabledSafeMode,
    setEnabledSafeMode: s.setEnabledSafeMode,
  }));

  useInterval(async () => {
    fetchNativeBalance();
    fetchWrappedBalance();
    fetchP2pBalance();
  }, 15000);

  useEffect(() => {
    fetchNativeBalance();
    fetchWrappedBalance();
    fetchP2pBalance();
  }, []);

  async function fetchNativeBalance() {
    const bal = await getBalance();
    setNativeBalance(bal);
  }

  async function fetchWrappedBalance() {
    const netInfo = getChainInfo();
    if (!netInfo || !netInfo.wrappedTokenInfo.address) return;
    const bal = await getTokenBalance(
      netInfo.wrappedTokenInfo.address,
      address,
    );
    setWrappedBalance(bal);
  }

  async function fetchP2pBalance() {
    const netInfo = getChainInfo();
    if (!netInfo || !netInfo.contracts?.token) return;
    const bal = await getTokenBalance(
      netInfo.contracts["token"].address,
      address,
    );
    setP2pBalance(bal);
  }

  return (
    <TabsContent value="general" className={`p-0 mt-0 pb-20 ${sheetHeight}`}>
      <TabContentHeader address={props.address} />
      <ScrollArea type="scroll" className="h-full">
        <div className="mb-5 overflow-auto scrollbar-hide px-5 pt-3 flex flex-col ">
          <Accordion type="multiple" defaultValue={["balances", "safety"]}>
            <AccordionItem className="" value="balances">
              <AccordionContent className="tracking-wide">
                <div className="flex flex-col gap-4 box-border min-w-full float-left">
                  <BalanceCard
                    symbol="ETH"
                    balance={formatToHighDenom(nativeBalance)}
                  >
                    <NativeTokenWrapper
                      title={`Wrap to ${getChainInfo().wrappedTokenInfo
                        ?.symbol}`}
                      curBalance={nativeBalance}
                      onDone={() => {
                        fetchNativeBalance();
                        fetchWrappedBalance();
                      }}
                      wrap
                    />
                  </BalanceCard>
                  <BalanceCard
                    symbol="WETH"
                    balance={formatToHighDenom(wrappedBalance)}
                  >
                    <NativeTokenWrapper
                      title={`Unwrap to ${getChainInfo().symbol}`}
                      curBalance={wrappedBalance}
                      wrap={false}
                      onDone={() => {
                        fetchNativeBalance();
                        fetchWrappedBalance();
                      }}
                    />
                  </BalanceCard>
                  <BalanceCard
                    symbol="P2P"
                    balance={formatToHighDenom(p2pBalance)}
                  />
                  {/*<BalanceCard symbol="POUCH (P2P)" balance="34,000" />*/}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="safety">
              <AccordionTrigger className="text-lg pb-2 mt-5 tracking-wide">
                Safe Mode
              </AccordionTrigger>
              <AccordionContent className="tracking-wide">
                <div className="font-light text-gray-100 text-sm">
                  With safe mode enabled, you will only see markets where the
                  liquidity providers and swappers have completed KYC
                  verification.
                </div>
                <div className="mt-3">
                  <Switch
                    checked={enabledSafeMode}
                    onCheckedChange={(value) => {
                      setEnabledSafeMode(value);
                    }}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* <FundPouch /> */}
          </Accordion>
        </div>
      </ScrollArea>
    </TabsContent>
  );
}
