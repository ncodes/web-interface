import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useInterval } from "usehooks-ts";
import useStore from "../../hooks/store/useStore.ts";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { canExecuteOffer as canExecOffer } from "../../libs/api_utils.ts";
import { cn } from "../../libs/utils.ts";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet.tsx";
import { SwapOfferCreatorContent } from "./SwapOfferCreatorContent.tsx";

export function SwapOfferCreatorSheet({
  liquidity,
  offer,
}: {
  liquidity: Liquidity;
  offer?: Offer;
}) {
  const [, sheetSide, styles] = useSheetInfo();
  const openState = useStore((state) => state.openState);
  const openStateContext = useStore((state) => state.openStateContext);
  const toggleOpenState = useStore((state) => state.toggleOpenState);
  const [reveal, setReveal] = useState(false);

  useInterval(
    () => {
      setReveal(true);
    },
    !reveal ? 2000 : null
  );

  function canExecuteOffer(offer: Offer | undefined) {
    if (openStateContext.createOfferSheet === "edit") return false;
    return canExecOffer(offer);
  }

  function isEditMode() {
    return openStateContext.createOfferSheet === "edit";
  }

  return (
    <Sheet
      open={openState.createOfferSheet}
      onOpenChange={(open) => {
        if (!open) setReveal(false);
        toggleOpenState && toggleOpenState("createOfferSheet");
      }}
    >
      <SheetContent
        className={cn(
          styles,
          "w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0"
        )}
        side={sheetSide}
      >
        {!reveal && (
          <div className="absolute flex justify-center items-center z-10 w-full h-full bg-card-background rounded-xl">
            <IconSpinner
              width="20"
              fill="fill-gray-600"
              className="animate-spin"
            />
          </div>
        )}
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
              {!offer && "Create Offer"}
              {offer && canExecuteOffer(offer) && "Execute Offer"}
              {offer && isEditMode() && "Update Offer"}
            </SheetTitle>
          </div>
        </SheetHeader>

        {liquidity && (
          <SwapOfferCreatorContent
            liquidity={liquidity as Liquidity}
            market={liquidity.market as Market}
            offer={offer}
            offerMode
          />
        )}
        <div
          className="absolute cursor-pointer text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            toggleOpenState && toggleOpenState("createOfferSheet");
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
