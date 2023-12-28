import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { ErrorIcon } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useReferralService } from "../../hooks/services/backend/useReferralService.ts";
import useStore from "../../hooks/store/useStore.ts";
import useMounted from "../../hooks/useMounted.ts";
import { RequestError } from "../../libs/RequestError.ts";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import { Leaderboard } from "./Leaderboard.tsx";
import { ReferralLeaderboard } from "./ReferralLeaderboard.tsx";

export function ReferralsTabContent() {
  const { getLeaderboard } = useReferralService();
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const loaderProgress = useStore((state) => state.loaderProgress);
  const mounted = useMounted(1000);
  const { address } = useConnectorContext();
  const [limit] = useState(100);
  const [searchParams] = useSearchParams();

  const fetchLeaderboard = useQuery({
    queryKey: ["getReferralLeaderboard", { referrer: address, limit }],
    queryFn: getLeaderboard,
    keepPreviousData: false,
    enabled: mounted,
    refetchInterval: 10000,
  });

  const fetchAddressPoint = useQuery({
    queryKey: [
      "getLeaderboard",
      { referrer: address, referee: searchParams.get("address") || undefined },
    ],
    queryFn: getLeaderboard,
    keepPreviousData: false,
    enabled: mounted && !!searchParams.get("address"),
    refetchInterval: 10000,
  });

  // Update global progress bar
  useEffect(() => {
    if (fetchLeaderboard.isLoading) setLoaderProgress && setLoaderProgress(50);
    if (
      !(fetchLeaderboard.isRefetching || fetchLeaderboard.isLoading) &&
      loaderProgress == 50
    )
      setLoaderProgress?.(100);

    if (!searchParams.get("address")) return;
    if (fetchAddressPoint.isLoading) setLoaderProgress && setLoaderProgress(50);
    if (
      !(fetchAddressPoint.isRefetching || fetchAddressPoint.isLoading) &&
      loaderProgress == 50
    )
      setLoaderProgress?.(100);
  }, [
    fetchLeaderboard.isLoading,
    fetchLeaderboard.isRefetching,
    fetchAddressPoint.isLoading,
    fetchAddressPoint.isRefetching,
    loaderProgress,
  ]);

  return (
    <TabsContent
      value="referrals"
      className="p-0 m-0 flex flex-1 flex-col gap-3"
    >
      <Helmet>
        <title>{`Referrals - Joint`}</title>
      </Helmet>

      {fetchLeaderboard.isLoading && (
        <RowSkeleton className="h-[300px] xl:h-[610px]" />
      )}

      {fetchLeaderboard.isError && (
        <div className="flex items-center gap-2 text-red-300 justify-center font-light h-[300px] xl:h-[610px]">
          <ErrorIcon className="w-[20px]" />{" "}
          {(fetchLeaderboard.error as RequestError)?.message}
        </div>
      )}

      {(!fetchLeaderboard.isLoading || !fetchAddressPoint.isLoading) &&
        (fetchLeaderboard.isSuccess || fetchAddressPoint.isSuccess) &&
        ((fetchLeaderboard.data?.points || []).length > 0 ||
          (fetchAddressPoint.data?.points || []).length > 0) && (
          <div className="flex flex-col flex-1 gap-3 min-h-[300px] xl:min-h-[610px]">
            <ReferralLeaderboard
              points={fetchLeaderboard.data?.points || []}
              addressPoint={fetchAddressPoint.data?.points || []}
              total={fetchLeaderboard.data?.total || 0}
            />
          </div>
        )}

      {!fetchLeaderboard.isLoading &&
        fetchLeaderboard.data?.points.length == 0 && (
          <div className="flex items-center justify-center font-light text-gray-400 h-[300px] xl:h-[610px]">
            No result found
          </div>
        )}
    </TabsContent>
  );
}
