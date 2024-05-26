import Helmet from "react-helmet";
import { TabsContent } from "../../ui/Tabs.tsx";
import { TapWar } from "./TapWar.tsx";

export function TapWarTabContent() {
  return (
    <TabsContent
      value="tap"
      className="p-0 m-0 flex flex-1 flex-col gap-3 relative "
    >
      <Helmet>
        <title>{`TapWar - Joint`}</title>
      </Helmet>

      <TapWar />
    </TabsContent>
  );
}
