import { TabsContent } from "../ui/Tabs.tsx";
import { AirdropDashboard } from "./AirdropDashboard.tsx";

export function AirdropDashboardTabContent({
  currentTab,
}: {
  currentTab: "claim" | "trade";
}) {
  return (
    <TabsContent
      value={currentTab}
      className="p-0 m-0 rounded-t-3xl flex flex-1 flex-col gap-3"
    >
      <AirdropDashboard currentTab={currentTab} />
    </TabsContent>
  );
}
