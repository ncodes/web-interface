import { SwapOfferCreatorContent } from "../components/swap/SwapOfferCreatorContent.tsx";
import { Label } from "../components/ui/label.tsx";

export function CreateOfferWrapper({ liquidity }: { liquidity?: Liquidity }) {
  return (
    <div className="flex flex-col pt-3">
      <Label className="text-xl">Create Offer</Label>
      <div className="border border-gray-700 bg-card-background rounded-xl mt-3 overflow-hidden">
        <SwapOfferCreatorContent
          liquidity={liquidity as Liquidity}
          market={liquidity?.market as Market}
          inBody
        />
      </div>
    </div>
  );
}
