import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import Helmet from "react-helmet";
import { NavLink } from "react-router-dom";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useTicketService } from "../../hooks/services/backend/useTicketService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { formatToHighDenom, formatToMoney } from "../../libs/helpers.ts";
import { MainContainerConnectButton } from "../MainContainerConnectButton.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { Skeleton } from "../ui/skeleton.tsx";

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

function InfoSkeleton() {
  return (
    <div className="flex flex-col gap-1 items-center">
      <Skeleton className="w-[120px] h-[20px]" />
      <Skeleton className="w-[80px] h-[20px]" />
    </div>
  );
}

export function TicketsStatsTabContent() {
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const { address, network } = useConnectorContext();
  const { getStats } = useTicketService();
  const { isLoading, data, isRefetching, isSuccess, isRefetchError, isError } =
    useQuery({
      queryKey: ["getStats", { net: network, owner: address }],
      queryFn: getStats,
      enabled: !!address,
    });

  useEffect(() => {
    if (isLoading || isRefetching) setLoaderProgress && setLoaderProgress(50);
    else setLoaderProgress && setLoaderProgress(100);
  }, [isError, isLoading, setLoaderProgress, isRefetching, isRefetchError]);

  return (
    <TabsContent
      value="ticket-stats"
      className="min-h-full p-0 m-0 pt-0 flex flex-col gap-3"
    >
      <Helmet>
        <title>{`Ticket Stats - Joint`}</title>
      </Helmet>

      {!address && <MainContainerConnectButton />}

      {address && (
        <div className="p-3 min-h-[300px] xl:min-h-[610px]">
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
                <ScrollOverflowIndicator
                  side="bottom"
                  className="[&>span.grad-indicator]:rounded-none"
                >
                  <ScrollArea type="scroll" className="h-[100px] overflow-auto">
                    Joint Protocol relies on the power of the community to
                    resolve interactive swap disputes when the parties cannot
                    agree and finalize a swap. During disputes, Joint randomly
                    selects mediators from a pool of mediator ticket holders to
                    review the dispute and vote on the outcome. Joint Protocol
                    rewards successful mediators.
                  </ScrollArea>
                </ScrollOverflowIndicator>
              </div>
            </div>
            <InfoCard
              title="Ticket Price"
              tip="The current price for purchasing 1 ticket"
            >
              <div className="text-center text-chinese-green relative flex flex-col justify-center items-center">
                {isLoading && <InfoSkeleton />}
                {!isLoading && isSuccess && (
                  <>
                    <span className="text-lg md:text-3xl">
                      {formatToHighDenom(data.price, 18)}{" "}
                      <span className="text-gray-400">P2P</span>
                    </span>
                    <span className="text-sm text-gray-400">
                      (${formatToMoney(data?.priceUsd || "0")})
                    </span>
                  </>
                )}
              </div>
            </InfoCard>
            <InfoCard
              title="Total Available Tickets"
              tip="The total amount of tickets yet to be sold"
            >
              <div className="text-center text-chinese-green relative flex flex-col justify-center items-center">
                {isLoading && <InfoSkeleton />}
                {!isLoading && isSuccess && (
                  <span className="flex flex-col text-lg md:text-3xl">
                    <span>{formatToMoney(data?.ticketAvailable || "0")}</span>
                    <span className="text-sm text-gray-400">
                      Total Supply: {formatToMoney(data?.ticketSupply || "0")}
                    </span>
                  </span>
                )}
              </div>
            </InfoCard>
          </div>
          <div className="flex gap-4 flex-col lg:flex-row">
            <InfoCard
              title="Total Bonds"
              tip="The total amount of bond locked for all tickets"
            >
              <div className="text-center text-chinese-green relative flex flex-col items-center">
                {isLoading && <InfoSkeleton />}
                {!isLoading && isSuccess && (
                  <span className="flex flex-col text-lg md:text-3xl">
                    <span>
                      {formatToHighDenom(data?.totalBonds, 18)}{" "}
                      <span className="text-gray-400">P2P</span>
                    </span>
                    <span className="text-sm text-gray-400">
                      (${formatToMoney(data?.totalBondsUsd || "0")})
                    </span>
                  </span>
                )}
              </div>
            </InfoCard>

            <InfoCard title="Tickets Owned" tip="The number of tickets you own">
              <div className="text-center text-chinese-green relative flex flex-col items-center text-lg md:text-3xl">
                {isLoading && <InfoSkeleton />}
                {!isLoading && isSuccess && <span>{data?.owner?.total}</span>}
              </div>
            </InfoCard>

            <InfoCard
              title="Owned Ticket Bonds"
              tip="The total amount of bond locked in tickets owned by you"
            >
              <div className="text-center text-chinese-green relative flex flex-col items-center">
                {isLoading && <InfoSkeleton />}
                {!isLoading && isSuccess && (
                  <span className="flex flex-col text-lg md:text-3xl">
                    <span>
                      {formatToHighDenom(data?.owner?.totalBonds || "0", 18)}{" "}
                      <span className="text-gray-400">P2P</span>
                    </span>
                    <span className="text-sm text-gray-400">
                      (${formatToMoney(data?.owner?.totalBondsUsd || "0")})
                    </span>
                  </span>
                )}
              </div>
            </InfoCard>
          </div>
        </div>
      )}
    </TabsContent>
  );
}
