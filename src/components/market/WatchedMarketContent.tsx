import { TabsContent } from "../ui/Tabs.tsx";
import { Paginator } from "../Paginator.tsx";
import { MarketRow } from "./MarketRow.tsx";

export function WatchedMarketContent() {
  return (
    <TabsContent value="watching" className="p-0 m-0 flex flex-col gap-3">
      <Paginator />
      <div className="p-3 pt-0">
        <MarketRow base="BTC" quote="UNI" />
      </div>
    </TabsContent>
  );
}
