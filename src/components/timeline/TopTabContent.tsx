import { TabsContent } from "../ui/Tabs.tsx";
import { ActivityStream } from "../ActivityStream.tsx";

export function TopTabContent() {
  return (
    <TabsContent value="top" className="px-5">
      <ActivityStream />
    </TabsContent>
  );
}
