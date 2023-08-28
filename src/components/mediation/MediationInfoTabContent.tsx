import { ReactNode } from "react";
import { ToolTip } from "../ToolTip.tsx";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { NavLink } from "react-router-dom";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { TabsContent } from "../ui/Tabs.tsx";

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

export function MediationInfoTabContent() {
  return (
    <TabsContent value="mediation" className="p-3 pt-0 flex flex-col gap-3">
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
    </TabsContent>
  );
}
