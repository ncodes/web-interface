import { Helmet } from "react-helmet";
import { LeftSidebar } from "../components/LeftSidebar.tsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Header } from "../components/Header.tsx";
import { NotificationSheet } from "../components/NotificationSheet.tsx";
import { UnlinkedAccountNotice } from "../components/UnlinkedAccountNotice.tsx";
import { useUserService } from "../hooks/services/backend/useUserService.ts";
import { useQuery } from "@tanstack/react-query";
import { StoreAccessTokenKey } from "../constants.ts";
import useStore from "../hooks/store/useStore.ts";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "../libs/utils.ts";
import { useConnectorContext } from "../hooks/connectors/context.tsx";
import { SearchSheetBox } from "../components/search/SearchSheetBox.tsx";
import { Footer } from "../components/Footer.tsx";

export default function Layout({
  tab,
  rightSide,
}: {
  tab?: React.ReactNode;
  rightSide?: React.ReactNode;
}) {
  const headerHeight = 55;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isXl = useMediaQuery("(min-width: 1280px)");
  const { address } = useConnectorContext();
  const setUser = useStore((state) => state.setUser);
  const { getUser } = useUserService();
  const accessToken = localStorage.getItem(StoreAccessTokenKey);
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const query = useQuery({
    queryKey: ["getUser", { address }],
    queryFn: getUser,
    enabled: !!accessToken && !!address,
    refetchIntervalInBackground: false,
  });
  const [scrollYPos, setScrollYPos] = useState(0);

  useEffect(() => {
    if (!query.isSuccess) return;
    setUser(query.data);
  }, [query.data, query.isSuccess, setUser]);

  useEffect(() => {
    setMobileMenuOpen(isXl);
  }, [isXl]);

  useMotionValueEvent(scrollY, "change", (val) => {
    setScrollYPos(val);
  });

  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen);
  }, [mobileMenuOpen]);

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
        <body className="bg-background" />
      </Helmet>

      <div ref={ref} className="container-x flex h-screen text-white text ">
        <LeftSidebar
          open={mobileMenuOpen}
          headerHeight={headerHeight}
          scrollYPos={scrollYPos}
          closeRequested={() => {
            setMobileMenuOpen(false);
          }}
        />

        <div className="flex flex-col flex-1 pt-3 z-10">
          <div>
            <Header onClick={openMobileMenu} height={`h-[${headerHeight}px]`} />
          </div>
          <div className="flex flex-1">
            <div className="flex-1 flex flex-col mt-3">
              <UnlinkedAccountNotice />
              <div className="relative flex-1 flex flex-col">
                <div className="absolute w-full">
                  <div className="z-0  border border-gray-800 rounded-3xl bg-vampire-black">
                    {tab}
                  </div>
                  <div className="lg:hidden">
                    <Footer />
                  </div>
                </div>
              </div>
            </div>
            {rightSide && (
              <div className="w-[400px] relative hidden xl:flex flex-col">
                <div
                  className={`fixed h-full flex flex-col flex-1`}
                  style={{ paddingBottom: `${headerHeight}px` }}
                >
                  <motion.div
                    animate={{
                      marginTop: scrollYPos > 50 ? -55 : 0,
                    }}
                    transition={{ ease: "linear", duration: 0.1 }}
                    className={cn(
                      `flex-1 w-[400px] px-5 pr-0 overflow-auto hidden xl:flex`
                    )}
                  >
                    {rightSide}
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>

        <SearchSheetBox />
        <NotificationSheet />
      </div>
    </div>
  );
}
