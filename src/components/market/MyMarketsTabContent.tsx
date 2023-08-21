import { TabsContent } from "../ui/Tabs.tsx";
import { Paginator } from "../Paginator.tsx";
import { MarketRow } from "./MarketRow.tsx";
import { useQuery } from "@tanstack/react-query";
import useConnector from "../../hooks/connectors/useConnector.tsx";
import { useMarketService } from "../../hooks/services/backend/useMarketService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { ErrorIcon } from "react-hot-toast";
import { useEffect, useState } from "react";
import { PlugZapIcon } from "lucide-react";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { RequestError } from "../../libs/RequestError.ts";

export function MyMarketsTabContent() {
  const { getChainInfo, address } = useConnector();
  const { listMarkets } = useMarketService();
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const marketFilter = useStore((state) => state.marketFilter);
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
    enabled: !!address,
  });

  useEffect(() => {
    setOffset(0);
  }, [marketFilter]);

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
    <TabsContent value="my-markets" className="p-0 m-0 flex flex-col gap-3">
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
