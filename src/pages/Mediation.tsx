import {
  ScrollArea,
  ScrollAreaHorizontal,
} from "../components/ui/scroll-area.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs.tsx";
import Layout from "./Layout.tsx";
import { DotsVerticalIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import ScrollGradientIndicator from "../components/ScrollGradientIndicator.tsx";
import { TicketRow } from "../components/mediation/TicketRow.tsx";
import { Button } from "../components/ui/Button.tsx";
import { NavLink } from "react-router-dom";
import { ToolTip } from "../components/ToolTip.tsx";
import { ReactNode } from "react";
import { BuyTicketSheet } from "../components/mediation/BuyTicketSheet.tsx";
import useStore from "../hooks/store/useStore.ts";

function MyTicketTabContent() {
  return <TicketRow ticket={{ index: 1 }} />;
}

function InfoCard({
  title,
  tip,
  children,
}: {
  title: string;
  tip: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex relative bg-card-background flex-col flex-1 border border-card-border rounded-xl">
      <div className="absolute px-5 justify-between py-3 flex items-center gap-1">
        <span className="flex items-center gap-1 text-gray-100">
          {title}
          <ToolTip tip={tip}>
            <InfoCircledIcon width="20px" />
          </ToolTip>
        </span>
        <span></span>
      </div>
      <div className="h-[100px] mt-5 lg:h-[150px] text-gray-100 font-light text-3xl flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function MediationTabContent() {
  return (
    <>
      <div className="flex gap-4 flex-col lg:flex-row">
        <div className="flex-1 bg-card-background border border-card-border rounded-xl">
          <div className="px-5 justify-between border-b border-gray-700/70 py-3 flex items-center gap-1">
            <span className="flex items-center gap-1">
              <InfoCircledIcon width="20px" />
              About Mediation
            </span>
            <span>
              <NavLink
                to=""
                className="text-gray-400 font-light text-sm hover:text-chinese-green"
              >
                Learn more
              </NavLink>
            </span>
          </div>
          <div className="px-5 py-3  text-gray-300 font-light text-sm">
            <ScrollGradientIndicator
              side="bottom"
              className="[&>span.grad-indicator]:rounded-none"
            >
              <ScrollArea type="scroll" className="h-[100px] overflow-auto">
                Joint Protocol relies on the power of the community to resolve
                interactive swap disputes when the parties cannot agree and
                finalize a swap. During disputes, Joint randomly selects
                mediators from a pool of mediator ticket holders to review the
                dispute and vote on the outcome. Joint Protocol rewards
                successful mediators.
              </ScrollArea>
            </ScrollGradientIndicator>
          </div>
        </div>
        <InfoCard
          title="Ticket Price"
          tip="The current price for purchasing 1 ticket"
        >
          <div className="text-center text-chinese-green relative flex flex-col justify-center items-center">
            <span>
              34.5 <span className="text-gray-400">P2P</span>
            </span>
            <span className="text-sm text-gray-400">($12.50)</span>
          </div>
        </InfoCard>
        <InfoCard
          title="Total Available Tickets"
          tip="The total amount of tickets yet to be sold"
        >
          <div className="text-center text-chinese-green relative flex flex-col justify-center items-center">
            <span>15,4503</span>
            <span className="text-sm text-gray-400">Total Supply: 25,000</span>
          </div>
        </InfoCard>
      </div>
      <div className="flex gap-4 flex-col lg:flex-row">
        <InfoCard
          title="Total Bonds"
          tip="The total amount of bond locked for all tickets"
        >
          <div className="text-center text-chinese-green relative flex flex-col items-center">
            <span>
              44,350,000 <span className="text-gray-400">P2P</span>
            </span>
            <span className="text-sm text-gray-400">($10,000,000)</span>
          </div>
        </InfoCard>

        <InfoCard title="Tickets Owned" tip="The number of tickets you own">
          <div className="text-center text-chinese-green relative flex flex-col items-center">
            <span>32</span>
          </div>
        </InfoCard>

        <InfoCard
          title="Owned Ticket Bonds"
          tip="The total amount of bond locked in tickets owned by you"
        >
          <div className="text-center text-chinese-green relative flex flex-col items-center">
            <span>
              1,050,000 <span className="text-gray-400">P2P</span>
            </span>
            <span className="text-sm text-gray-400">($400,000)</span>
          </div>
        </InfoCard>
      </div>
    </>
  );
}

function Page() {
  const toggleOpenState = useStore((state) => state.toggleOpenState);

  return (
    <Tabs
      defaultValue="mediation"
      className="w-full h-full transition-all duration-500"
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollGradientIndicator className="[&::before]:rounded-tr-none w-full">
          <ScrollAreaHorizontal type="scroll" className="w-full">
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="mediation"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Mediation
              </TabsTrigger>
              <TabsTrigger
                value="my-disputes"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                My Tickets
              </TabsTrigger>
            </div>
          </ScrollAreaHorizontal>
        </ScrollGradientIndicator>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end">
          <div>
            <Button
              size="sm"
              onClick={() => {
                toggleOpenState("buyTicketSheet");
              }}
            >
              Buy Ticket
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="md:hidden justify-center flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green">
                <DotsVerticalIcon />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0"></DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TabsList>
      <TabsContent value="my-disputes" className="p-3 pt-0 flex flex-col gap-3">
        <MyTicketTabContent />
      </TabsContent>
      <TabsContent value="mediation" className="p-3 pt-0 flex flex-col gap-3">
        <MediationTabContent />
      </TabsContent>
      <BuyTicketSheet />
    </Tabs>
  );
}

export default function Mediation() {
  return (
    <Layout
      tab={<Page />}
      // rightSide={
      //   <div className="flex flex-col h-full mt-2">
      //     <div className="text-gray-200">{/*<Footer />*/}</div>
      //   </div>
      // }
    />
  );
}
