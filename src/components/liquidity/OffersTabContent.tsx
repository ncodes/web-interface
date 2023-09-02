import { TabsContent } from "../ui/Tabs.tsx";
import { useOfferService } from "../../hooks/services/backend/useOfferService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { ErrorIcon } from "react-hot-toast";
import { RequestError } from "../../libs/RequestError.ts";
import { Paginator } from "../Paginator.tsx";
import { OfferRow } from "./OfferRow.tsx";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";

export function OffersTabContent() {
  const { getChainInfo, address } = useConnectorContext();
  const { market, provider, lid } = useParams();
  const { listOffers } = useOfferService();
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(1);
  const queryClient = useQueryClient();
  const offers = useQuery({
    queryKey: [
      "getOffers",
      {
        network: getChainInfo().queryName,
        limit,
        offset,
        offerFilter: {
          marketAddress: market,
          provider,
          lid: parseInt(lid || "0"),
        },
      },
    ],
    queryFn: listOffers,
    enabled: !!market && !!provider && !!lid,
  });

  const { markAsRead } = useOfferService();
  useQuery({
    queryKey: [
      "markAsRead",
      {
        network: getChainInfo().queryName,
        marketAddress: market,
        provider: provider,
        lid: parseInt(lid || "0"),
      },
    ],
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

      {!offers.isLoading && offers.isSuccess && (
        <>
          <Paginator
            curPage={offset}
            total={offers.data?.meta?.queryCount}
            limit={limit}
            onNext={() => setOffset(offset + 1)}
            onPrev={() => setOffset(offset - 1)}
          />
          <div className="flex flex-col gap-3 p-3 pt-0 pb-0">
            {offers.data?.offers.map((offer: Offer) => (
              <OfferRow offer={offer} key={offer.offerId} />
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
