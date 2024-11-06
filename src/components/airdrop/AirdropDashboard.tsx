import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { base } from "viem/chains";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import { isDev } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { MainContainerConnectButton } from "../MainContainerConnectButton.tsx";
import IconCoinGold from "../icons/IconCoinGold.tsx";
import { EmptyBodyCard } from "../ui/EmptyBodyCard.tsx";
import { AirdropHeader } from "./AirdropHeader.tsx";
import { ClaimView } from "./ClaimView.tsx";
import TradeView from "./TradeView.tsx";

export function AirdropDashboard({
  currentTab,
}: {
  currentTab: "claim" | "trade";
}) {
  const { address, chain } = useConnectorContext();
  const { getClaims } = useUserService();
  const [activeView, setActiveView] = useState<"trade" | "claim">(currentTab);

  const { data: claims } = useQuery({
    queryKey: ["getClaims", { address }],
    queryFn: getClaims,
    enabled: !!address,
    refetchInterval: 60000,
  });

  useEffect(() => {
    setActiveView(currentTab);
  }, [currentTab]);

  const hideDexDropComponents = !isDev() && chain && chain.id != base.id;

  return (
    <div className="w-full rounded-t-3xl rounded-b-3xl flex flex-col flex-1 relative bg-black/80">
      <AirdropHeader onViewChanged={setActiveView} defaultView={currentTab} />

      {hideDexDropComponents && (
        <EmptyBodyCard
          className={cn("max-w-[350px] mx-auto mt-[25%] pt-0", "")}
          label="Chain not supported"
        >
          <span className="font-light text-sm px-3 text-center text-gray-300">
            DexDrop is only supported on the Base chain
          </span>
        </EmptyBodyCard>
      )}

      {!hideDexDropComponents && (
        <>
          {activeView === "claim" && (
            <ClaimView claims={claims || []} address={address} />
          )}

          {activeView === "trade" && <TradeView />}
        </>
      )}

      <MainContainerConnectButton
        showLoader
        loaderIcon={
          <IconCoinGold width="30" className="text-yellow-400 animate-spin " />
        }
      />
    </div>
  );
}
