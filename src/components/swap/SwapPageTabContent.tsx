import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import useStore from "../../hooks/store/useStore.ts";
import { useParams } from "react-router-dom";
import { useSwapService } from "../../hooks/services/backend/useSwapService.ts";
import { useQuery } from "@tanstack/react-query";
import { TabsContent } from "../ui/Tabs.tsx";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { ErrorIcon } from "react-hot-toast";
import { RequestError } from "../../libs/RequestError.ts";
import { SwapRow } from "./SwapRow.tsx";
import { SwapProgress } from "./SwapProgress.tsx";
import { SwapInformation } from "./SwapInformation.tsx";
import { MessengerSheet } from "../messenger/MessengerSheet.tsx";
import { isSwapParticipant } from "../../libs/api_utils.ts";
import { SwapDisputes } from "./SwapDisputes.tsx";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";

export function SwapPageTabContent() {
  const [openMessengerSheet, setOpenMessengerSheet] = useState(false);
  const isLg = useMediaQuery("(min-width: 1024px)");
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const { getChainInfo, address } = useConnectorContext();
  const { orderId } = useParams<{ orderId: string }>();
  const fullLoadCount = useStore((state) => state.fullLoadCount);
  const { getSwap } = useSwapService();
  const swap = useQuery({
    queryKey: [
      "getSwap",
      { network: getChainInfo().queryName, orderId: orderId as string },
    ],
    queryFn: getSwap,
    enabled: !!orderId,
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (fullLoadCount > 0) return; // no need to show loader if data is already cached
    if (swap.isLoading || swap.isRefetching)
      setLoaderProgress && setLoaderProgress(50);
    else setLoaderProgress && setLoaderProgress(100);
  }, [
    swap.isError,
    swap.isLoading,
    setLoaderProgress,
    swap.isRefetching,
    swap.isRefetchError,
  ]);

  return (
    <TabsContent
      value="my-swaps"
      className="p-3 pt-0 flex flex-col gap-3 px-0 mt-0 h-full"
    >
      {swap.isLoading && <RowSkeleton />}

      {swap.isError && (
        <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]">
          <ErrorIcon className="w-[20px]" />{" "}
          {(swap.error as RequestError)?.message}
        </div>
      )}

      {!swap.isLoading && swap.isSuccess && (
        <SwapRow
          swap={swap.data}
          className="rounded-none border-x-0 border-t-0"
          noFocus
        />
      )}

      {swap.isSuccess &&
        swap.data &&
        address &&
        isSwapParticipant(swap.data, address) && (
          <>
            {swap.data?.disputes.length > 0 && (
              <SwapDisputes swap={swap.data} />
            )}

            <div className="flex flex-col md:gap-5 md:flex-row px-3">
              <SwapProgress
                swap={swap.data}
                onRequestOpenChat={() => {
                  if (isLg) return;
                  setOpenMessengerSheet(true);
                }}
              />
              <SwapInformation swap={swap.data} />
            </div>
          </>
        )}

      <MessengerSheet
        open={openMessengerSheet}
        onOpenChange={(open) => {
          setOpenMessengerSheet(open);
        }}
      />
    </TabsContent>
  );
}
