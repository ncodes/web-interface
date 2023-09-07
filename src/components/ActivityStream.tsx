import { PairAvatar } from "./avatar/PairAvatar.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { ScrollAreaHorizontal } from "./ui/scroll-area.tsx";
import { useConnectorContext } from "../hooks/connectors/context.tsx";
import { useMarketService } from "../hooks/services/backend/useMarketService.ts";
import { useQuery } from "@tanstack/react-query";
import { ErrorIcon } from "react-hot-toast";
import { RequestError } from "../libs/RequestError.ts";
import {
  approxNumber,
  formatToHighDenom,
  formatToMoney,
} from "../libs/helpers.ts";
import { PriceChange } from "./market/PriceChange.tsx";
import { ActivityStreamRowSkeleton } from "./ActivityStreamRowSkeleton.tsx";
import { ActivityStreamRowPlaceholder } from "./ActivityStreamRowPlaceholder.tsx";
import { useSwapService } from "../hooks/services/backend/useSwapService.ts";
import { ToolTip } from "./ToolTip.tsx";

function PopularMarketRow(props: { market: Market }) {
  return (
    <div className="flex gap-x-4 items-center px-3 py-2 cursor-pointer hover:opacity-80 text-[14px]">
      <PairAvatar
        base="BTC"
        quote="UNI"
        baseSrc="/images/icons/asset-icons/btc.svg"
        quoteSrc="/images/icons/asset-icons/uni.svg"
      />
      <div className="flex items-center w-[70px]">
        <div className="flex flex-col font-normal tracking-wider text-gray-200 text-[13px]">
          <span>{props.market.base}</span>
          <span>{props.market.quote}</span>
        </div>
      </div>
      <ScrollAreaHorizontal className="flex-1">
        <div className="flex-1 flex gap-2 text-right justify-end">
          <Card className="w-[80px] xxs:w-[110px] text-right shrink-0 border border-card-border bg-card-background shadow-gray-900  shadow-lg">
            <CardHeader className="px-3 py-2 pb-0">
              <CardTitle className="text-xs tracking-wide font-light text-gray-400 flex justify-end gap-2">
                <span>Price</span>
                <span className="text-green-400 hidden xxs:inline">
                  <PriceChange priceChange={props.market.priceChange} />
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 py-0 pb-2 tracking-wide text-chinese-green">
              ${formatToMoney(props.market.lowestPriceUsd)}
            </CardContent>
          </Card>
          <Card className="hidden md:inline w-[100px] shrink-0 text-right border border-card-border bg-card-background shadow-gray-900  shadow-lg">
            <CardHeader className="px-3 py-2 pb-0">
              <CardTitle className="text-xs tracking-wider font-light text-gray-400">
                <span>24hr Vol.</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white px-3 py-0 pb-2 tracking-wide">
              ${approxNumber(props.market.volume24h)}
            </CardContent>
          </Card>
        </div>
      </ScrollAreaHorizontal>
    </div>
  );
}

function RecentTradeRow(props: { swap: Swap }) {
  return (
    <div className="flex gap-x-4 py-2 cursor-pointer items-center hover:opacity-80 text-[14px] px-3">
      <PairAvatar
        base="BTC"
        quote="UNI"
        baseSrc="/images/icons/asset-icons/btc.svg"
        quoteSrc="/images/icons/asset-icons/uni.svg"
      />
      <div className="flex items-center">
        <div className="flex flex-col font-normal tracking-wider text-gray-200 text-[13px]">
          <span>{props.swap.base}</span>
          <span>{props.swap.quote}</span>
        </div>
      </div>
      <ScrollAreaHorizontal className="flex-1">
        <div className="flex-1 flex gap-2 text-right justify-end">
          <Card className="w-[80px] xxs:w-[110px] text-right shrink-0 border border-card-border bg-card-background shadow-gray-900  shadow-lg">
            <CardHeader className="px-3 py-2 pb-0">
              <CardTitle className="text-xs tracking-wide font-light text-gray-400 flex justify-end gap-2">
                <span>Price</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 py-0 pb-2 tracking-wide text-chinese-green">
              <ToolTip
                tip={`${formatToHighDenom(
                  props.swap.price,
                  props.swap.market.quoteDecimals
                )} ${props.swap.market.quote}`}
              >
                ${formatToMoney(props.swap.priceUsd)}
              </ToolTip>
            </CardContent>
          </Card>
          <Card className="hidden md:inline w-[100px] shrink-0 text-right border border-card-border bg-card-background shadow-gray-900  shadow-lg">
            <CardHeader className="px-3 py-2 pb-0">
              <CardTitle className="text-xs tracking-wider font-light text-gray-400">
                <span>Qty.</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white px-3 py-0 pb-2 tracking-wide">
              <ToolTip
                tip={`${formatToHighDenom(
                  props.swap.amount,
                  props.swap.market.baseDecimals
                )} ${props.swap.market.base}`}
              >
                ${formatToMoney(props.swap.amountUsd)}
              </ToolTip>
            </CardContent>
          </Card>
        </div>
      </ScrollAreaHorizontal>
    </div>
  );
}

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
                  return <RecentTradeRow swap={swap} />;
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
