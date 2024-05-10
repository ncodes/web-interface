import { useNavigate } from "react-router-dom";
import { useConnectorContext } from "../../../hooks/connectors/useConnectorContext.tsx";
import { BattleInfo } from "../../../hooks/services/backend/useAirdropService.ts";
import useStore from "../../../hooks/store/useStore.ts";
import { useSession } from "../../../hooks/useSession.ts";
import {
  formatToHighDenom,
  formatToMoney,
  toDec,
} from "../../../libs/helpers.ts";
import { ToolTip } from "../../ToolTip.tsx";
import IconInfoCircle from "../../icons/IconInfoCircle.tsx";
import { Button } from "../../ui/Button.tsx";
import { InfoDialog } from "./InfoDialog.tsx";
import { StakeHistoryDialog } from "./StakeHistoryDialog.tsx";

export function Header({
  bondBalance,
  battleInfo,
}: {
  bondBalance: string;
  battleInfo?: BattleInfo;
}) {
  const navigate = useNavigate();
  const { address } = useConnectorContext();
  const { token } = useSession();
  const user = useStore((s) => s.user);

  return (
    <div className="border-b bg-airdropHeader2 md:bg-airdropHeader3 bg-right-bottom lg:bg-right lg:bg-airdropHeader bg-cover border-gray-900 flex flex-col lg:flex-row justify-between items-center p-5 py-3">
      <span className="gap-1 flex flex-col lg:flex-row justify-center items-center h-full text-3xl tracking-wider font-semibold font-jersey10 ml-2">
        <span>WarBond</span>
        <span className="flex items-center">
          <InfoDialog type="warbond" />
          <span className="text-lg ml-4 [&_a]:text-gray-400">
            <StakeHistoryDialog
              spends={battleInfo?.spends || []}
              curBattleId={battleInfo?.battleId as string}
            />
          </span>
        </span>
      </span>

      {address && !!token && (
        <>
          <ul className="flex gap-4 mt-2">
            <li className="flex items-center gap-1.5">
              <span>
                <img
                  src="/images/airdrop-icons/coin.svg"
                  className="w-[20px]"
                />
              </span>
              <span className="tracking-widest font-bold font-jersey25">
                {formatToHighDenom(user?.totalUnclaimedAlloc || "0", 18)}
              </span>
              <ToolTip
                className="opacity-70"
                tip="Total unclaimed $JOIN allocation. Earn allocations for staking bonds in either the Droid or Bandit side."
              >
                <IconInfoCircle className="w-[13px] cursor-pointer" />
              </ToolTip>
            </li>
            <li className="flex items-center gap-1.5">
              <span>
                <img
                  src="/images/airdrop-icons/bond-coin.svg"
                  className="w-[20px]"
                />
              </span>
              <span className="tracking-widest font-bold font-jersey25">
                {formatToMoney(bondBalance || "0")}
              </span>
              <ToolTip
                className="opacity-70"
                tip="Total unused $BOND allocation. Use bond to stake for either Droid or Bandit side."
              >
                <IconInfoCircle className="w-[13px] cursor-pointer" />
              </ToolTip>
            </li>
            <li className="hidden md:inline">
              <Button
                variant="ghost"
                rounded="xl"
                disabled={!battleInfo?.battleId}
                className="font-jersey25 text-lg md:h-10 md:px-8 md:text-xl bg-gradient-to-b text-gray-950 from-green-300 to-green-500 hover:scale-105 transition-all duration-500"
                onClick={() => {
                  navigate(
                    `/liquidity/${import.meta.env.VITE_TAPOFF_BOND_MKT}/${import.meta.env.VITE_TAPOFF_BOND_PROVIDER}/${import.meta.env.VITE_TAPOFF_BOND_LID}`,
                  );
                }}
              >
                Buy $BOND
              </Button>
            </li>
          </ul>
          <div className="md:hidden mt-3 md:mt-0">
            <Button
              variant="ghost"
              rounded="xl"
              disabled={toDec(bondBalance).lte(0)}
              className="font-jersey25 text-lg md:h-10 md:px-8 md:text-xl bg-gradient-to-b text-gray-950 from-green-300 to-green-500 hover:scale-105 transition-all duration-500"
            >
              Buy $Bond
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
