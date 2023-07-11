import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs.tsx";
import { PairAvatar } from "./PairAvatar.tsx";
import moment from "moment";

function PopularMarketRow(props: {
  pair: string;
  liq: string;
  price: string;
  vol: string;
}) {
  return (
    <div className="flex gap-x-4 mb-4 pt-4 cursor-pointer hover:opacity-80 text-[14px]">
      <PairAvatar
        baseSrc="/images/icons/asset-icons/btc.svg"
        quoteSrc="/images/icons/asset-icons/uni.svg"
      />
      <div>
        <div className="font-medium tracking-wider text-gray-200 text-[14px]">
          {props.pair}
        </div>
        <div className="text-gray-400 font-light tracking-wide">
          Liq: <span className="text-gray-300 font-normal">{props.liq}</span>
        </div>
      </div>
      <div className="flex-1 text-right">
        <div className="text-gray-400 font-light tracking-wide">
          Price:{" "}
          <span className="text-chinese-green font-normal">{props.price}</span>
        </div>
        <div className="text-gray-400 font-light tracking-wide">
          Vol: <span className="text-gray-300 font-normal">{props.vol}</span>
        </div>
      </div>
    </div>
  );
}

function RecentTradeRow(props: {
  pair: string;
  time: string;
  price: string;
  qty: string;
}) {
  return (
    <div className="flex gap-x-4 mb-4 pt-4 cursor-pointer hover:opacity-80 text-[14px]">
      <PairAvatar
        baseSrc="/images/icons/asset-icons/btc.svg"
        quoteSrc="/images/icons/asset-icons/uni.svg"
      />
      <div>
        <div className="font-medium tracking-wider text-gray-200 text-[14px]">
          {props.pair}
        </div>
        <div className="text-gray-400 font-light tracking-wide">
          {moment(props.time).fromNow()}
        </div>
      </div>
      <div className="flex-1 text-right">
        <div className="text-gray-400 font-light tracking-wide">
          Price:{" "}
          <span className="text-chinese-green font-normal">{props.price}</span>
        </div>
        <div className="text-gray-400 font-light tracking-wide">
          Qty: <span className="text-gray-300 font-normal">{props.qty}</span>
        </div>
      </div>
    </div>
  );
}

export function RightSidebarStream() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="border-b flex-1 pb-4 border-gray-800">
        <Tabs defaultValue="popular-market" className="w-full h-full">
          <TabsList>
            <TabsTrigger value="popular-market">Popular Markets</TabsTrigger>
            <TabsTrigger value="recent-trades" className="text-right">
              Recent Trades
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="popular-market"
            className="space-y-4 divide-y h-full divide-gray-800"
          >
            <PopularMarketRow
              pair="BTC - UNI"
              liq="$3.5m"
              price="$12.5k"
              vol="$22.4m"
            />
            <PopularMarketRow
              pair="BTC - UNI"
              liq="$4.32m"
              price="$320"
              vol="$12.2m"
            />
            <PopularMarketRow
              pair="BTC - UNI"
              liq="$4.32m"
              price="$320"
              vol="$12.2m"
            />
            <PopularMarketRow
              pair="BTC - UNI"
              liq="$4.32m"
              price="$320"
              vol="$12.2m"
            />
            <PopularMarketRow
              pair="BTC - UNI"
              liq="$4.32m"
              price="$320"
              vol="$12.2m"
            />{" "}
            <PopularMarketRow
              pair="BTC - UNI"
              liq="$4.32m"
              price="$320"
              vol="$12.2m"
            />{" "}
            <PopularMarketRow
              pair="BTC - UNI"
              liq="$4.32m"
              price="$320"
              vol="$12.2m"
            />
            <PopularMarketRow
              pair="BTC - UNI"
              liq="$4.32m"
              price="$320"
              vol="$12.2m"
            />
            <PopularMarketRow
              pair="BTC - UNI"
              liq="$4.32m"
              price="$320"
              vol="$12.2m"
            />
          </TabsContent>

          <TabsContent value="recent-trades">
            <RecentTradeRow
              pair="BTC - UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              pair="BTC - UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              pair="BTC - UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              pair="BTC - UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              pair="BTC - UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              pair="BTC - UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              pair="BTC - UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              pair="BTC - UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              pair="BTC - UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
            <RecentTradeRow
              pair="BTC - UNI"
              time={moment().subtract(1, "hour").toISOString()}
              price="$320"
              qty="4,354"
            />
          </TabsContent>
        </Tabs>
      </div>

      <footer className="flex py-10 px-4 flex-col gap-2 ">
        <div className="font-light text-xs text-gray-400 hover:[&>a]:text-gray-100 transition-all">
          <a href="#">Terms of Service</a> - <a href="#">Privacy Policy</a> -{" "}
          <a href="#">Protocol Disclaimer</a>
        </div>
        <div className="font-light text-xs text-gray-400 hover:[&>a]:text-gray-100 transition-all">
          &copy; 2023 Joint Labs
        </div>
      </footer>
    </div>
  );
}
