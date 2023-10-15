import { useInfiniteQuery } from "@tanstack/react-query";
import { useWindowScroll } from "@uidotdev/usehooks";
import { Fragment, useEffect } from "react";
import { ErrorIcon } from "react-hot-toast";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useTimelineService } from "../../hooks/services/backend/useTimelineService.ts";
import { RequestError } from "../../libs/RequestError.ts";
import IconSpinner from "../icons/IconSpinner.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import { Skeleton } from "../ui/skeleton.tsx";
import TimelineEvent from "./TimelineEvent.tsx";

function RowSkeleton() {
  return (
    <div className="flex gap-2 w-full md:w-[500px]">
      <Skeleton className="w-[35px] h-[35px] rounded-full" />
      <div className="flex-1 flex flex-col gap-1">
        <Skeleton className="w-full h-[20px]" />
        <Skeleton className="w-full h-[20px]" />
      </div>
    </div>
  );
}
export function HomeTabContent() {
  const { getChainInfo } = useConnectorContext();
  const { get } = useTimelineService();
  const [{ y }] = useWindowScroll();
  const events = useInfiniteQuery({
    queryKey: [
      "getTimelineEvents",
      { network: getChainInfo().queryName, limit: 1 },
    ],
    queryFn: get,
    keepPreviousData: true,
    getNextPageParam: (lastPage) => {
      return lastPage.events.length > 0 ? lastPage.events[0].sn : undefined;
    },
  });

  useEffect(() => {
    const h = document.documentElement,
      b = document.body,
      st = "scrollTop",
      sh = "scrollHeight";
    const percent =
      ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
    if (percent >= 90 && !events.isFetchingNextPage) {
      events.fetchNextPage().catch(console.error);
    }
  }, [y]);

  setTimeout(() => {
    events.fetchNextPage().catch(console.error);
  }, 5000);

  return (
    <TabsContent value="home" className="h-auto">
      <div className="flex flex-col md:items-center gap-5 md:px-5 py-5">
        {events.isLoading && <RowSkeleton />}

        {events.isError && (
          <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]">
            <ErrorIcon className="w-[20px]" />{" "}
            {(events.error as RequestError)?.message}
          </div>
        )}

        {events.data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.events.map((event) => (
              <Fragment
                key={`${event.creator}:${event.action}:${event.createdAt}`}
              >
                <TimelineEvent event={event}></TimelineEvent>
              </Fragment>
            ))}
          </Fragment>
        ))}

        {events.isFetchingNextPage && (
          <div className="flex justify-center items-center gap-2 font-light text-sm text-gray-400">
            <IconSpinner
              width="20"
              className="animate-spin"
              fill="fill-[#3d5226]"
            />
          </div>
        )}
      </div>
    </TabsContent>
  );
}
