import { ActivityStream } from "../../components/ActivityStream.tsx";
import { ScrollAreaHorizontal } from "../../components/ui/scroll-area.tsx";
import { TabsList, TabsTrigger } from "../../components/ui/Tabs.tsx";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { Footer } from "../../components/Footer.tsx";
import Layout from "./Layout.tsx";

export default function Index() {
  return (
    <Layout
      tab={
        <Tabs
          defaultValue="home"
          className="w-full h-full transition-all duration-500"
        >
          <ScrollAreaHorizontal type="scroll">
            <TabsList className="justify-start px-3 pt-2 border-b border-modal-border ">
              <TabsTrigger
                value="home"
                className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
              >
                Home
              </TabsTrigger>
              <TabsTrigger
                value="my-activity"
                className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
              >
                My Activity
              </TabsTrigger>
              <TabsTrigger
                value="top"
                className="xl:hidden font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
              >
                Top
              </TabsTrigger>
            </TabsList>
          </ScrollAreaHorizontal>
          <TabsContent value="home" className=""></TabsContent>
          <TabsContent value="my-activity" className=""></TabsContent>
          <TabsContent value="top" className="px-5">
            <ActivityStream />
          </TabsContent>
        </Tabs>
      }
      rightSide={
        <div>
          <ActivityStream />
          <Footer />
        </div>
      }
    >
      hi
    </Layout>
  );
}
