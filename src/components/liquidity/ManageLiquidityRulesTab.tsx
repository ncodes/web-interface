import { TabsContent } from "../ui/Tabs.tsx";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { Accordion } from "../ui/accordion.tsx";
import { ManageLiquidityInstruction } from "./ManageLiquidityInstruction.tsx";
import { ManageLiquidityRequiredBadges } from "./ManageLiquidityRequiredBadges.tsx";

export default function ManageLiquidityRulesTab({
  liquidity,
}: {
  liquidity: Liquidity;
}) {
  const [sheetHeight] = useSheetInfo();

  return (
    <TabsContent
      value="rules"
      className={`p-0 mt-0 h-full overflow-auto ${sheetHeight}`}
    >
      <div className="">
        <Accordion type="single" defaultValue="instruction">
          <ManageLiquidityInstruction liquidity={liquidity} />
          <ManageLiquidityRequiredBadges liquidity={liquidity} />
        </Accordion>
      </div>
    </TabsContent>
  );
}
