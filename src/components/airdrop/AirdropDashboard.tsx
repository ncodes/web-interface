import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useStore from "../../hooks/store/useStore.ts";
import { useSession } from "../../hooks/useSession.ts";
import { MainContainerConnectButton } from "../MainContainerConnectButton.tsx";
import IconCoinGold from "../icons/IconCoinGold.tsx";
import { AirdropAccountConnect } from "./AirdropAccountConnect.tsx";
import { AirdropApplyLuckyCode } from "./AirdropApplyLuckyCode.tsx";
import { AirdropDailyQuest } from "./AirdropDailyQuest.tsx";
import { AirdropEngagementPoints } from "./AirdropEngagementPoints.tsx";
import { AirdropHeader } from "./AirdropHeader.tsx";

export function AirdropDashboard() {
  const { address } = useConnectorContext();
  const { hasAccessToken } = useSession();
  const isTelegramBot = useStore((state) => state.isTelegramBot);

  return (
    <div className="w-full flex flex-col flex-1 relative">
      <AirdropHeader />

      {address && hasAccessToken(address) && (
        <div className="flex flex-col lg:flex-row gap-7 px-5 pb-5 pt-4">
          <div className="flex-1 flex flex-col gap-5">
            <AirdropAccountConnect />
            <AirdropEngagementPoints />
            {/* <AirdropClaimNFTAndEarlyMemberAllocation /> */}
            <div className="hidden lg:block">
              <AirdropApplyLuckyCode />
            </div>
          </div>

          <AirdropDailyQuest />
        </div>
      )}

      {!isTelegramBot && (
        <MainContainerConnectButton
          authenticate
          showLoader
          loaderIcon={
            <IconCoinGold
              width="30"
              className="text-yellow-400 animate-spin "
            />
          }
        />
      )}
    </div>
  );
}
