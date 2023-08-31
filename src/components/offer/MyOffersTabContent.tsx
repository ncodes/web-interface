import { TabsContent } from "../ui/Tabs.tsx";
import { Paginator } from "../Paginator.tsx";
import useConnector from "../../hooks/connectors/useConnector.tsx";
import useStore from "../../hooks/store/useStore.ts";
import { useEffect, useState } from "react";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { ErrorIcon } from "react-hot-toast";
import { PlugZapIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RequestError } from "../../libs/RequestError.ts";
import { OfferRow } from "../liquidity/OfferRow.tsx";
import { useOfferService } from "../../hooks/services/backend/useOfferService.ts";

export function MyOffersTabContent() {
  const { getChainInfo, address } = useConnector();
  const { listOffers } = useOfferService();
  const offerFilter = useStore((state) => state.offerFilter);
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(1);
  const { markAsRead } = useOfferService();
  const queryClient = useQueryClient();
  const offers = useQuery({
    queryKey: [
      "getOffersAsParticipant",
      {
        network: getChainInfo().queryName,
        limit,
        offset,
        connectedAddress: address,
        offerFilter,
      },
    ],
    queryFn: listOffers,
    enabled: !!address,
  });

  useQuery({
    queryKey: ["markAsRead", { network: getChainInfo().queryName }],
    queryFn: markAsRead,
    enabled: !!address,
    onSuccess: async () => {
      await queryClient.refetchQueries(["countUnreadOffer"]);
    },
  });

  useEffect(() => {
    if (
      (offers.fetchStatus != "idle" && offers.isLoading) ||
      offers.isRefetching
    )
      setLoaderProgress && setLoaderProgress(50);
    else setLoaderProgress && setLoaderProgress(100);
  }, [
    offers.isError,
    offers.isLoading,
    offers.isRefetching,
    offers.isRefetchError,
    offers.fetchStatus,
  ]);

  return (
    <TabsContent value="offers" className="p-0 m-0 flex flex-col gap-3">
      {offers.isLoading && offers.fetchStatus != "idle" && <RowSkeleton />}

      {offers.isError && (
        <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]">
          <ErrorIcon className="w-[20px]" />{" "}
          {(offers.error as RequestError)?.message}
        </div>
      )}

      {!address && (
        <div className="flex select-none items-center gap-2 text-chinese-green justify-center font-light  h-[300px]">
          <PlugZapIcon className="w-[20px]" /> Connect your wallet
        </div>
      )}

      {!offers.isLoading && offers.isSuccess && (
        <>
          <Paginator
            curPage={offset}
            total={offers.data?.meta?.queryCount}
            limit={limit}
            onNext={() => setOffset(offset + 1)}
            onPrev={() => setOffset(offset - 1)}
          />
          <div className="flex flex-col gap-3 p-3 pt-0">
            {offers.data?.offers.map((offer: Offer) => (
              <OfferRow offer={offer} />
            ))}
          </div>
          <Paginator
            className="border-t"
            curPage={offset}
            total={offers.data?.meta?.queryCount}
            limit={limit}
            onNext={() => setOffset(offset + 1)}
            onPrev={() => setOffset(offset - 1)}
          />
        </>
      )}

      {!offers.isLoading && offers.data?.offers?.length == 0 && (
        <div className="flex items-center justify-center font-light text-gray-400 h-[300px]">
          No offer found
        </div>
      )}
    </TabsContent>
  );
}
