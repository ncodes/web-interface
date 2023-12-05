import { approxNumber, formatToHighDenom } from "../libs/helpers.ts";
import { ToolTip } from "./ToolTip.tsx";
import { PairAvatar } from "./avatar/PairAvatar.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { ScrollAreaHorizontal } from "./ui/scroll-area.tsx";

export function RecentTradeRow(props: { swap: Swap }) {
  return (
    <div className="flex gap-x-4 py-2 cursor-pointer items-center hover:opacity-80 text-[14px] px-3">
      <PairAvatar
        base="BTC"
        quote="UNI"
        baseSrc={props.swap.market.baseLogo}
        quoteSrc={props.swap.market.quoteLogo}
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
                ${approxNumber(props.swap.priceUsd)}
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
                ${approxNumber(props.swap.amountUsd)}
              </ToolTip>
            </CardContent>
          </Card>
        </div>
      </ScrollAreaHorizontal>
    </div>
  );
}
