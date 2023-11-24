import { Dispatch, SetStateAction, useState } from "react";
import { Footer } from "../components/Footer.tsx";
import ScrollOverflowIndicator from "../components/ScrollOverflowIndicator.tsx";
import { Messenger } from "../components/messenger/Messenger.tsx";
import { OfferTabContent } from "../components/offer/OfferTabContent.tsx";
import { ChatButton } from "../components/swap/ChatButton.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import { isEqlStr } from "../libs/helpers.ts";
import Layout from "./Layout.tsx";

function Page({
  setOffer: extSetOffer,
}: {
  setOffer: Dispatch<SetStateAction<Offer | undefined>>;
}) {
  const [offer, setOffer] = useState<Offer | undefined>();
  const { address } = useConnectorContext();

  return (
    <Tabs
      defaultValue="offers"
      className="w-full h-full flex flex-1 flex-col transition-all duration-500"
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollOverflowIndicator className="[&::before]:rounded-tr-none w-full">
          <ScrollAreaHorizontal type="scroll" className="w-full">
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="offers"
                className="font-light gap-1 relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Offer
              </TabsTrigger>
            </div>
          </ScrollAreaHorizontal>
        </ScrollOverflowIndicator>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end xl:hidden">
          {offer && <ChatButton address={address} offer={offer} />}
        </div>
      </TabsList>
      <OfferTabContent
        setOffer={(offer) => {
          setOffer(offer);
          extSetOffer(offer);
        }}
      />
    </Tabs>
  );
}

export default function Offer() {
  const { connected, address } = useConnectorContext();
  const [offer, setOffer] = useState<Offer | undefined>();

  const rightSide =
    connected &&
    (isEqlStr(address, offer?.creator) ||
      isEqlStr(address, offer?.provider)) ? (
      <div className="flex w-full h-full justify-between flex-col pt-3">
        <Messenger sheetMode={false} offer={offer} />
        <div className="relative">
          <div className="text-gray-200 bottom-0 w-full">
            <Footer />
          </div>
        </div>
      </div>
    ) : null;

  return (
    <Layout
      title="Offer - Joint"
      bodyContainerClassName="min-h-[96%] xl:min-h-full"
      body={<Page setOffer={setOffer} />}
      rightSide={rightSide}
    />
  );
}
