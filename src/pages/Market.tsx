import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AlertOctagonIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { ErrorIcon } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Footer } from "../components/Footer.tsx";
import { Paginator } from "../components/Paginator.tsx";
import { RowSkeleton } from "../components/RowSkeleton.tsx";
import ScrollOverflowIndicator from "../components/ScrollOverflowIndicator.tsx";
import IconFilterOutline from "../components/icons/IconFilterOutline.tsx";
import { IconPlus } from "../components/icons/IconPlus.tsx";
import { LiquidityFilter } from "../components/liquidity/LiquidityFilter.tsx";
import { LiquidityFilterSheet } from "../components/liquidity/LiquidityFilterSheet.tsx";
import { LiquidityRow } from "../components/liquidity/LiquidityRow.tsx";
import { ManageLiquiditySheet } from "../components/liquidity/ManageLiquiditySheet.tsx";
import { MarketRow } from "../components/market/MarketRow.tsx";
import { Button } from "../components/ui/Button.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs.tsx";
import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import { useLiquidityService } from "../hooks/services/backend/useLiquidityService.ts";
import { useMarketService } from "../hooks/services/backend/useMarketService.ts";
import useStore from "../hooks/store/useStore.ts";
import useMounted from "../hooks/useMounted.ts";
import { RequestError } from "../libs/RequestError.ts";
import { getPaginationInfo } from "../libs/api_utils.ts";
import { isEqlStr } from "../libs/helpers.ts";
import { cn } from "../libs/utils.ts";
import Layout from "./Layout.tsx";

