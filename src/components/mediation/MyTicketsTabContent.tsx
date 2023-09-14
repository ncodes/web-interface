import { TabsContent } from "../ui/Tabs.tsx";
import { Paginator } from "../Paginator.tsx";
import { TicketRow } from "./TicketRow.tsx";
import useStore from "../../hooks/store/useStore.ts";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { ErrorIcon } from "react-hot-toast";
import { RequestError } from "../../libs/RequestError.ts";
import { PlugZapIcon } from "lucide-react";
import { useTicketService } from "../../hooks/services/backend/useTicketService.ts";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";

export function MyTicketsTabContent() {
  const { getChainInfo, address } = useConnectorContext();
  const { listTickets } = useTicketService();
  const ticketFilter = useStore((state) => state.ticketFilter);
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(1);
  const {
    isLoading,
    isSuccess,
    isRefetching,
    isError,
    fetchStatus,
    isRefetchError,
    data,
    error,
  } = useQuery({
    queryKey: [
      "getTicketsOwned",
      {
        network: getChainInfo().queryName,
        limit,
        offset,
        connectedAddress: address,
        ticketFilter,
      },
    ],
    queryFn: listTickets,
    keepPreviousData: true,
    enabled: !!address,
  });

  useEffect(() => {
    if ((fetchStatus != "idle" && isLoading) || isRefetching)
      setLoaderProgress && setLoaderProgress(50);
    else setLoaderProgress && setLoaderProgress(100);
  }, [
    isError,
    isLoading,
    setLoaderProgress,
    isRefetching,
    isRefetchError,
    fetchStatus,
  ]);

  return (
    <TabsContent value="my-tickets" className="p-0 m-0 flex flex-col gap-3">
      {isLoading && fetchStatus != "idle" && <RowSkeleton />}

      {isError && (
        <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]">
          <ErrorIcon className="w-[20px]" /> {(error as RequestError)?.message}
        </div>
      )}

      {!address && (
        <div className="flex select-none items-center gap-2 text-chinese-green justify-center font-light  h-[300px]">
          <PlugZapIcon className="w-[20px]" /> Connect your wallet
        </div>
      )}

      {!isLoading && isSuccess && data?.tickets?.length > 0 && (
        <div className="flex flex-col gap-3 min-h-[500px]">
          <div className="flex flex-col gap-3">
            <Paginator
              curPage={offset}
              total={data?.meta?.queryCount}
              limit={limit}
              onNext={() => setOffset(offset + 1)}
              onPrev={() => setOffset(offset - 1)}
            />
            <div className="flex flex-col gap-3 p-3 pt-0">
              {data?.tickets.map((ticket: Ticket) => (
                <TicketRow
                  ticket={ticket}
                  key={`${ticket.owner}:${ticket.index}`}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <Paginator
              className="border-t"
              curPage={offset}
              total={data?.meta?.queryCount}
              limit={limit}
              onNext={() => setOffset(offset + 1)}
              onPrev={() => setOffset(offset - 1)}
            />
          </div>
        </div>
      )}

      {!isLoading && data?.tickets?.length == 0 && (
        <div className="flex items-center justify-center font-light text-gray-400 h-[300px]">
          No ticket found
        </div>
      )}
    </TabsContent>
  );
}
