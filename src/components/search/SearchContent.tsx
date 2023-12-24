import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTimeout } from "usehooks-ts";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useMarketService } from "../../hooks/services/backend/useMarketService.ts";
import useSearchHistory from "../../hooks/useSearchHistory.ts";
import { ActivityStreamRowSkeleton } from "../ActivityStreamRowSkeleton.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { SearchBoxItem } from "./SearchBoxItem.tsx";
import { SearchInput } from "./SearchInput.tsx";

export function SearchContent({
  queryResult,
  queryLoading,
  renderInput,
  onQueryChange,
}: {
  queryResult: Market[] | undefined;
  queryLoading: boolean;
  renderInput?: boolean;
  onQueryChange?: (value: string) => void;
}) {
  const [focus, setFocus] = useState(false);
  const { getChainInfo } = useConnectorContext();
  const { get: getHistory } = useSearchHistory(getChainInfo().queryName);
  const { getTopMarkets, listMarkets } = useMarketService();
  const [reveal, setReveal] = useState(false);

  useTimeout(() => {
    setReveal(true);
  }, 1000);

  const markets = useQuery({
    queryKey: [
      "getTopMarkets",
      { network: getChainInfo().queryName, limit: 5 },
    ],
    queryFn: getTopMarkets,
  });

  const history = getHistory();
  const marketHistoryFiltered = history.filter((h) => h.type == "market");
  const marketHistory = useQuery({
    queryKey: [
      "getMarkets",
      {
        network: getChainInfo().queryName,
        marketFilter: {
          address: marketHistoryFiltered
            .slice(0, 3)
            .map((h) => h.marketAddress)
            .join(","),
        },
      },
    ],
    queryFn: listMarkets,
  });

  return (
    <>
      {renderInput && (
        <div className="flex lg:hidden p-2 border-b border-gray-800">
          <SearchInput
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            focus={focus}
            autoFocus={true}
            className="!rounded-lg"
            onValue={(value) => {
              onQueryChange && onQueryChange(value);
            }}
          />
        </div>
      )}

      <ScrollOverflowIndicator side="bottom" className="h-full">
        <ScrollArea
          viewportClassName="absolute xl:relative"
          className="h-full relative"
          type="scroll"
        >
          {!queryResult && (
            <div>
              <div>
                {!!marketHistory?.data?.markets.length && (
                  <div className="flex justify-between items-center p-3 py-3 pb-1 ">
                    <span className="font-medium text-gray-100 tracking-wider text-sm rounded-full">
                      Recent Search
                    </span>
                    {marketHistory && !!marketHistory?.data?.markets.length && (
                      <span className="font-light text-xs text-gray-300 tracking-wider">
                        {marketHistory.data.markets.length} Result
                        {marketHistory.data.markets.length > 1 && "s"}
                      </span>
                    )}
                  </div>
                )}

                <div className="divide-y divide-gray-900">
                  {marketHistory.isLoading &&
                    marketHistory.fetchStatus != "idle" && (
                      <ActivityStreamRowSkeleton />
                    )}

                  {marketHistory.isSuccess &&
                    !marketHistory.isLoading &&
                    marketHistory.data.markets.length > 0 && (
                      <div className="divide-y divide-gray-900 [&>div:last-child]:rounded-b-2xl">
                        {marketHistory.data.markets.map((market) => (
                          <SearchBoxItem market={market} key={market.address} />
                        ))}
                      </div>
                    )}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center p-3 py-3 ">
                  <span className="font-medium text-gray-100 tracking-wider text-sm rounded-full">
                    Top Markets
                  </span>
                  <span className="font-light text-xs text-gray-300 tracking-wider">
                    {markets.data?.length} Result
                    {(markets.data || []).length > 1 && "s"}
                  </span>
                </div>

                {markets.isLoading && markets.fetchStatus != "idle" && (
                  <ActivityStreamRowSkeleton />
                )}

                {markets.isSuccess && markets.data.length > 0 && (
                  <div className="divide-y divide-gray-900 [&>div:last-child]:rounded-b-2xl">
                    {markets.data.map((market) => (
                      <SearchBoxItem market={market} key={market.address} />
                    ))}
                  </div>
                )}

                {markets.isSuccess && markets.data.length == 0 && (
                  <div className="flex items-center gap-2 text-gray-500 justify-center font-lightxw h-[100px]">
                    Not enough data
                  </div>
                )}
              </div>
            </div>
          )}

          {!queryLoading && queryResult && queryResult.length > 0 && (
            <div className="divide-y divide-gray-900 [&>div:last-child]:rounded-b-2xl">
              {queryResult.map((market) => (
                <SearchBoxItem market={market} key={market.address} />
              ))}
            </div>
          )}

          {!queryLoading && queryResult && queryResult.length == 0 && (
            <div className="flex justify-center items-center h-full">
              <span className="text-gray-500 text-sm font-light">
                No result found
              </span>
            </div>
          )}

          {queryLoading && (
            <div className="flex justify-center items-center h-full">
              <IconSpinner
                width="30px"
                fill="fill-gray-600"
                className="animate-spin"
              />
            </div>
          )}

          {!reveal && (
            <div className="xl:fixed w-full z-10 top-0 flex bg-background justify-center items-center h-full">
              <IconSpinner
                width="30px"
                fill="fill-gray-600"
                className="animate-spin"
              />
            </div>
          )}
        </ScrollArea>
      </ScrollOverflowIndicator>
    </>
  );
}
