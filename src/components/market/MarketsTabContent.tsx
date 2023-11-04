import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ErrorIcon } from "react-hot-toast";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useMarketService } from "../../hooks/services/backend/useMarketService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { RequestError } from "../../libs/RequestError.ts";
import { isEqlStr } from "../../libs/helpers.ts";
import { Paginator } from "../Paginator.tsx";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import { MarketRow } from "./MarketRow.tsx";

export function MarketsTabContent() {
  const { getChainInfo, address } = useConnectorContext();
  const { listMarkets } = useMarketService();
  const currentRegion = useStore((state) => state.currentRegion);
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const loaderProgress = useStore((state) => state.loaderProgress);
  const marketFilter = useStore((state) => state.marketFilter);
  const [offset, setOffset] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [limit] = useState(60);
  const regionBadge = import.meta.env.VITE_REGION_BADGE;
  const fetchMarkets = useQuery({
    queryKey: [
      "getMarkets",
      {
        network: getChainInfo().queryName,
        marketFilter: {
          ...marketFilter,
          creator: import.meta.env.VITE_OPERATOR_MARKET_CREATOR,
          regions: currentRegion
            ? `${regionBadge}/${currentRegion}`
            : undefined,
        },
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

  // Update global progress bar on market fetch
  useEffect(() => {
    const { isLoading, isRefetching } = fetchMarkets;
    if (isLoading) setLoaderProgress && setLoaderProgress(50);
    if (!(isRefetching || isLoading) && loaderProgress == 50)
      setLoaderProgress?.(100);
  }, [fetchMarkets.isLoading, fetchMarkets.isRefetching, loaderProgress]);

  // Set loader to 50% when market filter changes.
  useEffect(() => {
    setLoaderProgress?.(50);
  }, [marketFilter]);

  return (
    <TabsContent value="markets" className="p-0 m-0 flex flex-col gap-3">
      {fetchMarkets.isLoading && <RowSkeleton />}

      {fetchMarkets.isError && (
        <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]">
          <ErrorIcon className="w-[20px]" />{" "}
          {(fetchMarkets.error as RequestError)?.message}
        </div>
      )}

      {!fetchMarkets.isLoading &&
        fetchMarkets.isSuccess &&
        fetchMarkets.data?.markets?.length > 0 && (
          <div className="flex flex-col gap-3 min-h-[500px]">
            <div className="flex flex-col gap-3">
              <Paginator
                curPage={offset}
                total={fetchMarkets.data?.meta?.queryCount}
                limit={limit}
                onNext={() => setOffset(offset + limit)}
                onPrev={() => setOffset(offset - limit)}
              />
              <div className="flex flex-col gap-3 p-3 pt-0 pb-0">
                {fetchMarkets.data?.markets.map((market: Market) => (
                  <MarketRow
                    market={market}
                    key={market.address}
                    ownerMode={isEqlStr(market.creator, address)}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <Paginator
                className="border-t rounded-b-3xl"
                curPage={offset}
                total={fetchMarkets.data?.meta?.queryCount}
                limit={limit}
                onNext={() => setOffset(offset + limit)}
                onPrev={() => setOffset(offset - limit)}
              />
            </div>
          </div>
        )}

      {!fetchMarkets.isLoading && fetchMarkets.data?.markets?.length == 0 && (
        <div className="flex items-center justify-center font-light text-gray-400 h-[300px]">
          No market found
        </div>
      )}
    </TabsContent>
  );
}
