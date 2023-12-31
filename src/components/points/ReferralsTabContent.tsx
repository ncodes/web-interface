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
import { MainContainerConnectButton } from "../MainContainerConnectButton.tsx";
import { RowSkeleton } from "../RowSkeleton.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import ReferralInfo from "./ReferralInfo.tsx";
import { ReferralLeaderboard } from "./ReferralLeaderboard.tsx";

export function ReferralsTabContent() {
  const { getLeaderboard, getInfo } = useReferralService();
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const loaderProgress = useStore((state) => state.loaderProgress);
  const mounted = useMounted(1000);
  const { address } = useConnectorContext();
  const [limit] = useState(100);
  const [searchParams] = useSearchParams();

  const fetchLB = useQuery({
    queryKey: ["getReferralLeaderboard", { referrer: address, limit }],
    queryFn: getLeaderboard,
    enabled: mounted && !!address,
    refetchInterval: 60000,
  });

  const fetchAddrPoint = useQuery({
    queryKey: [
      "getLeaderboard",
      { referrer: address, referee: searchParams.get("address") || undefined },
    ],
    queryFn: getLeaderboard,
    enabled: mounted && !!address && !!searchParams.get("address"),
    refetchInterval: 60000,
  });

  const fetchGetInfo = useQuery({
    queryKey: ["getLeaderboard", { address }],
    queryFn: getInfo,
    enabled: mounted && !!address,
    refetchInterval: 60000,
  });

  // Update global progress bar
  useEffect(() => {
    if (!address) return;

    if (fetchLB.isLoading) setLoaderProgress && setLoaderProgress(50);
    if (!(fetchLB.isRefetching || fetchLB.isLoading) && loaderProgress == 50)
      setLoaderProgress?.(100);

    if (!searchParams.get("address")) return;
    if (fetchAddrPoint.isLoading) setLoaderProgress && setLoaderProgress(50);
    if (
      !(fetchAddrPoint.isRefetching || fetchAddrPoint.isLoading) &&
      loaderProgress == 50
    )
      setLoaderProgress?.(100);
  }, [
    fetchLB.isLoading,
    fetchLB.isRefetching,
    fetchAddrPoint.isLoading,
    fetchAddrPoint.isRefetching,
    loaderProgress,
    address,
  ]);

  return (
    <TabsContent value="referrals" className="p-0 m-0 flex flex-1 flex-col">
      <Helmet>
        <title>{`Referrals - Joint`}</title>
      </Helmet>

      {address && fetchLB.isLoading && (
        <RowSkeleton className="h-[300px] xl:h-[610px]" />
      )}

      {!address && <MainContainerConnectButton />}

      {address && fetchLB.isError && (
        <div className="flex items-center gap-2 text-red-300 justify-center font-light h-[300px] xl:h-[610px]">
          <ErrorIcon className="w-[20px]" />{" "}
          {(fetchLB.error as RequestError)?.message}
        </div>
      )}

      {address && fetchGetInfo.data && (
        <div className="p-6">
          <ReferralInfo referralInfo={fetchGetInfo.data} />
        </div>
      )}

      {address &&
        (!fetchLB.isLoading || !fetchAddrPoint.isLoading) &&
        (fetchLB.isSuccess || fetchAddrPoint.isSuccess) &&
        ((fetchLB.data?.points || []).length > 0 ||
          (fetchAddrPoint.data?.points || []).length > 0) && (
          <div className="flex flex-col flex-1 gap-3 min-h-[300px] xl:min-h-[610px]">
            <ReferralLeaderboard
              points={fetchLB.data?.points || []}
              addressPoint={fetchAddrPoint.data?.points || []}
              total={fetchLB.data?.total || 0}
            />
          </div>
        )}

      {!fetchLB.isLoading && fetchLB.data?.points.length == 0 && (
        <div className="flex items-center justify-center font-light text-gray-400 h-[300px] xl:h-[610px]">
          No result found
        </div>
      )}
    </TabsContent>
  );
}
