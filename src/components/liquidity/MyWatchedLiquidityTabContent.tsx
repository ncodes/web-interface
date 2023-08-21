import { TabsContent } from "../ui/Tabs.tsx";
import { LiquidityRow } from "./LiquidityRow.tsx";

export function MyWatchedLiquidityTabContent() {
  return (
    <TabsContent value="watching" className="p-0 m-0 flex flex-col gap-3">
      {/*<Paginator />*/}
      <div className="p-3 pt-0">
        <LiquidityRow base="BTC" quote="UNI" />
      </div>
    </TabsContent>
  );
}
