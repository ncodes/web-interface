import { Helmet } from "react-helmet";
import { LeftSidebar } from "../../components/LeftSidebar.tsx";
import React, { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Header } from "../../components/Header.tsx";
import { SearchSheetBox } from "../../components/SearchBox.tsx";
import { NotificationSheet } from "../../components/NotificationSheet.tsx";
import { UnlinkedAccountNotice } from "../../components/UnlinkedAccountNotice.tsx";
import useConnector from "../../hooks/connectors/useConnector.tsx";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import { useQuery } from "@tanstack/react-query";
import { StoreAccessTokenKey } from "../../constants.ts";
import useStore from "../../hooks/store/useStore.ts";

export default function Layout({
  tab,
  rightSide,
}: {
  tab?: React.ReactNode;
  rightSide?: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLargeLaptop = useMediaQuery("(min-width: 1280px)");
  const { address } = useConnector();
  const setUser = useStore((state) => state.setUser);
  const { getUser } = useUserService();
  const accessToken = localStorage.getItem(StoreAccessTokenKey);
  const query = useQuery({
    queryKey: ["user", address],
    queryFn: getUser,
    enabled: !!accessToken && !!address,
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (!query.isSuccess) return;
    setUser(query.data);
  }, [query.data, query.isSuccess, setUser]);

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
                {tab}
              </div>
            </div>
            {rightSide && (
              <div className="w-[400px] px-5 pr-0 hidden xl:block">
                {rightSide}
              </div>
            )}
          </div>
        </div>

        <SearchSheetBox />
        <NotificationSheet />
      </div>
    </>
  );
}
