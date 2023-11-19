import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ErrorIcon } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useOfferService } from "../../hooks/services/backend/useOfferService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { RequestError } from "../../libs/RequestError.ts";
import { Paginator } from "../Paginator.tsx";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import { OfferRow } from "./OfferRow.tsx";

import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useLiquidityService } from "../../hooks/services/backend/useLiquidityService.ts";

export function OffersTabContent({
  setLiquidity,
}: {
  setLiquidity?: Dispatch<SetStateAction<Liquidity | undefined>>;
}) {
  const { getChainInfo, address } = useConnectorContext();
  const { market, provider, lid } = useParams();
  const user = useStore((state) => state.user);
  const { listOffers } = useOfferService();
  const { getLiquidity } = useLiquidityService();
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const queryClient = useQueryClient();
  const { markAsRead } = useOfferService();

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

  const offers = useQuery({
    queryKey: [
      "getLiquidityOffers",
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
    keepPreviousData: true,
    enabled: !!market && !!provider && !!lid,
  });

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
    enabled: !!address && !!user,
    onSuccess: async () => {
      await queryClient.refetchQueries(["countUnreadOffer"]);
    },
  });

  useEffect(() => {
    if (liquidity.isSuccess && setLiquidity) setLiquidity(liquidity.data);
  }, [liquidity.isSuccess]);

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
    <TabsContent value="offers" className="p-0 m-0 flex flex-col flex-1 gap-3">
      {offers.isLoading && <RowSkeleton className="h-[300px] xl:h-[610px]" />}

      {offers.isError && (
        <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px] xl:h-[610px]">
          <ErrorIcon className="w-[20px]" />{" "}
          {(offers.error as RequestError)?.message}
        </div>
      )}

      {!offers.isLoading &&
        offers.isSuccess &&
        offers.data?.offers?.length > 0 && (
          <div className="flex flex-col flex-1 gap-3 min-h-[300px] xl:min-h-[610px]">
            <div className="flex flex-col gap-3 flex-1">
              <Paginator
                curPage={offset}
                total={offers.data?.meta?.queryCount}
                limit={limit}
                onNext={() => setOffset(offset + limit)}
                onPrev={() => setOffset(offset - limit)}
              />
              <div className="flex flex-col gap-3 p-3 pt-0 pb-0">
                {offers.data?.offers.map((offer: Offer) => (
                  <OfferRow offer={offer} key={offer.offerId} />
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

      {false && !offers.isLoading && offers.data?.offers?.length == 0 && (
        <div className="flex items-center justify-center font-light text-gray-400 h-[300px] xl:h-[610px]">
          No offer found
        </div>
      )}
    </TabsContent>
  );
}
