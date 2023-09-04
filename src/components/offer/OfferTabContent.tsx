import { TabsContent } from "../ui/Tabs.tsx";
import { Label } from "../ui/label.tsx";
import OfferEvent from "./OfferEvent.tsx";
import { useOfferService } from "../../hooks/services/backend/useOfferService.ts";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import { useParams } from "react-router-dom";
import useStore from "../../hooks/store/useStore.ts";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { OfferRow } from "../liquidity/OfferRow.tsx";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { ErrorIcon } from "react-hot-toast";
import { RequestError } from "../../libs/RequestError.ts";
import { Skeleton } from "../ui/skeleton.tsx";

function OfferEventRowSkeleton() {
  return (
    <div className="flex gap-2 w-full md:w-[500px]">
      <Skeleton className="w-[35px] h-[35px] rounded-full" />
      <div className="flex-1 flex flex-col gap-1">
        <Skeleton className="w-full h-[20px]" />
        <Skeleton className="w-full h-[20px]" />
      </div>
    </div>
  );
}

export function OfferTabContent() {
  const { getOffer, getEvents } = useOfferService();
  const { getChainInfo } = useConnectorContext();
  const { id } = useParams<{ id: string }>();
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const offer = useQuery({
    queryKey: [
      "getOffer",
      {
        network: getChainInfo().queryName,
        offerId: parseInt(id as string),
      },
    ],
    queryFn: getOffer,
    enabled: !!id,
  });
  const events = useQuery({
    queryKey: [
      "getEvents",
      {
        network: getChainInfo().queryName,
        offerId: parseInt(id as string),
      },
    ],
    queryFn: getEvents,
    enabled: offer.isSuccess,
  });

  useEffect(() => {
    if (offer.isLoading || offer.isRefetching)
      setLoaderProgress && setLoaderProgress(50);
    else setLoaderProgress && setLoaderProgress(100);
  }, [
    offer.isError,
    offer.isLoading,
    offer.isRefetching,
    offer.isRefetchError,
  ]);

  return (
    <TabsContent value="offers" className="p-0 m-0 px-0 flex flex-col gap-3">
      <div className="p-0 m-0">
        {offer.isLoading && <RowSkeleton />}

        {offer.isError && (
          <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]">
            <ErrorIcon className="w-[20px]" />{" "}
            {(offer.error as RequestError)?.message}
          </div>
        )}

        {!offer.isLoading && offer.isSuccess && (
          <div className=" pr-0 flex-1 ">
            <OfferRow
              offer={offer.data}
              className="rounded-none border-r-0 border-l-0 border-t-0 border-b hover:border-b-card-border"
            />
            <div className="flex flex-col md:items-center gap-5 px-3 md:px-5 py-5">
              {events.isLoading && <OfferEventRowSkeleton />}

              {events.isError && (
                <div className="flex items-center gap-2 text-red-300 justify-center font-light  h-[300px]">
                  <ErrorIcon className="w-[20px]" />{" "}
                  {(events.error as RequestError)?.message}
                </div>
              )}

              {!events.isLoading &&
                events.isSuccess &&
                events.data.events.length == 0 && (
                  <div className="flex items-center gap-2 text-gray-300 justify-center font-normal tracking-wide  h-[300px]">
                    No events found
                  </div>
                )}

              {!events.isLoading &&
                events.isSuccess &&
                events.data.events.length > 0 && (
                  <>
                    <Label className="text-xl tracking-wide">
                      Offer Events
                    </Label>
                    <div className="flex flex-col gap-5">
                      {events.data?.events?.map((event) => (
                        <OfferEvent event={event} />
                      ))}
                    </div>
                  </>
                )}
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
}
