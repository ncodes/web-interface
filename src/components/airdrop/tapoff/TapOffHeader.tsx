import { useConnectorContext } from "../../../hooks/connectors/useConnectorContext.tsx";
import { useSession } from "../../../hooks/useSession.ts";
import { BoostDialog } from "./BoostDialog.tsx";
import { RefDialog } from "./RefDialog.tsx";
import { StatsDialog } from "./StatsDialog.tsx";
import { TaskDialog } from "./TaskDialog.tsx";
import { InfoResult } from "./useTapSocketService.ts";

export function TapOffHeader({ playerInfo }: { playerInfo?: InfoResult }) {
  const { address } = useConnectorContext();
  const { hasAccessToken } = useSession();

  return (
    <div className="border-b bg-airdropHeader2 md:bg-airdropHeader3 bg-right-bottom lg:bg-right lg:bg-airdropHeader bg-cover border-gray-900 flex flex-col md:flex-row justify-between items-center md:items-start p-5 py-3">
      <span className="hidden md:block text-3xl tracking-wider font-semibold font-jersey10 inline-block ml-2">
        TapOff
      </span>

      {address && hasAccessToken(address) && playerInfo && (
        <div className="flex gap-3">
          <RefDialog playerInfo={playerInfo} />

          <TaskDialog playerInfo={playerInfo} />

          <BoostDialog playerInfo={playerInfo} />

          <StatsDialog playerInfo={playerInfo} />
        </div>
      )}
    </div>
  );
}
