import { ActivityStream } from "../components/ActivityStream.tsx";
import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import { Footer } from "../components/Footer.tsx";
import Layout from "./Layout.tsx";
import { HomeTabContent } from "../components/timeline/HomeTabContent.tsx";
import { FollowingTabContent } from "../components/timeline/FollowingTabContent.tsx";
import { TopTabContent } from "../components/timeline/TopTabContent.tsx";

export default function Timeline() {
  return (
    <Layout
      tab={
        <Tabs
          defaultValue="home"
          className="w-full h-full transition-all duration-500"
        >
          <ScrollAreaHorizontal type="scroll">
            <TabsList className="justify-start px-3 py-2 border-b border-modal-border pt-0">
              <TabsTrigger
                value="home"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Home
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Following
              </TabsTrigger>
              <TabsTrigger
                value="top"
                className="xl:hidden font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Top
              </TabsTrigger>
            </TabsList>
          </ScrollAreaHorizontal>
          <HomeTabContent />
          <FollowingTabContent />
          <TopTabContent />
        </Tabs>
      }
      rightSide={
        <div>
          <ActivityStream />
          <Footer />
        </div>
      }
    />
  );
}
