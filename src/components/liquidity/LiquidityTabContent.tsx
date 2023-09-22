import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TabsContent } from "../ui/Tabs.tsx";
import { LiquidityEventLog } from "./LiquidityEventLog.tsx";
import { RecentReviews } from "./RecentReviews.tsx";
import { SwapSheet } from "../swap/SwapSheet.tsx";
import { useQuery } from "@tanstack/react-query";
import { useLiquidityService } from "../../hooks/services/backend/useLiquidityService.ts";
import { useParams } from "react-router-dom";
import useStore from "../../hooks/store/useStore.ts";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { ErrorIcon } from "react-hot-toast";
import { RequestError } from "../../libs/RequestError.ts";
import { LiquidityRow } from "./LiquidityRow.tsx";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import { isEqlStr } from "../../libs/helpers.ts";

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
      <div>
        {liquidity.isLoading && <RowSkeleton />}

        {liquidity.isError && (
          <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]">
            <ErrorIcon className="w-[20px]" />{" "}
            {(liquidity.error as RequestError)?.message}
          </div>
        )}

        {!liquidity.isLoading && liquidity.isSuccess && (
          <>
            <LiquidityRow
              liquidity={liquidity.data}
              noFocus={true}
              ownerMode={isEqlStr(liquidity.data.provider, address)}
              className="rounded-none border-x-0 border-t-0"
            />

            <div className="flex flex-col gap-5 lg:gap-0 lg:flex-row pt-5 px-3">
              <LiquidityEventLog liquidity={liquidity.data as Liquidity} />
              <RecentReviews />
            </div>
          </>
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
