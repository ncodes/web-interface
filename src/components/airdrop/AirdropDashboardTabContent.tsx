import { Helmet } from "react-helmet";
import { TabsContent } from "../ui/Tabs.tsx";
import { AirdropDashboard } from "./AirdropDashboard.tsx";

export function AirdropDashboardTabContent() {
  return (
    <TabsContent value="airdrop" className="p-0 m-0 flex flex-1 flex-col gap-3">
      <Helmet>
        <title>Airdrop - Joint</title>
      </Helmet>

      <AirdropDashboard />
    </TabsContent>
  );
}
