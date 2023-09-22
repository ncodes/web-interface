import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import Layout from "./Layout.tsx";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import ScrollOverflowIndicator from "../components/ScrollOverflowIndicator.tsx";
import { Footer } from "../components/Footer.tsx";
import { Label } from "../components/ui/label.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Dispatch, SetStateAction, useState } from "react";
import useStore from "../hooks/store/useStore.ts";
import {
  CreateOfferContent,
  CreateOfferSheet,
} from "../components/liquidity/CreateOfferSheet.tsx";
import IconOffer from "../components/icons/IconOffer.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import { LiquidityTabContent } from "../components/liquidity/LiquidityTabContent.tsx";
import { OffersTabContent } from "../components/liquidity/OffersTabContent.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useOfferService } from "../hooks/services/backend/useOfferService.ts";
import { useQuery } from "@tanstack/react-query";
import { useConnectorContext } from "../hooks/connectors/context.tsx";
import { SwapSheetContent } from "../components/swap/SwapSheetContent.tsx";

function LiquidityPage({
  defaultTab,
  onTabChanged,
  setLiquidity,
}: {
  defaultTab?: string;
  onTabChanged?: (tab: string) => void;
  setLiquidity?: Dispatch<SetStateAction<Liquidity | undefined>>;
}) {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(defaultTab || "liquidity");
  const toggleOpenState = useStore((state) => state.toggleOpenState);
  const { market, provider, lid } = useParams();
  const { address, getChainInfo } = useConnectorContext();
  const { countUnread } = useOfferService();
  const unreadOfferCount = useQuery({
    queryKey: [
      "countUnreadOffer",
      {
        network: getChainInfo().queryName,
        marketAddress: market,
        provider: provider,
        lid: parseInt(lid || "0"),
      },
    ],
    queryFn: countUnread,
    enabled: !!address,
  });

  return (
    <Tabs
      defaultValue={defaultTab || "liquidity"}
      className="w-full h-full transition-all duration-500"
      onValueChange={(value) => {
        setCurrentTab(value);
        onTabChanged && onTabChanged(value);
      }}
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollOverflowIndicator className="[&::before]:rounded-tr-none w-full">
          <ScrollAreaHorizontal type="scroll" className="w-full">
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="liquidity"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate(`/liquidity/${market}/${provider}/${lid}`);
                }}
              >
                Liquidity
              </TabsTrigger>
              <TabsTrigger
                value="offers"
                className="font-light gap-1 relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate(`/liquidity/${market}/${provider}/${lid}/offers`);
                }}
              >
                <span>Offers</span>
                {unreadOfferCount.data &&
                  unreadOfferCount.data.asOfferer +
                    unreadOfferCount.data.asProvider >
                    0 && (
                    <div className="rounded-full h-[20px] min-w-[20px] px-[5px] leading-[20px] flex justify-center items-center  bg-red-600 text-[10px]">
                      {unreadOfferCount.data.asOfferer +
                        unreadOfferCount.data.asProvider}
                    </div>
                  )}
              </TabsTrigger>
            </div>
          </ScrollAreaHorizontal>
        </ScrollOverflowIndicator>
        <div className="hidden md:inline xl:hidden">
          <Button
            size="sm"
            className="w-[150px] gap-2 items-center"
            onClick={() => {
              toggleOpenState && toggleOpenState("createOfferSheet");
            }}
          >
            <IconOffer width="20px" /> Create Offer
          </Button>
        </div>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="md:hidden justify-center flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green">
                <DotsVerticalIcon />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
              <DropdownMenuItem
                className="gap-1"
                onClick={() => {
                  toggleOpenState && toggleOpenState("createOfferSheet");
                }}
              >
                <IconOffer width="20px" /> Create Offer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TabsList>
      {currentTab == "liquidity" && (
        <LiquidityTabContent setLiquidity={setLiquidity} />
      )}
      {currentTab == "offers" && <OffersTabContent />}
      <CreateOfferSheet />
    </Tabs>
  );
}

function SwapSheetWrapper({ liquidity }: { liquidity: Liquidity | undefined }) {
  return (
    <div className="flex flex-col pt-3">
      <Label className="text-xl">Swap</Label>
      <div className="border border-gray-700 bg-card-background rounded-xl mt-3 overflow-hidden">
        {!!liquidity && (
          <SwapSheetContent
            liquidity={liquidity}
            market={liquidity.market}
            offSheet={true}
          />
        )}
      </div>
    </div>
  );
}

function CreateOfferWrapper() {
  return (
    <div className="flex flex-col pt-3">
      <Label className="text-xl">Create Offer</Label>
      <div className="border border-gray-700 bg-card-background rounded-xl mt-3 overflow-hidden">
        <CreateOfferContent outOfSheet={true} />
      </div>
    </div>
  );
}

export default function Liquidity({ defaultTab }: { defaultTab?: string }) {
  const [currentTab, setCurrentTab] = useState(defaultTab || "liquidity");
  const [liquidity, setLiquidity] = useState<Liquidity | undefined>();

  return (
    <Layout
      body={
        <LiquidityPage
          defaultTab={currentTab}
          setLiquidity={setLiquidity}
          onTabChanged={(val) => {
            setCurrentTab(val);
          }}
        />
      }
      rightSide={
        <div className="flex w-full h-full justify-between flex-col pt-2">
          {(currentTab == "liquidity" || !currentTab) && (
            <SwapSheetWrapper liquidity={liquidity} />
          )}
          {currentTab == "offers" && <CreateOfferWrapper />}
          <div className="relative">
            <div className="text-gray-200 bottom-0 w-full">
              <Footer />
            </div>
          </div>
        </div>
      }
    />
  );
}
