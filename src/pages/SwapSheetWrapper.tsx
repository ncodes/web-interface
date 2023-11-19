import { SwapOfferCreatorContent } from "../components/swap/SwapOfferCreatorContent.tsx";
import { Label } from "../components/ui/label.tsx";

export function SwapSheetWrapper({
  liquidity,
}: {
  liquidity: Liquidity | undefined;
}) {
  return (
    <div className="flex flex-col pt-3">
      <Label className="text-xl">Swap</Label>
      <div className="border border-gray-700 bg-card-background rounded-xl mt-3 overflow-hidden">
        {!!liquidity && (
          <SwapOfferCreatorContent
            liquidity={liquidity}
            market={liquidity.market}
            inBody={true}
          />
        )}
      </div>
    </div>
  );
}
