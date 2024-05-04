import Helmet from "react-helmet";
import { TabsContent } from "../../ui/Tabs.tsx";
import { WarBond } from "./WarBond.tsx";

export function WarBondTabContent() {
  return (
    <TabsContent
      value="warbond"
      className="p-0 m-0 flex flex-1 flex-col gap-3 relative"
    >
      <Helmet>
        <title>{`WarBond - Joint`}</title>
      </Helmet>

      <WarBond />
    </TabsContent>
  );
}
