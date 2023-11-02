import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ErrorIcon } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import { useSwapService } from "../../hooks/services/backend/useSwapService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { RequestError } from "../../libs/RequestError.ts";
import { isSwapParticipant } from "../../libs/api_utils.ts";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import { SwapDisputes } from "./SwapDisputes.tsx";
import { SwapInformation } from "./SwapInformation.tsx";
import { SwapProgress } from "./SwapProgress.tsx";
import { SwapRow } from "./SwapRow.tsx";

import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useOfferService } from "../../hooks/services/backend/useOfferService.ts";

export function SwapPageTabContent({
  onSwapFetched,
}: {
  onSwapFetched?: (swap: Swap) => void;
}) {
  const [openMessengerSheet, setOpenMessengerSheet] = useState(false);
  const isXl = useMediaQuery("(min-width: 1280px)");
  const { markAsRead } = useOfferService();
  const queryClient = useQueryClient();
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const { getChainInfo, address } = useConnectorContext();
  const { orderId } = useParams<{ orderId: string }>();
  const user = useStore((state) => state.user);
  const fullLoadCount = useStore((state) => state.fullLoadCount);
  const { getSwap } = useSwapService();

  // Fetch swap
  const swap = useQuery({
    queryKey: [
      "getSwap",
      { network: getChainInfo().queryName, orderId: orderId as string },
    ],
    queryFn: getSwap,
    enabled: !!orderId,
    refetchInterval: 10000,
  });

  // Handle loader progress
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

  // Call the onSwapFetched callback when the swap is fetched
  useEffect(() => {
    if (!swap.data) return;
    onSwapFetched && onSwapFetched(swap.data);
  }, [swap.data]);

  // Mark the offer as read when the swap originated from an offer
  useQuery({
    queryKey: [
      "markAsRead",
      { network: getChainInfo().queryName, offerId: swap.data?.offerId },
    ],
    queryFn: markAsRead,
    enabled: !!user && swap.data?.offerId !== undefined,
    refetchInterval: false,
    onSuccess: async () => {
      await queryClient.refetchQueries(["countUnreadOffer"]);
    },
  });

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
              <SwapProgress swap={swap.data} />
              <SwapInformation swap={swap.data} />
            </div>
          </>
        )}

      {/* <MessengerSheet swap={swap.data as Swap} /> */}
    </TabsContent>
  );
}
