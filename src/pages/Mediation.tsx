import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer.tsx";
import ScrollOverflowIndicator from "../components/ScrollOverflowIndicator.tsx";
import IconFilterOutline from "../components/icons/IconFilterOutline.tsx";
import { BuyTicketSheet } from "../components/mediation/BuyTicketSheet.tsx";
import { MyTicketsTabContent } from "../components/mediation/MyTicketsTabContent.tsx";
import { TicketFilter } from "../components/mediation/TicketFilter.tsx";
import { TicketFilterSheet } from "../components/mediation/TicketFilterSheet.tsx";
import { TicketsStatsTabContent } from "../components/mediation/TicketsStatsTabContent.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import useStore from "../hooks/store/useStore.ts";
import Layout from "./Layout.tsx";

import { IconPlus } from "../components/icons/IconPlus.tsx";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";

function MediationTabs({ defaultTab }: { defaultTab?: string }) {
  const { connected } = useConnectorContext();
  const toggleOpenState = useStore((state) => state.toggleOpenState);
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(defaultTab || "mediation");
  const [openFilterSheet, setOpenFilterSheet] = useState(false);

  useEffect(() => {
    setCurrentTab(defaultTab || "my-tickets");
  }, [defaultTab]);

  return (
    <Tabs
      value={defaultTab || "my-tickets"}
      className="flex flex-col flex-1 w-full h-full transition-all duration-500"
      onValueChange={(value) => {
        setCurrentTab(value);
      }}
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollOverflowIndicator className="[&::before]:rounded-tr-none w-full">
          <ScrollAreaHorizontal type="scroll" className="w-full">
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="my-tickets"
                className="font-light relative top-2  font-jersey25 text-[18px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/my/tickets");
                }}
              >
                My Tickets
              </TabsTrigger>
              <TabsTrigger
                value="ticket-stats"
                className="font-light relative top-2  font-jersey25 text-[18px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/tickets/stats");
                }}
              >
                Ticket Stats
              </TabsTrigger>
            </div>
          </ScrollAreaHorizontal>
        </ScrollOverflowIndicator>
        <div className="flex shrink-0 gap-2 items-center justify-end">
          <div className="hidden md:inline">
            {connected && (
              <Button
                size="sm"
                onClick={() => {
                  toggleOpenState("buyTicketSheet");
                }}
                className="gap-2 transition-all duration-500 hover:scale-x-105 "
              >
                <IconPlus width="20px" /> Buy Ticket
              </Button>
            )}
          </div>
          {connected && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="md:hidden justify-center flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green">
                  <DotsVerticalIcon />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => {
                    toggleOpenState("buyTicketSheet");
                  }}
                >
                  <IconPlus width="20px" /> Buy Ticket
                </DropdownMenuItem>
                {currentTab == "my-tickets" && (
                  <DropdownMenuItem
                    className="flex gap-2"
                    onClick={() => {
                      setOpenFilterSheet(true);
                    }}
                  >
                    <IconFilterOutline /> Filter Tickets
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </TabsList>
      {currentTab == "my-tickets" && <MyTicketsTabContent />}
      {currentTab == "ticket-stats" && <TicketsStatsTabContent />}
      <BuyTicketSheet />
      <TicketFilterSheet
        active={openFilterSheet}
        onOpen={(open) => {
          setOpenFilterSheet(open);
        }}
      />
    </Tabs>
  );
}

export default function Mediation({ defaultTab }: { defaultTab?: string }) {
  const loc = useLocation();
  const { connected } = useConnectorContext();

  const rightSide = connected
    ? loc.pathname.startsWith("/my/tickets") && (
        <div className="flex w-full h-full justify-between flex-col pt-3">
          <TicketFilter />
          <div className="relative">
            <div className="text-gray-200 bottom-0 w-full">
              <Footer />
            </div>
          </div>
        </div>
      )
    : null;

  return (
    <Layout
      title="My Tickets - Joint"
      bodyContainerClassName="min-h-[97%] xl:min-h-full flex flex-col"
      body={<MediationTabs defaultTab={defaultTab} />}
      rightSide={rightSide}
    />
  );
}
