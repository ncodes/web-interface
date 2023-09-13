import { TabsContent } from "../ui/Tabs.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { BalanceCard, BalanceCardLink } from "./BalanceCard.tsx";
import { TabContentHeader } from "./TabContentHeader.tsx";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";

export function BalancesTab(props: { address: string }) {
  const [sheetHeight] = useSheetInfo();

  return (
    <TabsContent value="balances" className={`p-0 mt-0 ${sheetHeight}`}>
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
    </TabsContent>
  );
}
