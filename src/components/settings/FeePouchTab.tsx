import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";
import { TabsContent } from "../ui/Tabs.tsx";

export function FeePouchTab() {
  const [sheetHeight] = useSheetInfo();

  return (
    <TabsContent
      value="fee-purse"
      className={`w-full h-full mt-3 px-0 ${sheetHeight}`}
    >
      <div className="flex flex-col px-5">
        {/* <BalanceCard symbol="Pouch (JOIN)" balance="34.50" hideHelp> */}
        {/* <BalanceCardLink title="Withdraw" /> */}
        {/* </BalanceCard> */}
        <div className="flex flex-col gap-2 mt-5 text-left">
          <h1 className="font-normal tracking-wider text-[18px]">Fund Pouch</h1>
          <p className="font-light text-[13px] text-gray-400 tracking-wide">
            Add JOIN to your Pouch to pay trading fees for your liquidity in
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
    </TabsContent>
  );
}
