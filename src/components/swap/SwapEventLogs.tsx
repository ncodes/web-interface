import { useQuery } from "@tanstack/react-query";
import { ErrorIcon } from "react-hot-toast";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useSwapService } from "../../hooks/services/backend/useSwapService.ts";
import { RequestError } from "../../libs/RequestError.ts";
import { cn } from "../../libs/utils.ts";
import { Events } from "../../types/enums.ts";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ActivityLogSkeleton } from "../liquidity/LiquidityEventLog.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { EventItem } from "./EventItem.tsx";

export function SwapEventLogs({ swap }: { swap: Swap }) {
  const { getChainInfo } = useConnectorContext();
  const { getEvents } = useSwapService();
  const events = useQuery({
    queryKey: [
      "getSwapEvents",
      {
        network: getChainInfo().queryName,
        orderId: swap.orderId,
      },
    ],
    queryFn: getEvents,
    enabled: !!swap,
    refetchInterval: 10000,
  });

  return (
    <TabsContent value="logs" className="mt-0 px-0">
      <div className="bg-card-background scrollbar-hide  border-none rounded-2xl border-card-border w-full overflow-y-auto mt-2">
        <ScrollOverflowIndicator
          side="bottom"
          className="[&>span.grad-indicator]:mb-[0px]"
        >
          <ScrollArea
            type="scroll"
            className={cn({
              "h-[300px]": (events.data?.length || 0) > 3,
              "min-h-[150px]": (events.data?.length || 0) <= 3,
            })}
          >
            <div className="">
              {events.isLoading && (
                <span className="absolute w-full">
                  <ActivityLogSkeleton />
                  <ActivityLogSkeleton />
                </span>
              )}

              {events.isError && (
                <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]">
                  <ErrorIcon className="w-[20px]" />{" "}
                  {(events.error as RequestError)?.message}
                </div>
              )}

              {!events.isLoading && events.isSuccess && (
                <>
                  {events.data?.map((event: Event) => (
                    <EventItem
                      swap={swap}
                      event={event}
                      key={`${event.creator}:${event.action}:${event.createdAt}`}
                    />
                  ))}

                  <EventItem
                    key="new"
                    swap={swap}
                    event={
                      {
                        action: Events.SwapNew,
                        creator: swap.taker,
                        createdAt: swap.createdAt,
                      } as Event
                    }
                  />
                </>
              )}
            </div>
          </ScrollArea>
        </ScrollOverflowIndicator>
      </div>
    </TabsContent>
  );
}
