import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Helmet from "react-helmet";
import { ErrorIcon } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useLiquidityService } from "../../hooks/services/backend/useLiquidityService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { RequestError } from "../../libs/RequestError.ts";
import { isEqlStr, shortenAddress } from "../../libs/helpers.ts";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { SwapSheet } from "../swap/SwapSheet.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import { LiquidityEventLog } from "./LiquidityEventLog.tsx";
import { LiquidityProviderReviewViewer } from "./LiquidityProviderReviewViewer.tsx";
import { LiquidityRow } from "./LiquidityRow.tsx";

export function LiquidityTabContent({
  setLiquidity,
}: {
  setLiquidity?: Dispatch<SetStateAction<Liquidity | undefined>>;
}) {
  const [openSwapSheet, setOpenSwapSheet] = useState(false);
  const { getChainInfo, address } = useConnectorContext();
  const { getLiquidity } = useLiquidityService();
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const { market, provider, lid } = useParams();

  const liquidity = useQuery({
    queryKey: [
      "getLiquidity",
      {
        network: getChainInfo().queryName,
        market: market as string,
        provider: provider as string,
        lid: parseInt(lid as string),
      },
    ],
    queryFn: getLiquidity,
    enabled: !!market && !!provider && !!lid,
  });

  useEffect(() => {
    if (liquidity.isLoading || liquidity.isRefetching)
      setLoaderProgress && setLoaderProgress(50);
    else setLoaderProgress && setLoaderProgress(100);
    if (liquidity.isSuccess && setLiquidity) setLiquidity(liquidity.data);
  }, [
    liquidity.isError,
    liquidity.isLoading,
    setLoaderProgress,
    liquidity.isRefetching,
    liquidity.isRefetchError,
  ]);

  return (
    <TabsContent
      value="liquidity"
      className="p-3 pt-0 mt-0 px-0 flex flex-col gap-3"
    >
      {liquidity.data && (
        <Helmet>
          <title>
            Liquidity -{" "}
            {`${liquidity.data.market.base}/${liquidity.data.market.quote} `} -{" "}
            {shortenAddress(liquidity.data.provider)} - Joint
          </title>
        </Helmet>
      )}

      <div>
        {liquidity.isLoading && (
          <RowSkeleton className="h-[300px] xl:h-[610px]" />
        )}

        {liquidity.isError && (
          <div className="flex items-center gap-2 text-red-300 justify-center font-light h-[300px] xl:h-[610px]">
            <ErrorIcon className="w-[20px]" />{" "}
            {(liquidity.error as RequestError)?.message}
          </div>
        )}

        {!liquidity.isLoading && liquidity.isSuccess && (
          <div className="min-h-[300px] xl:min-h-[610px]">
            <LiquidityRow
              liquidity={liquidity.data}
              noFocus={true}
              ownerMode={isEqlStr(liquidity.data.provider, address)}
              className="rounded-none border-b-gray-800 border-x-0 border-t-0"
            />

            <div className="flex flex-col gap-5 lg:gap-0 lg:flex-row pt-5 px-3">
              <LiquidityEventLog liquidity={liquidity.data as Liquidity} />
              <LiquidityProviderReviewViewer
                liquidity={liquidity.data as Liquidity}
              />
            </div>
          </div>
        )}
      </div>

      {!!liquidity.data && (
        <SwapSheet
          liquidity={liquidity.data as Liquidity}
          market={liquidity.data.market as Market}
          open={openSwapSheet}
          onOpenChange={(open) => {
            setOpenSwapSheet(open);
          }}
        />
      )}
    </TabsContent>
  );
}
