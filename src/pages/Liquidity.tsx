import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { AlertOctagonIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "../components/Footer.tsx";
import ScrollOverflowIndicator from "../components/ScrollOverflowIndicator.tsx";
import IconOffer from "../components/icons/IconOffer.tsx";
import { LiquidityTabContent } from "../components/liquidity/LiquidityTabContent.tsx";
import { OffersTabContent } from "../components/liquidity/OffersTabContent.tsx";
import { SwapOfferCreatorSheet } from "../components/swap/SwapOfferCreatorSheet.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import { useOfferService } from "../hooks/services/backend/useOfferService.ts";
import useStore from "../hooks/store/useStore.ts";
import useMounted from "../hooks/useMounted.ts";
import { isEqlStr } from "../libs/helpers.ts";
import { CreateOfferWrapper } from "./CreateOfferWrapper.tsx";
import Layout from "./Layout.tsx";
import { SwapSheetWrapper } from "./SwapSheetWrapper.tsx";

function LiquidityPage({
  defaultTab,
  onTabChanged,
  setLiquidity,
  liquidity,
}: {
  defaultTab?: string;
  onTabChanged?: (tab: string) => void;
  setLiquidity?: Dispatch<SetStateAction<Liquidity | undefined>>;
  liquidity?: Liquidity;
}) {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(defaultTab || "liquidity");
  const toggleOpenState = useStore((state) => state.toggleOpenState);
  const { market, provider, lid } = useParams();
  const { address, getChainInfo } = useConnectorContext();
  const user = useStore((state) => state.user);
  const { countUnread } = useOfferService();
  // const { getPoint } = useMiscService();
  const mounted = useMounted(1000);
  const isVirtualWallet = useStore((state) => state.isVirtualWallet);
  const restricted = useStore((state) => state.restricted);

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
    enabled: mounted && !!address && !!user,
  });

  // const swapPointQuery = useQuery({
  //   queryKey: ["getPoint", { name: `swap:${liquidity?.market?.address}` }],
  //   queryFn: getPoint,
  //   enabled: liquidity?.market != undefined,
  // });

  return (
    <Tabs
      defaultValue={defaultTab || "liquidity"}
      className="flex flex-col flex-1 w-full h-full transition-all duration-500"
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
                className="font-light relative top-2  font-jersey25 text-[18px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate(`/liquidity/${market}/${provider}/${lid}`);
                }}
              >
                Liquidity
              </TabsTrigger>
              <TabsTrigger
                value="offers"
                className="font-light gap-1 relative top-2  font-jersey25 text-[18px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
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
          {!restricted && !isVirtualWallet && (
            <Button
              size="sm"
              className="w-[150px] gap-2 items-center"
              onClick={() => {
                toggleOpenState && toggleOpenState("createOfferSheet");
              }}
            >
              <IconOffer width="20px" /> Create Offer
            </Button>
          )}
        </div>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="md:hidden justify-center flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green">
                <DotsVerticalIcon />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
              {!restricted && (
                <DropdownMenuItem
                  disabled={isVirtualWallet}
                  className="gap-1"
                  onClick={() => {
                    toggleOpenState && toggleOpenState("createOfferSheet");
                  }}
                >
                  <IconOffer width="20px" /> Create Offer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TabsList>

      {!isEqlStr(
        liquidity?.market?.address,
        "0xEc2b7C1C114c5e74176E53c27156BCf6f09efF97",
      ) && (
        <span className="w-full h-[30px] animate-pulse bg-chinese-green hover:animate-none font-silkscreen flex items-center text-sm justify-center text-gray-900 gap-2">
          <AlertOctagonIcon className="w-[15px] text-red-500 h-[15px]" />
          <span>ALERT!! This is not the Official DexDrop liquidity.</span>
        </span>
      )}

      {currentTab == "liquidity" && (
        <>
          {/*{swapPointQuery.data && (*/}
          {/*  <div className="flex flex-col md:flex-row m-3 gap-2 mb-1 animate-pulse hover:animate-none">*/}
          {/*    <div className="p-3 rounded-xl border border-gray-700 border-dashed py-2 flex gap-2 tracking-wider font-jersey10 text-lg lg:text-xl items-center">*/}
          {/*      <span className="relative top-0.5">🎁</span>*/}
          {/*      <span>*/}
          {/*        Swap to earn{" "}*/}
          {/*        <b className="text-yellow-300">*/}
          {/*          {formatToMoney(swapPointQuery?.data)}*/}
          {/*        </b>{" "}*/}
          {/*        points / {liquidity?.market?.base}*/}
          {/*      </span>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*)}*/}
          <LiquidityTabContent setLiquidity={setLiquidity} />
        </>
      )}
      {currentTab == "offers" && (
        <OffersTabContent setLiquidity={setLiquidity} />
      )}
      <SwapOfferCreatorSheet liquidity={liquidity as Liquidity} />
    </Tabs>
  );
}

export default function Liquidity({ defaultTab }: { defaultTab?: string }) {
  const [currentTab, setCurrentTab] = useState(defaultTab || "liquidity");
  const [liquidity, setLiquidity] = useState<Liquidity>();
  const { address } = useConnectorContext();

  return (
    <Layout
      title="Liquidity - Joint"
      bodyContainerClassName="min-h-[97%] xl:min-h-full flex flex-col"
      body={
        <LiquidityPage
          defaultTab={currentTab}
          setLiquidity={setLiquidity}
          liquidity={liquidity}
          onTabChanged={(val) => {
            setCurrentTab(val);
          }}
        />
      }
      rightSide={
        address ? (
          <div className="flex w-full h-full justify-between flex-col pt-3">
            {(currentTab == "liquidity" || !currentTab) && liquidity && (
              <SwapSheetWrapper liquidity={liquidity} />
            )}
            {currentTab == "offers" && liquidity && (
              <CreateOfferWrapper liquidity={liquidity} />
            )}
            <div className="relative">
              <div className="text-gray-200 bottom-0 w-full">
                <Footer />
              </div>
            </div>
          </div>
        ) : null
      }
    />
  );
}
