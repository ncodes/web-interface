import { useQuery } from "@tanstack/react-query";
import { PlugZapIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorIcon } from "react-hot-toast";
import { useMarketService } from "../../hooks/services/backend/useMarketService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { RequestError } from "../../libs/RequestError.ts";
import { isEqlStr } from "../../libs/helpers.ts";
import { Paginator } from "../Paginator.tsx";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import { MarketRow } from "./MarketRow.tsx";

import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useMounted from "../../hooks/useMounted.ts";

export function MyMarketsTabContent() {
  const { getChainInfo, address } = useConnectorContext();
  const { listMarkets } = useMarketService();
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const loaderProgress = useStore((state) => state.loaderProgress);
  const marketFilter = useStore((state) => state.marketFilter);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const mounted = useMounted(1000);

  const fetchMarkets = useQuery({
    queryKey: [
      "getMarketsByCreator",
      {
        network: getChainInfo().queryName,
        marketFilter,
        limit,
        offset,
        connectedAddress: address,
      },
    ],
    queryFn: listMarkets,
    keepPreviousData: true,
    enabled: mounted && !!address,
  });

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
    <TabsContent value="my-markets" className="p-0 m-0 flex flex-col gap-3">
      {fetchMarkets.isLoading && fetchMarkets.fetchStatus != "idle" && (
        <RowSkeleton />
      )}

      {fetchMarkets.isError && (
        <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]">
          <ErrorIcon className="w-[20px]" />{" "}
          {(fetchMarkets.error as RequestError)?.message}
        </div>
      )}

      {!address && (
        <div className="flex select-none items-center gap-2 text-chinese-green justify-center font-light  h-[300px]">
          <PlugZapIcon className="w-[20px]" /> Connect your wallet
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
              <div className="flex flex-col gap-3 p-3 pt-0">
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
                className="border-t mb-0 rounded-b-3xl"
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
