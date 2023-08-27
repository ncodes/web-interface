import { TabsContent } from "../ui/Tabs.tsx";
import { Paginator } from "../Paginator.tsx";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { ErrorIcon } from "react-hot-toast";
import { RequestError } from "../../libs/RequestError.ts";
import { PlugZapIcon } from "lucide-react";
import useConnector from "../../hooks/connectors/useConnector.tsx";
import useStore from "../../hooks/store/useStore.ts";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DisputeRow } from "./DisputeRow.tsx";
import { useDisputeService } from "../../hooks/services/backend/useDisputeService.ts";

export function MyDisputeTabContent() {
  const { getChainInfo, address } = useConnector();
  const { listDisputes } = useDisputeService();
  const disputeFilter = useStore((state) => state.disputeFilter);
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
      "getDisputesAsParticipant",
      {
        network: getChainInfo().queryName,
        limit,
        offset,
        connectedAddress: address,
        disputeFilter,
      },
    ],
    queryFn: listDisputes,
    enabled: !!address,
    refetchInterval: false,
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
    <TabsContent value="my-disputes" className="p-0 m-0 flex flex-col gap-3">
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

      {!isLoading && isSuccess && (
        <>
          <Paginator
            curPage={offset}
            total={data?.meta?.queryCount}
            limit={limit}
            onNext={() => setOffset(offset + 1)}
            onPrev={() => setOffset(offset - 1)}
          />
          <div className="flex flex-col gap-3 p-3 pt-0">
            {data?.disputes.map((dispute: Dispute) => (
              <DisputeRow
                dispute={dispute}
                key={`${dispute.orderId}:${dispute.disputeId}`}
              />
            ))}
          </div>
          <Paginator
            className="border-t"
            curPage={offset}
            total={data?.meta?.queryCount}
            limit={limit}
            onNext={() => setOffset(offset + 1)}
            onPrev={() => setOffset(offset - 1)}
          />
        </>
      )}

      {!isLoading && data?.disputes?.length == 0 && (
        <div className="flex items-center justify-center font-light text-gray-400 h-[300px]">
          No dispute found
        </div>
      )}
    </TabsContent>
  );
}
