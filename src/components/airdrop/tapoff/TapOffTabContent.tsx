import Helmet from "react-helmet";
import { TabsContent } from "../../ui/Tabs.tsx";
import { TapOff } from "./TapOff.tsx";

export function TapOffTabContent() {
  return (
    <TabsContent
      value="tap"
      className="p-0 m-0 flex flex-1 flex-col gap-3 relative"
    >
      <Helmet>
        <title>{`TapOff - Joint`}</title>
      </Helmet>

      <TapOff />
    </TabsContent>
  );
}
