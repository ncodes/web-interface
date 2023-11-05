import useStore from "../../hooks/store/useStore.ts";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { TabsContent } from "../ui/Tabs.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { Switch } from "../ui/switch.tsx";
import { BalanceCard, BalanceCardLink } from "./BalanceCard.tsx";
import { TabContentHeader } from "./TabContentHeader.tsx";

export function GeneralTab(props: { address: string }) {
  const [sheetHeight] = useSheetInfo();
  const { enabledSafeMode, setEnabledSafeMode } = useStore((s) => ({
    enabledSafeMode: s.enabledSafeMode,
    setEnabledSafeMode: s.setEnabledSafeMode,
  }));

  return (
    <TabsContent value="general" className={`p-0 mt-0 pb-20 ${sheetHeight}`}>
      <TabContentHeader address={props.address} />
      <ScrollArea type="scroll" className="h-full">
        <div className="mb-5 overflow-auto scrollbar-hide px-5 pt-3 flex flex-col ">
          <Accordion type="multiple" defaultValue={["balances"]}>
            <AccordionItem className="" value="balances">
              <AccordionContent className="tracking-wide">
                <div className="flex flex-col gap-4 box-border min-w-full float-left">
                  <BalanceCard symbol="ETH" balance="12.5">
                    <BalanceCardLink title="Convert to WETH" />
                  </BalanceCard>
                  <BalanceCard symbol="WETH" balance="345.32">
                    <BalanceCardLink title="Convert to ETH" />
                  </BalanceCard>
                  <BalanceCard symbol="P2P" balance="34,000" />
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
                  With safe mode, you will only see markets where the liquidity
                  providers and swappers have completed KYC verification.
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
