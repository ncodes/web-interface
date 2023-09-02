import { Label } from "../ui/label.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { ActivityItem } from "./ActivityItem.tsx";
import { useQuery } from "@tanstack/react-query";
import { useLiquidityService } from "../../hooks/services/backend/useLiquidityService.ts";
import { Skeleton } from "../ui/skeleton.tsx";
import { ErrorIcon } from "react-hot-toast";
import { RequestError } from "../../libs/RequestError.ts";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";

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

export function ActivityLog({ liquidity }: { liquidity: Liquidity }) {
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
      <div className="relative bg-card-background divide-y divide-gray-800 border rounded-2xl mt-5 border-card-border w-full min-h-[300px]">
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

        <ScrollGradientIndicator side="bottom">
          <ScrollArea type="scroll" className="h-[400px]">
            {!events.isLoading && events.isSuccess && (
              <>
                {events.data?.map((event: Event) => (
                  <ActivityItem
                    event={event}
                    liquidity={liquidity}
                    market={liquidity?.market}
                    key={`${event.creator}-${event.action}`}
                  />
                ))}
              </>
            )}
          </ScrollArea>
        </ScrollGradientIndicator>
      </div>
    </div>
  );
}
