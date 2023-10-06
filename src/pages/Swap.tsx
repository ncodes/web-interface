import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import Layout from "./Layout.tsx";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import ScrollOverflowIndicator from "../components/ScrollOverflowIndicator.tsx";
import { Messenger } from "../components/messenger/Messenger.tsx";
import { SwapPageTabContent } from "../components/swap/SwapPageTabContent.tsx";
import { Footer } from "../components/Footer.tsx";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import { isSwapParticipant } from "../libs/api_utils.ts";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

function SwapPage({ onSwapFetched }: { onSwapFetched?: (swap: Swap) => void }) {
  return (
    <Tabs
      defaultValue="my-swaps"
      className="w-full h-full transition-all duration-500"
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollOverflowIndicator className="[&::before]:rounded-tr-none w-full">
          <ScrollAreaHorizontal type="scroll" className="w-full">
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="my-swaps"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Swap
              </TabsTrigger>
            </div>
          </ScrollAreaHorizontal>
        </ScrollOverflowIndicator>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="md:hidden justify-center flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green">
                <DotsVerticalIcon />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0"></DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TabsList>
      <SwapPageTabContent
        onSwapFetched={(swap) => {
          onSwapFetched && onSwapFetched(swap);
        }}
      />
    </Tabs>
  );
}

export default function Swap() {
  const { address } = useConnectorContext();
  const [swap, setSwap] = useState<Swap | null>(null);
  const isXl = useMediaQuery("(min-width: 1280px)");

  const messenger =
    swap && isSwapParticipant(swap, address) ? (
      <div className="flex w-full h-full justify-between flex-col pt-2">
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
