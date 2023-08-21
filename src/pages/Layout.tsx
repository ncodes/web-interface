import { Helmet } from "react-helmet";
import { LeftSidebar } from "../components/LeftSidebar.tsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Header } from "../components/Header.tsx";
import { SearchSheetBox } from "../components/SearchBox.tsx";
import { NotificationSheet } from "../components/NotificationSheet.tsx";
import { UnlinkedAccountNotice } from "../components/UnlinkedAccountNotice.tsx";
import useConnector from "../hooks/connectors/useConnector.tsx";
import { useUserService } from "../hooks/services/backend/useUserService.ts";
import { useQuery } from "@tanstack/react-query";
import { StoreAccessTokenKey } from "../constants.ts";
import useStore from "../hooks/store/useStore.ts";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "../libs/utils.ts";

export default function Layout({
  tab,
  rightSide,
}: {
  tab?: React.ReactNode;
  rightSide?: React.ReactNode;
}) {
  const headerHeight = 55;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLargeLaptop = useMediaQuery("(min-width: 1280px)");
  const { address } = useConnector();
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
    setMobileMenuOpen(isLargeLaptop);
  }, [isLargeLaptop]);

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
        <body className="bg-background " />
      </Helmet>

      <div
        ref={ref}
        className="container-x flex h-screen text-white text z-[5]"
      >
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
          <div className="flex flex-1 h-full">
            <div className="flex-1 flex flex-col mt-3">
              <UnlinkedAccountNotice />
              <div className="relative flex-1 flex flex-col">
                <div className="absolute z-0 min-h-full w-full h-auto border border-gray-800 border-b-0 rounded-t-3xl bg-vampire-black">
                  {tab}
                </div>
              </div>
            </div>
            {rightSide && (
              <motion.div
                animate={{
                  marginTop:
                    scrollYPos > headerHeight ? scrollYPos - headerHeight : 0,
                }}
                transition={{ ease: "linear", duration: 0.08 }}
                className={cn(`w-[400px] px-5 pr-0 h-full hidden xl:flex`)}
              >
                {rightSide}
              </motion.div>
            )}
          </div>
        </div>

        <SearchSheetBox />
        <NotificationSheet />
      </div>
    </div>
  );
}
