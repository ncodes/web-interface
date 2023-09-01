import { TabsContent } from "../ui/Tabs.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { EventItem } from "./EventItem.tsx";
import useConnector from "../../hooks/connectors/useConnector.tsx";
import { useQuery } from "@tanstack/react-query";
import { useSwapService } from "../../hooks/services/backend/useSwapService.ts";
import { ErrorIcon } from "react-hot-toast";
import { RequestError } from "../../libs/RequestError.ts";
import { ActivityLogSkeleton } from "../liquidity/ActivityLog.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { Events } from "../../types/enums.ts";

export function SwapEventLogs({ swap }: { swap: Swap }) {
  const { getChainInfo } = useConnector();
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
  });

  return (
    <TabsContent value="logs" className="mt-0 px-0">
      <div className="bg-card-background scrollbar-hide  border rounded-2xl border-card-border w-full overflow-y-auto mt-4">
        <ScrollGradientIndicator
          side="bottom"
          className="[&>span.grad-indicator]:mb-[0px]"
        >
          <ScrollArea type="scroll" className="h-[300px]">
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
                  <EventItem
                    swap={swap}
                    event={
                      {
                        action: Events.SwapNew,
                        creator: swap.taker,
                        createdAt: swap.createdAt,
                      } as Event
                    }
                  />

                  {events.data?.map((event: Event) => (
                    <>
                      <EventItem swap={swap} event={event} />
                    </>
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
        </ScrollGradientIndicator>
      </div>
    </TabsContent>
  );
}
