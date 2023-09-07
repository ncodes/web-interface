import { useState } from "react";
import { SearchInput } from "./SearchInput.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { SearchBoxItem } from "./SearchBoxItem.tsx";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import { useQuery } from "@tanstack/react-query";
import { useMarketService } from "../../hooks/services/backend/useMarketService.ts";
import { ActivityStreamRowSkeleton } from "../ActivityStreamRowSkeleton.tsx";

export function SearchContent({ renderInput }: { renderInput?: boolean }) {
  const [focus, setFocus] = useState(false);
  const { getChainInfo } = useConnectorContext();
  const { getTopMarkets } = useMarketService();
  const markets = useQuery({
    queryKey: [
      "getTopMarkets",
      { network: getChainInfo().queryName, limit: 5 },
    ],
    queryFn: getTopMarkets,
  });

  return (
    <>
      {renderInput && (
        <div className="flex lg:hidden p-2 border-b border-gray-800 ">
          <SearchInput
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            focus={focus}
            autoFocus={true}
          />
        </div>
      )}
      <ScrollGradientIndicator side="bottom">
        <ScrollArea className="pb-[40px] md:pb-0 md:h-[400px]" type="scroll">
          <div className="flex justify-between items-center p-3 py-3 pb-1 ">
            <span className="font-medium text-gray-100 tracking-wider text-sm rounded-full">
              Recent Search
            </span>
            <span className="font-light text-xs text-gray-300 tracking-wider">
              12 Results
            </span>
          </div>
          <div className="divide-y divide-gray-900">
            <SearchBoxItem
              market={{
                base: "BASE",
                quote: "QUO",
                priceChange: 10,
                volume24h: "1200",
                lowestPriceUsd: "120",
              }}
            />
            <SearchBoxItem
              market={{
                base: "UXA",
                quote: "XAP",
                priceChange: 10,
                volume24h: "1200",
                lowestPriceUsd: "120",
              }}
            />
          </div>
          <>
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
              <div className="flex items-center gap-2 text-gray-500 justify-center font-light  h-[100px]">
                Not enough data
              </div>
            )}
          </>
        </ScrollArea>
      </ScrollGradientIndicator>
    </>
  );
}
