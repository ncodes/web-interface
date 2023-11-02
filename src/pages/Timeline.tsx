import { ActivityStream } from "../components/ActivityStream.tsx";
import { Footer } from "../components/Footer.tsx";
import { FollowingTabContent } from "../components/timeline/FollowingTabContent.tsx";
import { HomeTabContent } from "../components/timeline/HomeTabContent.tsx";
import { TopTabContent } from "../components/timeline/TopTabContent.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import Layout from "./Layout.tsx";

export default function Timeline() {
  return (
    <Layout
      body={
        <Tabs
          defaultValue="home"
          className="w-full h-auto transition-all duration-500"
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
        <div className="flex w-full h-full justify-between flex-col pt-3">
          <ActivityStream />
          <div className="relative">
            <div className="text-gray-200 bottom-0 w-full">
              <Footer />
            </div>
          </div>
        </div>
      }
    />
  );
}
