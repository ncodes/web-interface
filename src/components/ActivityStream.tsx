import { useQuery } from "@tanstack/react-query";
import { ErrorIcon } from "react-hot-toast";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import { useMarketService } from "../hooks/services/backend/useMarketService.ts";
import { useSwapService } from "../hooks/services/backend/useSwapService.ts";
import { RequestError } from "../libs/RequestError.ts";
import { ActivityStreamRowPlaceholder } from "./ActivityStreamRowPlaceholder.tsx";
import { ActivityStreamRowSkeleton } from "./ActivityStreamRowSkeleton.tsx";
import { PopularMarketRow } from "./PopularMarketRow.tsx";
import { RecentTradeRow } from "./RecentTradeRow.tsx";

export function ActivityStream() {
  const { getChainInfo } = useConnectorContext();
  const { getTopMarkets } = useMarketService();
  const { listSwaps } = useSwapService();
  const limit = 5;
  const markets = useQuery({
    queryKey: ["getTopMarkets", { network: getChainInfo().queryName, limit }],
    queryFn: getTopMarkets,
  });

  const swaps = useQuery({
    queryKey: ["getRecentSwaps", { network: getChainInfo().queryName, limit }],
    queryFn: listSwaps,
  });

  return (
    <div className="flex flex-col justify-between pt-5 xl:pt-5">
      <div className="border-b flex-1 border-gray-900">
        <h1 className="text-lg md:text-xl mb-3">Top Markets</h1>
        <div className="divide-y bg-card-background border border-gray-800 rounded-2xl divide-gray-800 ">
          {markets.isLoading && markets.fetchStatus != "idle" && (
            <ActivityStreamRowSkeleton />
          )}

          {markets.isError && (
            <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[100px]">
              <ErrorIcon className="w-[20px]" />{" "}
              {(markets.error as RequestError)?.message}
            </div>
          )}

          {markets.isSuccess && markets.data.length > 0 && (
            <>
              {markets.data.map((market) => {
                return (
                  <PopularMarketRow market={market} key={market.address} />
                );
              })}
              {Array.from(Array(limit - markets.data.length).keys()).map(
                (i) => (
                  <ActivityStreamRowPlaceholder
                    key={i}
                    className="hidden xl:flex"
                  />
                )
              )}
            </>
          )}

          {markets.isSuccess && markets.data.length == 0 && (
            <div className="flex items-center gap-2 text-gray-500 justify-center font-light  h-[100px]">
              Not enough data
            </div>
          )}
        </div>

        <div className="flex-1 pb-4 border-gray-800 mt-5">
          <h1 className="text-lg md:text-xl mb-3">Recent Swaps</h1>
          <div className="divide-y bg-card-background border border-gray-800 rounded-2xl divide-gray-800 ">
            {swaps.isLoading && swaps.fetchStatus != "idle" && (
              <ActivityStreamRowSkeleton />
            )}

            {swaps.isError && (
              <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[100px]">
                <ErrorIcon className="w-[20px]" />{" "}
                {(swaps.error as RequestError)?.message}
              </div>
            )}

            {swaps.isSuccess && swaps.data.swaps.length > 0 && (
              <>
                {swaps.data.swaps.map((swap) => {
                  return (
                    <RecentTradeRow
                      swap={swap}
                      key={`${swap.provider}:${swap.taker}:${swap.createdAt}`}
                    />
                  );
                })}
                {Array.from(Array(limit - swaps.data.swaps.length).keys()).map(
                  (i) => (
                    <ActivityStreamRowPlaceholder
                      key={i}
                      className="hidden xl:flex"
                    />
                  )
                )}
              </>
            )}

            {swaps.isSuccess && swaps.data.swaps.length == 0 && (
              <div className="flex items-center gap-2 text-gray-500 justify-center font-light  h-[100px]">
                Not enough data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
