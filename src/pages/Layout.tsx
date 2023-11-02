import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { useInterval, useMediaQuery } from "usehooks-ts";
import { AccountLinker } from "../components/AccountLinker.tsx";
import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";
import { LeftSidebar } from "../components/LeftSidebar.tsx";
import { NotificationSheet } from "../components/NotificationSheet.tsx";
import { ReviewViewerSheet } from "../components/ReviewViewerSheet.tsx";
import { SearchSheetBox } from "../components/search/SearchSheetBox.tsx";
import { StoreAccessTokenKey } from "../constants.ts";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import { useNotificationService } from "../hooks/services/backend/useNotificationService.ts";
import { useUserService } from "../hooks/services/backend/useUserService.ts";
import useStore from "../hooks/store/useStore.ts";
import useWindowFocus from "../hooks/useWindowFocus.ts";
import { cn } from "../libs/utils.ts";

export default function Layout({
  body,
  rightSide,
  bodyContainerClassName,
}: {
  body?: React.ReactNode;
  rightSide?: React.ReactNode;
  bodyContainerClassName?: string;
}) {
  const headerHeight = 55;
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isXl = useMediaQuery("(min-width: 1280px)");
  const { address, getChainInfo } = useConnectorContext();
  const user = useStore((state) => state.user);
  const windowFocus = useWindowFocus();
  const setUser = useStore((state) => state.setUser);
  const { getUser, logOnlineStatus, registerDevice } = useUserService();
  const accessToken = localStorage.getItem(StoreAccessTokenKey);
  const { subscribeForWebPush } = useNotificationService();
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const [scrollYPos, setScrollYPos] = useState(0);

  const query = useQuery({
    queryKey: ["getUser", { address }],
    queryFn: getUser,
    enabled: !!accessToken && !!address,
  });

  const subscribeMutation = useMutation({
    mutationFn: subscribeForWebPush,
  });

  const logOnlineStatusMutation = useMutation({
    mutationFn: logOnlineStatus,
  });

  const registerDeviceMutation = useMutation({
    mutationFn: registerDevice,
  });

  useEffect(() => {
    if (query.isLoading) return;
    setUser(query.isSuccess ? query.data : null);
  }, [query.data, query.isLoading, query.isSuccess, setUser]);

  useEffect(() => {
    setMobileMenuOpen(isXl);
  }, [isXl]);

  useMotionValueEvent(scrollY, "change", (val) => {
    setScrollYPos(val);
  });

  // Log online status every 10 seconds.
  useInterval(() => {
    if (!user || !windowFocus) return;

    const orderMatch = location.pathname.match(/\/swap\/([0-9]+)/);
    const orderId = orderMatch ? parseInt(orderMatch[1]) : undefined;
    const offerMatch = location.pathname.match(/\/offer\/([0-9]+)/);
    const offerId = offerMatch ? parseInt(offerMatch[1]) : undefined;

    logOnlineStatusMutation.mutate({
      net: getChainInfo().queryName,
      orderId,
      offerId,
    });
  }, determineOnlineStatusReportDelay());

  // Register user devices
  useEffect(() => {
    if (!user) return;
    registerDeviceMutation.mutate();
  }, [user]);

  // Subscribe for web push notifications.
  useEffect(() => {
    if (!address) return;
    if ("serviceWorker" in navigator)
      registerServiceWorker().catch(console.error);
  }, [address]);

  // Register service worker.
  async function registerServiceWorker() {
    try {
      const { serviceWorker: sw } = navigator;
      const register = await sw.register("/worker.js", { scope: "/" });
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      });

      subscribeMutation.mutate({
        subscription,
        address,
        net: getChainInfo().queryName,
      });
    } catch (error) {
      console.error("Failed to subscribe user for notification: ", error);
    }
  }

  // Determine duration to wait before reporting online status.
  function determineOnlineStatusReportDelay() {
    if (location.pathname.match(/\/swap\/([0-9]+)/)) return 5000;
    if (location.pathname.match(/\/offer\/([0-9]+)/)) return 5000;
    return 10000;
  }

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
            <Header
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              height={`h-[${headerHeight}px]`}
            />
          </div>
          <div className="flex flex-1">
            <div className="flex-1 flex flex-col mt-3">
              <AccountLinker />
              <div className="relative flex-1 flex flex-col">
                <div className="absolute w-full h-full">
                  <div
                    className={cn(
                      "z-0 border border-gray-800 rounded-3xl bg-vampire-black",
                      bodyContainerClassName
                    )}
                  >
                    {body}
                  </div>
                  <div className="xl:hidden">
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
        <ReviewViewerSheet />
      </div>
    </div>
  );
}