function MarketTabs() {
  const [openFilterSheet, setOpenFilterSheet] = useState(false);
  const [openAddLiquiditySheet, setOpenAddLiquiditySheet] = useState(false);
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const liquidityFilter = useStore((state) => state.liquidityFilter);
  const { getChainInfo, address } = useConnectorContext();
  const { getMarket } = useMarketService();
  const { listLiquidities } = useLiquidityService();
  // const { getPoint } = useMiscService();
  const { id } = useParams();
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const mounted = useMounted(1000);
  const isVirtualWallet = useStore((state) => state.isVirtualWallet);
  const restricted = useStore((state) => state.restricted);

  const market = useQuery({
    queryKey: [
      "getMarket",
      { network: getChainInfo().queryName, market: id as string },
    ],
    queryFn: getMarket,
    enabled: mounted && !!id,
  });

  const liquidities = useQuery({
    queryKey: [
      "getLiquidities",
      {
        network: getChainInfo().queryName,
        limit,
        offset,
        liquidityFilter: {
          ...liquidityFilter,
          market: id as string,
          paused: false,
        },
      },
    ],
    queryFn: listLiquidities,
    placeholderData: keepPreviousData,
    enabled: market.data != undefined,
    refetchInterval: 10000,
  });

  // const liqPointQuery = useQuery({
  //   queryKey: ["getPoint", { name: `liq:${market.data?.address}` }],
  //   queryFn: getPoint,
  //   enabled: market.data != undefined,
  // });
  //
  // const swapPointQuery = useQuery({
  //   queryKey: ["getPoint", { name: `swap:${market.data?.address}` }],
  //   queryFn: getPoint,
  //   enabled: market.data != undefined,
  // });

  useEffect(() => {
    if (market.isLoading || market.isRefetching)
      setLoaderProgress && setLoaderProgress(50);
    else setLoaderProgress && setLoaderProgress(100);
  }, [
    market.isError,
    market.isLoading,
    setLoaderProgress,
    market.isRefetching,
    market.isRefetchError,
  ]);

  return (
    <Tabs
      defaultValue="markets"
      className="flex flex-col flex-1 w-full transition-all duration-500"
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollAreaHorizontal type="scroll" className="w-full">
          <ScrollOverflowIndicator>
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="markets"
                className="font-light relative top-2  font-jersey25 text-[18px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Market
              </TabsTrigger>
            </div>
          </ScrollOverflowIndicator>
        </ScrollAreaHorizontal>
        <div
          className={cn("flex shrink-0 pr-2 gap-2 items-center justify-end", {
            hidden: isEqlStr(
              market.data?.address,
              "0xEc2b7C1C114c5e74176E53c27156BCf6f09efF97",
            ),
          })}
        >
          {!restricted && !isVirtualWallet && (
            <Button
              size="sm"
              className="hidden gap-1 items-center transition-all duration-500 hover:scale-x-105"
              onClick={() => {
                setOpenAddLiquiditySheet(true);
              }}
            >
              <IconPlus />
              <span>Add Liquidity</span>
            </Button>
          )}
        </div>
      </TabsList>

      {!!market.data &&
        ![
          "0xEc2b7C1C114c5e74176E53c27156BCf6f09efF97".toLowerCase(),
          "0x42Bb5450bf6b9754D40e928a2733DcF412021749".toLowerCase(),
          "0xC98b5eB14B155E97A1F820a90a176942334678E0".toLowerCase(),
        ].includes(market.data?.address.toLowerCase()) && (
          <span className="w-full h-[30px] animate-pulse bg-chinese-green hover:animate-none font-silkscreen flex items-center text-sm justify-center text-gray-900 gap-2">
            <AlertOctagonIcon className="w-[15px] text-red-500 h-[15px]" />
            <span>ALERT!! This is not the Official DexDrop market.</span>
          </span>
        )}

      {/* Tab Content */}
      <TabsContent
        value="markets"
        className="relative p-3 px-0 mt-0 pt-0 pb-0 gap-3 flex flex-col flex-1"
      >
        {market.data && (
          <Helmet>
            <title>{`${market?.data?.base} - ${market?.data?.quote} Market - Joint`}</title>
          </Helmet>
        )}
        {/* MARKET INFO */}
        {market.isLoading && <RowSkeleton />}
        {market.isError && (
          <div className="flex items-center gap-2 text-red-300 justify-center font-light h-[300px]">
            <ErrorIcon className="w-[20px]" />{" "}
            {(market.error as RequestError)?.message}
          </div>
        )}
        {!market.isLoading && market.isSuccess && (
          <MarketRow
            market={market.data}
            className="rounded-none border-b-gray-800 border-x-0 border-t-0"
            ownerMode={
              !market.data.renounced && isEqlStr(market.data?.creator, address)
            }
            noFocus
          />
        )}
        {/* LIQUIDITIES */}
        <div
          className={cn("flex items-center justify-between", {
            hidden: !market.data,
          })}
        >
          <h1 className="p-5 py-3 pb-0 text-xl">Liquidities</h1>
          {!liquidities?.isLoading &&
            liquidities.data?.liquidities &&
            liquidities.data?.liquidities?.length > 0 && (
              <div className="md:hidden">
                <Button
                  variant="link"
                  className="gap-2"
                  rounded="none"
                  onClick={() => {
                    setOpenFilterSheet(true);
                  }}
                >
                  <span>
                    <IconFilterOutline width="15px" />
                  </span>
                  <span>Filter</span>
                </Button>
              </div>
            )}
        </div>
        <div className="flex flex-col flex-1">
          {liquidities.isLoading && !market.isLoading && !market.isError && (
            <RowSkeleton />
          )}

          {liquidities.isError && (
            <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]">
              <ErrorIcon className="w-[20px]" />{" "}
              {(liquidities.error as RequestError)?.message}
            </div>
          )}

          {!liquidities.isLoading &&
            liquidities.data?.liquidities?.length == 0 && (
              <div className="flex items-center justify-center font-light text-gray-400 h-[300px]">
                No liquidity found
              </div>
            )}

          {!liquidities.isLoading &&
            liquidities.isSuccess &&
            !market.isLoading &&
            !market.isError && (
              <div className="flex flex-col flex-1 gap-3">
                <div className="flex flex-1 flex-col gap-3">
                  <Paginator
                    curPage={
                      getPaginationInfo(liquidities.data, limit, offset)
                        .currentPage
                    }
                    total={
                      getPaginationInfo(liquidities.data, limit, offset)
                        .totalResults
                    }
                    limit={limit}
                    onNext={() => setOffset(offset + limit)}
                    onPrev={() => setOffset(offset - limit)}
                  />
                  <div className="flex gap-2 flex-col z-[6] px-3">
                    {liquidities.data?.liquidities.map((liquidity) => (
                      <LiquidityRow
                        liquidity={liquidity}
                        key={`${liquidity.provider}:${liquidity.lid}`}
                        ownerMode={isEqlStr(liquidity.provider, address)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <Paginator
                    className="border-t rounded-b-3xl"
                    curPage={
                      getPaginationInfo(liquidities.data, limit, offset)
                        .currentPage
                    }
                    total={
                      getPaginationInfo(liquidities.data, limit, offset)
                        .totalResults
                    }
                    limit={limit}
                    onNext={() => setOffset(offset + limit)}
                    onPrev={() => setOffset(offset - limit)}
                  />
                </div>
              </div>
            )}
        </div>
      </TabsContent>

      <LiquidityFilterSheet
        active={openFilterSheet}
        onOpen={(open) => {
          setOpenFilterSheet(open);
        }}
      />

      {market.data && (
        <ManageLiquiditySheet
          market={market.data}
          open={openAddLiquiditySheet}
          onOpenChange={(open) => {
            setOpenAddLiquiditySheet(open);
          }}
        />
      )}
    </Tabs>
  );
}

export default function Market() {
  return (
    <Layout
      title="Market - Joint"
      body={<MarketTabs />}
      bodyContainerClassName="min-h-[97%] xl:min-h-full flex flex-col"
      rightSide={
        <div className="flex w-full h-full justify-between flex-col pt-3">
          <LiquidityFilter />
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
