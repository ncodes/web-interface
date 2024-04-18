import { AlertTriangle } from "lucide-react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useStore from "../../hooks/store/useStore.ts";
import { useSession } from "../../hooks/useSession.ts";
import { MainContainerConnectButton } from "../MainContainerConnectButton.tsx";
import { Button } from "../ui/Button.tsx";
import { EmptySheetAlert } from "../ui/EmptySheetAlert.tsx";
import { AirdropAccountConnect } from "./AirdropAccountConnect.tsx";
import { AirdropApplyLuckyCode } from "./AirdropApplyLuckyCode.tsx";
import { AirdropDailyQuest } from "./AirdropDailyQuest.tsx";
import { AirdropEngagementPoints } from "./AirdropEngagementPoints.tsx";
import { AirdropHeader } from "./AirdropHeader.tsx";

export function AirdropDashboard() {
  const { address } = useConnectorContext();
  const { hasAccessToken } = useSession();
  const { toggleOpenState } = useStore((state) => ({
    toggleOpenState: state.toggleOpenState,
  }));

  return (
    <div className="h-full ">
      <AirdropHeader />

      {address && !hasAccessToken(address) && (
        <div className="flex md:items-center justify-center h-[350px]">
          <EmptySheetAlert
            className="h-[115px] mt-12 md:mt-0"
            label={
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <AlertTriangle className="text-yellow-500" width="20" />
                <span>Log in to update settings</span>
              </div>
            }
          >
            <Button
              variant="default"
              size="full"
              className="w-full mt-2"
              onClick={() => {
                toggleOpenState && toggleOpenState("settingsSheet", "account");
              }}
            >
              LOGIN
            </Button>
          </EmptySheetAlert>
        </div>
      )}

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

      {!address && <MainContainerConnectButton />}
    </div>
  );
}
