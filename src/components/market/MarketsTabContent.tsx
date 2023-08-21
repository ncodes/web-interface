import { TabsContent } from "../ui/Tabs.tsx";
import { Paginator } from "../Paginator.tsx";
import { MarketRow } from "./MarketRow.tsx";
import { useQuery } from "@tanstack/react-query";
import useConnector from "../../hooks/connectors/useConnector.tsx";
import { useMarketService } from "../../hooks/services/backend/useMarketService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { ErrorIcon } from "react-hot-toast";
import { useEffect, useState } from "react";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { RequestError } from "../../libs/RequestError.ts";

export function MarketsTabContent() {
  const { getChainInfo } = useConnector();
  const { listMarkets } = useMarketService();
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const marketFilter = useStore((state) => state.marketFilter);
  const [offset, setOffset] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [limit] = useState(1);
  const {
    isLoading,
    isRefetching,
    isRefetchError,
    isSuccess,
    isError,
    data,
    error,
  } = useQuery({
    queryKey: [
      "getMarkets",
      {
        network: getChainInfo().queryName,
        marketFilter: marketFilter,
        limit,
        offset,
      },
    ],
    queryFn: listMarkets,
    enabled: isMounted,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setOffset(0);
  }, [marketFilter]);

  useEffect(() => {
    if (isLoading || isRefetching) setLoaderProgress && setLoaderProgress(50);
    else setLoaderProgress && setLoaderProgress(100);
  }, [isError, isLoading, setLoaderProgress, isRefetching, isRefetchError]);

  return (
    <TabsContent value="markets" className="p-0 m-0 flex flex-col gap-3">
      {isLoading && <RowSkeleton />}

      {isError && (
        <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]">
          <ErrorIcon className="w-[20px]" /> {(error as RequestError)?.message}
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
            {data?.markets.map((market: Market) => (
              <MarketRow market={market} key={market.address} />
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

      {!isLoading && data?.markets?.length == 0 && (
        <div className="flex items-center justify-center font-light text-gray-400 h-[300px]">
          No market found
        </div>
      )}
    </TabsContent>
  );
}
