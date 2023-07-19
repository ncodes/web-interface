import { Helmet } from "react-helmet";
import { ActivityStream } from "../../components/ActivityStream.tsx";
import { LeftSidebar } from "../../components/LeftSidebar.tsx";
import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Header } from "../../components/Header.tsx";
import { SearchSheetBox } from "../../components/SearchBox.tsx";
import { NotificationSheet } from "../../components/NotificationSheet.tsx";
import { UnlinkedAccountNotice } from "../../components/UnlinkedAccountNotice.tsx";
import { ScrollAreaHorizontal } from "../../components/ui/scroll-area.tsx";
import { TabsList, TabsTrigger } from "../../components/ui/Tabs.tsx";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { Footer } from "../../components/Footer.tsx";

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLargeLaptop = useMediaQuery("(min-width: 1280px)");

  useEffect(() => {
    setMobileMenuOpen(isLargeLaptop);
  }, [isLargeLaptop]);

  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen);
  }, [mobileMenuOpen]);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <body className="bg-background" />
      </Helmet>

      <div className="container-x flex h-screen text-white text">
        <LeftSidebar
          open={mobileMenuOpen}
          closeRequested={() => {
            setMobileMenuOpen(false);
          }}
        />

        <div className="flex flex-col flex-1 pt-3">
          <Header onClick={openMobileMenu} />
          <div className="flex flex-1 pt-5">
            <div className="flex-1 relative">
              <UnlinkedAccountNotice />
              <div className="absolute z-0 min-h-full w-full h-auto border border-gray-800 border-b-0 rounded-t-3xl bg-vampire-black">
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
                        value="following"
                        className="font-light text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
                      >
                        Following
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
                  <TabsContent value="following" className=""></TabsContent>
                  <TabsContent value="top" className="px-5">
                    <ActivityStream />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <div className="w-[400px] px-5 pr-0 hidden xl:block">
              <ActivityStream />
              <Footer />
            </div>
          </div>
        </div>

        <SearchSheetBox />
        <NotificationSheet />
      </div>
    </>
  );
}
