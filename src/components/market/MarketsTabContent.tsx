import { TabsContent } from "../ui/Tabs.tsx";
import { Paginator } from "../Paginator.tsx";
import { MarketRow } from "./MarketRow.tsx";
import { useQuery } from "@tanstack/react-query";
import { useMarketService } from "../../hooks/services/backend/useMarketService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { ErrorIcon } from "react-hot-toast";
import { useEffect, useState } from "react";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { RequestError } from "../../libs/RequestError.ts";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";

export function MarketsTabContent() {
  const { getChainInfo } = useConnectorContext();
  const { listMarkets } = useMarketService();
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const fullLoadCount = useStore((state) => state.fullLoadCount);
  const marketFilter = useStore((state) => state.marketFilter);
  const [offset, setOffset] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [limit] = useState(60);
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
    keepPreviousData: true,
    enabled: isMounted,
    refetchInterval: 10000,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setOffset(0);
  }, [marketFilter]);

  useEffect(() => {
    if (fullLoadCount > 0) return; // no need to show loader if data is already cached
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

      {!isLoading && isSuccess && data?.markets?.length > 0 && (
        <div className="flex flex-col gap-3 min-h-[500px]">
          <div className="flex flex-col gap-3">
            <Paginator
              curPage={offset}
              total={data?.meta?.queryCount}
              limit={limit}
              onNext={() => setOffset(offset + 1)}
              onPrev={() => setOffset(offset - 1)}
            />
            <div className="flex flex-col gap-3 p-3 pt-0 pb-0">
              {data?.markets.map((market: Market) => (
                <MarketRow market={market} key={market.address} />
              ))}
              {data?.markets.map((market: Market) => (
                <MarketRow market={market} key={market.address} />
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

      {!isLoading && data?.markets?.length == 0 && (
        <div className="flex items-center justify-center font-light text-gray-400 h-[300px]">
          No market found
        </div>
      )}
    </TabsContent>
  );
}
