import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { TabsContent } from "../ui/Tabs.tsx";
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
      className={`p-0 mt-0 overflow-auto ${sheetHeight}  xl:h-screen`}
    >
      <Accordion
        type="single"
        defaultValue="instruction"
        className="lg:pb-32 xl:pb-0"
      >
        <ManageLiquidityInstruction liquidity={liquidity} />
        <ManageLiquidityRequiredBadges liquidity={liquidity} />
      </Accordion>
    </TabsContent>
  );
}
