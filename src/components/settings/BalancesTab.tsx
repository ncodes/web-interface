import { TabsContent } from "../ui/Tabs.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { BalanceCard, BalanceCardLink } from "./BalanceCard.tsx";
import { TabContentHeader } from "./TabContentHeader.tsx";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { Input } from "../ui/Input.tsx";
import { Button } from "../ui/Button.tsx";

export function BalancesTab(props: { address: string }) {
  const [sheetHeight] = useSheetInfo();

  return (
    <TabsContent value="balances" className={`p-0 mt-0 ${sheetHeight}`}>
      <TabContentHeader address={props.address} />
      <ScrollArea type="scroll" className="h-full">
        <div className="mb-5 overflow-auto scrollbar-hide px-5 pt-3 flex flex-col">
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
          <div className="flex flex-col mt-5 border-t border-gray-800 pt-5">
            <BalanceCard symbol="Pouch (P2P)" balance="34.50" hideHelp>
              <BalanceCardLink title="Withdraw" />
            </BalanceCard>
            <div className="flex flex-col gap-2 mt-5 text-left">
              <h1 className="font-normal tracking-wider text-[18px]">
                Fund Pouch
              </h1>
              <p className="font-light text-[13px] text-gray-400 tracking-wide">
                Add P2P to your Pouch to pay trading fees for your liquidity in
                non-ERC20 markets.
              </p>
              <div className="flex gap-2 pb-5 mt-2">
                <Input
                  type="number"
                  variant="primary"
                  placeholder="0.00"
                  w="sm"
                />
                <Button variant="secondary" rounded="md" size="sm">
                  Approve
                </Button>
                <Button variant="default" rounded="md" size="sm">
                  Deposit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </TabsContent>
  );
}
