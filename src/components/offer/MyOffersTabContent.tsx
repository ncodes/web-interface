import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ErrorIcon } from "react-hot-toast";
import { useOfferService } from "../../hooks/services/backend/useOfferService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { RequestError } from "../../libs/RequestError.ts";
import { Paginator } from "../Paginator.tsx";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { OfferRow } from "../liquidity/OfferRow.tsx";
import { TabsContent } from "../ui/Tabs.tsx";

import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useMounted from "../../hooks/useMounted.ts";
import { MainContainerConnectButton } from "../MainContainerConnectButton.tsx";

export function MyOffersTabContent() {
  const { getChainInfo, address } = useConnectorContext();
  const { listOffers } = useOfferService();
  const offerFilter = useStore((state) => state.offerFilter);
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const loaderProgress = useStore((state) => state.loaderProgress);
  const [offset, setOffset] = useState(0);
  const user = useStore((state) => state.user);
  const [limit] = useState(10);
  const { markAsRead } = useOfferService();
  const mounted = useMounted(1000);
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
    keepPreviousData: true,
    enabled: mounted && !!address,
  });

  useQuery({
    queryKey: ["markAsRead", { network: getChainInfo().queryName }],
    queryFn: markAsRead,
    enabled: mounted && !!address && !!user,
    onSuccess: async () => {
      await queryClient.refetchQueries(["countUnreadOffer"]);
    },
  });

  useEffect(() => {
    const { isLoading, isRefetching } = offers;
    if (isLoading) setLoaderProgress && setLoaderProgress(50);
    if (!(isRefetching || isLoading) && loaderProgress == 50)
      setLoaderProgress?.(100);
  }, [
    offers.isError,
    offers.isLoading,
    offers.isRefetching,
    offers.isRefetchError,
    offers.fetchStatus,
  ]);

  return (
    <TabsContent value="offers" className="p-0 m-0 flex flex-col flex-1 gap-3">
      {address && offers.isLoading && (
        <RowSkeleton className="h-[300px] xl:h-[610px]" />
      )}

      {offers.isError && (
        <div className="flex items-center gap-2 text-red-300 justify-center font-light h-[300px] xl:h-[610px]">
          <ErrorIcon className="w-[20px]" />{" "}
          {(offers.error as RequestError)?.message}
        </div>
      )}

      {!address && <MainContainerConnectButton />}

      {!offers.isLoading && offers.isSuccess && !!offers.data.offers.length && (
        <div className="flex flex-col flex-1 gap-3 min-h-[300px] xl:min-h-[610px]">
          <div className="flex flex-col flex-1 gap-3">
            <Paginator
              curPage={offset}
              total={offers.data?.meta?.queryCount}
              limit={limit}
              onNext={() => setOffset(offset + limit)}
              onPrev={() => setOffset(offset - limit)}
            />
            <div className="flex flex-col gap-3 p-3 pt-0">
              {offers.data?.offers.map((offer: Offer) => (
                <OfferRow
                  offer={offer}
                  key={`${offer.network}:${offer.offerId}`}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <Paginator
              className="border-t rounded-b-3xl"
              curPage={offset}
              total={offers.data?.meta?.queryCount}
              limit={limit}
              onNext={() => setOffset(offset + limit)}
              onPrev={() => setOffset(offset - limit)}
            />
          </div>
        </div>
      )}

      {!offers.isLoading && offers.data?.offers?.length == 0 && (
        <div className="flex items-center justify-center font-light text-gray-400 h-[300px] xl:h-[610px]">
          No offer found
        </div>
      )}
    </TabsContent>
  );
}
