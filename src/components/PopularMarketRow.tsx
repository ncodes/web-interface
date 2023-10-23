import { approxNumber, formatToMoney } from "../libs/helpers.ts";
import { PairAvatar } from "./avatar/PairAvatar.tsx";
import { PriceChange } from "./market/PriceChange.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { ScrollAreaHorizontal } from "./ui/scroll-area.tsx";

export function PopularMarketRow(props: { market: Market }) {
  return (
    <div className="flex gap-x-4 items-center px-3 py-2 cursor-pointer hover:opacity-80 text-[14px]">
      <PairAvatar
        base="BTC"
        quote="UNI"
        baseSrc="/images/icons/asset-icons/btc.svg"
        quoteSrc="/images/icons/asset-icons/uni.svg"
      />
      <div className="flex items-center min-w-[30px] ">
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
