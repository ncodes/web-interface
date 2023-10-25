import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { ErrorIcon } from "react-hot-toast";
import { useLiquidityService } from "../../hooks/services/backend/useLiquidityService.ts";
import { RequestError } from "../../libs/RequestError.ts";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { Label } from "../ui/label.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { Skeleton } from "../ui/skeleton.tsx";

import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { LiquidityEventItem } from "./LiquidityEventItem.tsx";

export function ActivityLogSkeleton() {
  return (
    <div className="w-full flex gap-1 p-3 items-center">
      <Skeleton className="w-[30px] h-[30px] rounded-full" />
      <div className="flex flex-1 flex-col gap-1">
        <Skeleton className="w-6/12 h-[10px]" />
        <Skeleton className="w-full h-[10px]" />
      </div>
    </div>
  );
}

export function LiquidityEventLog({ liquidity }: { liquidity: Liquidity }) {
  const { getChainInfo } = useConnectorContext();
  const { getEvents } = useLiquidityService();
  const events = useQuery({
    queryKey: [
      "getLiquidityEvents",
      {
        network: getChainInfo().queryName,
        market: liquidity.marketAddress as string,
        provider: liquidity.provider as string,
        lid: liquidity.lid,
      },
    ],
    queryFn: getEvents,
    enabled: !!liquidity,
  });

  return (
    <div className=" pr-0 flex-1 ">
      <Label className="text-xl flex items-center gap-1 px-5">
        <span>Events</span>{" "}
        <ToolTip tip="Recent events associated with this liquidity">
          <InfoCircledIcon width="20px" className="relative top-[1px]" />
        </ToolTip>
      </Label>
      <div className="bg-card-background  divide-gray-800 border rounded-2xl mt-5 border-card-border w-full">
        {events.isLoading && (
          <div className="h-[100px] xl:h-[400px]">
            <ActivityLogSkeleton />
            <span className="hidden lg:block">
              <ActivityLogSkeleton />
              <ActivityLogSkeleton />
              <ActivityLogSkeleton />
            </span>
          </div>
        )}

        {events.isError && (
          <div className="flex items-center gap-2 text-red-300 justify-center font-light h-[300px]">
            <ErrorIcon className="w-[20px]" />{" "}
            {(events.error as RequestError)?.message}
          </div>
        )}

        {!events.isLoading && events.isSuccess && events.data.length == 0 && (
          <div className="h-[100px] flex xl:h-[400px] w-full items-center gap-2 text-gray-400 justify-center font-light">
            No events found
          </div>
        )}

        {!events.isLoading && events.isSuccess && events.data.length > 0 && (
          <ScrollOverflowIndicator side="bottom">
            <ScrollArea type="scroll" className="h-[300px] lg:h-[400px]">
              <div className="divide-y divide-gray-800">
                {events.data?.map((event: Event) => (
                  <LiquidityEventItem
                    event={event}
                    liquidity={liquidity}
                    market={liquidity?.market}
                    key={`${event.creator}-${event.action}`}
                  />
                ))}
              </div>
            </ScrollArea>
          </ScrollOverflowIndicator>
        )}
      </div>
    </div>
  );
}
