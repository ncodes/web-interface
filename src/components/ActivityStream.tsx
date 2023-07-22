import { PairAvatar } from "./avatar/PairAvatar.tsx";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { ScrollAreaHorizontal } from "./ui/scroll-area.tsx";

function PopularMarketRow(props: {
  base: string;
  quote: string;
  liq: string;
  price: string;
  vol: string;
}) {
  return (
    <div className="flex gap-x-4 px-3 py-2 cursor-pointer hover:opacity-80 text-[14px]">
      <PairAvatar
        base="BTC"
        quote="UNI"
        baseSrc="/images/icons/asset-icons/btc.svg"
        quoteSrc="/images/icons/asset-icons/uni.svg"
      />
      <div className="flex items-center w-[70px]">
        <div className="flex flex-col font-normal tracking-wider text-gray-200 text-[13px]">
          <span>{props.base}</span>
          <span>{props.quote}</span>
        </div>
      </div>
      <ScrollAreaHorizontal className="flex-1">
        <div className="flex-1 flex gap-2 text-right justify-end">
          <Card className="w-[80px] xxs:w-[100px] text-right shrink-0 border border-card-border bg-card-background shadow-gray-900  shadow-lg">
            <CardHeader className="px-3 py-2 pb-0">
              <CardTitle className="text-xs tracking-wide font-light text-gray-400 flex justify-end gap-2">
                <span>Price</span>
                <span className="text-green-400 hidden xxs:inline">(+10%)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 py-0 pb-2 tracking-wide text-chinese-green">
              $1,234
            </CardContent>
          </Card>
          <Card className="hidden md:inline w-[83px] shrink-0 text-right border border-card-border bg-card-background shadow-gray-900  shadow-lg">
            <CardHeader className="px-3 py-2 pb-0">
              <CardTitle className="text-xs tracking-wider font-light text-gray-400">
                <span>24hr Vol.</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white px-3 py-0 pb-2 tracking-wide">
              $23m
            </CardContent>
          </Card>
        </div>
      </ScrollAreaHorizontal>
    </div>
  );
}

function RecentTradeRow(props: {
  base: string;
  quote: string;
  time: string;
  price: string;
  qty: string;
}) {
  return (
    <div className="flex gap-x-4 py-2 cursor-pointer hover:opacity-80 text-[14px] px-3">
      <PairAvatar
        base="BTC"
        quote="UNI"
        baseSrc="/images/icons/asset-icons/btc.svg"
        quoteSrc="/images/icons/asset-icons/uni.svg"
      />
      <div className="flex items-center">
        <div className="flex flex-col font-normal tracking-wider text-gray-200 text-[13px]">
          <span>{props.base}</span>
          <span>{props.quote}</span>
        </div>
      </div>
      <ScrollAreaHorizontal className="flex-1">
        <div className="flex-1 flex gap-2 text-right justify-end">
          <Card className="w-[80px] xxs:w-[100px] text-right shrink-0 border border-card-border bg-card-background shadow-gray-900  shadow-lg">
            <CardHeader className="px-3 py-2 pb-0">
              <CardTitle className="text-xs tracking-wide font-light text-gray-400 flex justify-end gap-2">
                <span>Price</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 py-0 pb-2 tracking-wide text-chinese-green">
              $1,234
            </CardContent>
          </Card>
          <Card className="hidden md:inline w-[83px] shrink-0 text-right border border-card-border bg-card-background shadow-gray-900  shadow-lg">
            <CardHeader className="px-3 py-2 pb-0">
              <CardTitle className="text-xs tracking-wider font-light text-gray-400">
                <span>Qty.</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white px-3 py-0 pb-2 tracking-wide">
              3,400
            </CardContent>
          </Card>
        </div>
      </ScrollAreaHorizontal>
    </div>
  );
}

export function ActivityStream() {
  return (
    <div className="flex flex-col justify-between mt-5 xl:mt-2">
      <div className="border-b flex-1 border-gray-900">
        <h1 className="text-lg md:text-xl mb-3">Top Markets</h1>
        <div className="divide-y bg-card-background border border-gray-800 rounded-2xl divide-gray-800 ">
          <PopularMarketRow
            base="BTC"
            quote="UNI"
            liq="$3.5m"
            price="$12.5k"
            vol="$22.4m"
          />
          <PopularMarketRow
            base="BTC"
            quote="UNI"
            liq="$3.5m"
            price="$12.5k"
            vol="$22.4m"
          />
          <PopularMarketRow
            base="BTC"
            quote="UNI"
            liq="$3.5m"
            price="$12.5k"
            vol="$22.4m"
          />
          <PopularMarketRow
            base="BTC"
            quote="UNI"
            liq="$3.5m"
            price="$12.5k"
            vol="$22.4m"
          />
          <PopularMarketRow
            base="BTC"
            quote="UNI"
            liq="$3.5m"
            price="$12.5k"
            vol="$22.4m"
          />
        </div>

        <div className="flex-1 pb-4 border-gray-800 mt-5">
          <h1 className="text-lg md:text-xl mb-3">Recent Swaps</h1>
          <div className="divide-y bg-card-background border border-gray-800 rounded-2xl divide-gray-800 ">
            <RecentTradeRow
              base="BTC"
              quote="UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              base="BTC"
              quote="UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              base="BTC"
              quote="UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              base="BTC"
              quote="UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              base="BTC"
              quote="UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
