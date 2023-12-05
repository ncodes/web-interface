import { TabsContent } from "../ui/Tabs.tsx";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { ManageLiquiditySetPaymentMethods } from "./ManageLiquiditySetPaymentMethods.tsx";

export default function ManageLiquidityPaymentTab({
  liquidity,
}: {
  liquidity: Liquidity;
}) {
  const [sheetHeight] = useSheetInfo();

  return (
    <TabsContent
      value="payment"
      className={`p-0 mt-0 h-full overflow-auto ${sheetHeight}`}
    >
      <div className="">
        <ManageLiquiditySetPaymentMethods liquidity={liquidity} />
      </div>
    </TabsContent>
  );
}
