import { Helmet } from "react-helmet";
import { ActivityStream } from "../../components/ActivityStream.tsx";
import { LeftSidebar } from "../../components/LeftSidebar.tsx";
import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Header } from "../../components/Header.tsx";
import { SearchSheetBox } from "../../components/SearchBox.tsx";
import { NotificationSheet } from "../../components/NotificationSheet.tsx";
import { UnlinkedAccountNotice } from "../../components/UnlinkedAccountNotice.tsx";

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
            <div className="flex flex-col flex-1">
              <div className="h-full border border-gray-800 border-b-0 rounded-t-3xl bg-vampire-black">
                <UnlinkedAccountNotice />
              </div>
            </div>
            <div className="w-[400px] px-5 pr-0 hidden xl:block">
              <ActivityStream />
            </div>
          </div>
        </div>

        <SearchSheetBox />
        <NotificationSheet />
      </div>
    </>
  );
}
