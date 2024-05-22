import { AlertOctagon } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "usehooks-ts";
import { Alert } from "../components/Alert.tsx";
import { Footer } from "../components/Footer.tsx";
import ScrollOverflowIndicator from "../components/ScrollOverflowIndicator.tsx";
import { Messenger } from "../components/messenger/Messenger.tsx";
import { MessengerSheet } from "../components/messenger/MessengerSheet.tsx";
import { ChatButton } from "../components/swap/ChatButton.tsx";
import { SwapPageTabContent } from "../components/swap/SwapPageTabContent.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import { isSwapParticipant } from "../libs/api_utils.ts";
import Layout from "./Layout.tsx";

function SwapPage({ onSwapFetched }: { onSwapFetched?: (swap: Swap) => void }) {
  const [swap, setSwap] = useState<Swap | undefined>();
  const { address } = useConnectorContext();
  return (
    <Tabs
      defaultValue="my-swaps"
      className="w-full h-full transition-all duration-500"
    >
      <Helmet>
        <title>{`Swap #${swap?.orderId} - Joint`}</title>
      </Helmet>
      <Alert
        icon={<AlertOctagon className="text-red-400" />}
        className="m-3 font-bold tracking-wider w-auto text-red-300 bg-card-background border-card-border"
      >
        THIS IS A TESTNET VERSION OF JOINT PROTOCOL. DO NOT USE OR SEND REAL
        FUNDS.
      </Alert>
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollOverflowIndicator className="[&::before]:rounded-tr-none w-full">
          <ScrollAreaHorizontal type="scroll" className="w-full">
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="my-swaps"
                className="font-light relative top-2  font-jersey25 text-[18px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Swap
              </TabsTrigger>
            </div>
          </ScrollAreaHorizontal>
        </ScrollOverflowIndicator>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end xl:invisible">
          {swap && <ChatButton address={address} swap={swap as Swap} />}
        </div>
      </TabsList>
      <SwapPageTabContent
        onSwapFetched={(swap) => {
          onSwapFetched && onSwapFetched(swap);
          setSwap(swap);
        }}
      />
      <MessengerSheet swap={swap} />
    </Tabs>
  );
}

export default function Swap() {
  const { address } = useConnectorContext();
  const [swap, setSwap] = useState<Swap | null>(null);
  const isXl = useMediaQuery("(min-width: 1280px)");

  const messenger =
    swap && isSwapParticipant(swap, address) ? (
      <div className="flex w-full h-full justify-between flex-col pt-3">
        {isXl && <Messenger sheetMode={false} swap={swap} />}
        <div className="relative">
          <div className="text-gray-200 bottom-0 w-full">
            <Footer />
          </div>
        </div>
      </div>
    ) : null;

  return (
    <Layout
      bodyContainerClassName="lg:min-h-full"
      title="Swap #0"
      body={
        <div className="flex flex-col">
          <SwapPage
            onSwapFetched={(swap) => {
              setSwap(swap);
            }}
          />
        </div>
      }
      rightSide={messenger}
    />
  );
}
