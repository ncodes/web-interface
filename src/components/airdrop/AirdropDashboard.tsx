import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import { base } from "viem/chains";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { useSession } from "../../hooks/useSession.ts";
import { isDev } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { MainContainerConnectButton } from "../MainContainerConnectButton.tsx";
import IconCoinGold from "../icons/IconCoinGold.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { EmptyBodyCard } from "../ui/EmptyBodyCard.tsx";
import { AirdropHeader } from "./AirdropHeader.tsx";
import { ClaimView } from "./ClaimView.tsx";
import { FollowRequest } from "./FollowRequest.tsx";
import TradeView from "./TradeView.tsx";

export function AirdropDashboard({
  currentTab,
}: {
  currentTab: "claim" | "trade";
}) {
  const { address, chain } = useConnectorContext();
  const { getClaims } = useUserService();
  const { checkDexClaim } = useUserService();
  const user = useStore((state) => state.user);
  const { token } = useSession();
  const [activeView, setActiveView] = useState<"trade" | "claim">(currentTab);
  const [dexClaimChecked, setDexClaimChecked] = useState(false);
  const [isClaimActivated, setIsClaimActivated] = useState(false);

  const checkDexClaimMut = useMutation({
    mutationFn: checkDexClaim,
  });

  const { data: claims, isLoading: isGetClaimsLoading } = useQuery({
    queryKey: ["getClaims", { address }],
    queryFn: getClaims,
    enabled: !!address && dexClaimChecked && !!token,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (address) {
      checkDexClaimMut.mutateAsync({ address }).finally(() => {
        setDexClaimChecked(true);
      });
    }
  }, [address]);

  useEffect(() => {
    setActiveView(currentTab);
  }, [currentTab]);

  useInterval(
    () => {
      setIsClaimActivated(checkClaimActivated());
    },
    !isClaimActivated ? 2000 : 0,
  );

  const unclaimedClaims = (claims || []).filter((claim) => {
    return !claim.claimedAt;
  });

  const unclaimedClaimsAmt = unclaimedClaims
    .map((claim) => BigInt(claim.amount))
    .reduce((a, b) => a + b, BigInt(0));

  const hideDexDropComponents =
    !address || (!isDev() && chain && chain.id != base.id);

  const isLoading = checkDexClaimMut.isPending || isGetClaimsLoading;

  function checkClaimActivated() {
    if (!user) return false;
    if (unclaimedClaimsAmt == 0n) return true;
    if (!user.claimActivatedAt) return false;
    return moment(user.claimActivatedAt).isBefore(moment());
  }

  return (
    <div className="w-full rounded-t-3xl rounded-b-3xl flex flex-col flex-1 relative bg-black/80 bg-[url('/public/images/dexdrop-cover.png')] bg-contain bg-no-repeat xl:bg-bottom">
      <AirdropHeader onViewChanged={setActiveView} defaultView={currentTab} />

      {!!address && hideDexDropComponents && (
        <EmptyBodyCard
          className={cn("max-w-[350px] mx-auto mt-[25%] pt-0", "")}
          label="Chain not supported"
        >
          <span className="font-light text-sm px-3 text-center text-gray-300">
            DexDrop is only supported on the Base chain
          </span>
        </EmptyBodyCard>
      )}

      {!!token &&
        !hideDexDropComponents &&
        !isLoading &&
        !!user &&
        isClaimActivated && (
          <>
            {activeView === "claim" && (
              <ClaimView claims={claims || []} address={address} />
            )}

            {activeView === "trade" && <TradeView />}
          </>
        )}

      {!hideDexDropComponents && !isLoading && !!user && !isClaimActivated && (
        <>
          <FollowRequest claims={claims || []} />
        </>
      )}

      {!!token && isLoading && (
        <div className="flex justify-center items-center h-full">
          <span className="flex items-center gap-2 mt-[25%] text-gray-400">
            <IconSpinner className="text-chinese-green w-10 h-10 animate-spin" />{" "}
            Checking claims...
          </span>
        </div>
      )}

      <MainContainerConnectButton
        showLoader
        authenticate
        className="bg-black/50"
        loaderIcon={
          <IconCoinGold width="30" className="text-yellow-400 animate-spin" />
        }
      />
    </div>
  );
}
