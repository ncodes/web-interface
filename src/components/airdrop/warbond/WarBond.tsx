import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useConnectorContext } from "../../../hooks/connectors/useConnectorContext.tsx";
import { useAirdropService } from "../../../hooks/services/backend/useAirdropService.ts";
import useImagePreloader from "../../../hooks/useImagePreloader.ts";
import { useSession } from "../../../hooks/useSession.ts";
import { formatToMoney } from "../../../libs/helpers.ts";
import { CountDown } from "../../Countdown.tsx";
import { MainContainerConnectButton } from "../../MainContainerConnectButton.tsx";
import { ToolTip } from "../../ToolTip.tsx";
import IconInfoCircle from "../../icons/IconInfoCircle.tsx";
import IconSpinner from "../../icons/IconSpinner.tsx";
import { WarBondBackgroundImage } from "../tapoff/WarBondBackgroundImage.tsx";
import { shipImages } from "../tapoff/contants.ts";
import { Header } from "./Header.tsx";
import { StakeDialog } from "./StakeDialog.tsx";
import { StakeHistoryDialog } from "./StakeHistoryDialog.tsx";

export function WarBond() {
  useImagePreloader(shipImages);
  const { address } = useConnectorContext();
  const { token } = useSession();
  const { getBattleInfo, getBondBalance } = useAirdropService();
  const [loadingBattle, setLoadingBattle] = useState(false);

  const battleInfoQuery = useQuery({
    queryKey: ["getBattleInfo"],
    queryFn: getBattleInfo,
    enabled: !!address || !!token,
    refetchInterval: 30000,
  });

  const bondBalanceQuery = useQuery({
    queryKey: ["getBondBalance"],
    queryFn: getBondBalance,
    enabled: !!address || !!token,
    refetchInterval: 30000,
  });

  return (
    <div className="h-full w-full flex flex-col flex-1 ">
      <div className="flex flex-col z-20 w-full h-full absolute rounded-b-3xl">
        <Header
          bondBalance={bondBalanceQuery.data || "0"}
          battleInfo={battleInfoQuery.data}
        />

        {address && !!token && (
          <div className="overflow-auto flex flex-col pb-10 md:pb-0">
            <header>
              <div className="flex justify-center mt-5 xl:mt-10">
                <div className="flex items-center gap-1 font-abrilFatFace text-xl tracking-wider z-10">
                  <span>
                    Battle #{battleInfoQuery.data?.battleIndex} Allocation
                  </span>
                  <span>
                    <ToolTip tip="The total number of $JOIN tokens to be shared among bond stakers in the current battle">
                      <IconInfoCircle className="w-[18px] cursor-pointer" />
                    </ToolTip>
                  </span>
                </div>
              </div>
              <div className="flex justify-center xl:-mt-3 items-center gap-2 xl:gap-4">
                <span>
                  <img
                    src="/images/game/stack_coin.svg"
                    className="h-[40px] xl:h-[70px]"
                  />
                </span>
                <span
                  className="font-jersey10 text-7xl xl:text-9xl bg-gradient-to-r
   from-amber-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text "
                >
                  {formatToMoney(battleInfoQuery.data?.battleAllocation || "0")}
                </span>
              </div>
              <div className="flex justify-center -mt-3">
                <span className="font-jersey10 text-xl tracking-wider flex items-center gap-1">
                  {battleInfoQuery.data?.battleId ? (
                    <>
                      Next Battle in{" "}
                      <span className="text-chinese-green">
                        {battleInfoQuery.data && !loadingBattle && (
                          <CountDown
                            isoDate={battleInfoQuery.data?.nextBattleTime}
                            full
                            onDone={() => {
                              setLoadingBattle(true);
                              battleInfoQuery.refetch().finally(() => {
                                setLoadingBattle(false);
                              });
                            }}
                          />
                        )}
                        {loadingBattle && (
                          <IconSpinner
                            className="text-chinese-green animate-spin"
                            width="20"
                          />
                        )}
                      </span>
                    </>
                  ) : (
                    <>First Battle starting soon</>
                  )}
                </span>
              </div>
            </header>
            <div className="flex flex-col md:flex-row xl:w-[1000px] gap-5 xl:gap-0 justify-between mx-auto mt-16 xl:mt-10">
              <div className="flex flex-col w-[250px] font-jersey10 min-h-[310px] border border-[#97A2ED]/30 rounded-2xl bg-gradient-to-b from-black to-black/50">
                <div className="flex justify-center">
                  <span className="p-2 px-5 relative font-jersey10 tracking-wider text-2xl -top-[22px] text-center bg-[#122BE1] inline-block rounded-full m">
                    Droid Side
                  </span>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="flex gap-1 items-center">
                    <span className="text-xl text-gray-400 tracking-wider">
                      Battle Taps
                    </span>
                    <ToolTip tip="The total taps created by the players on this side and in the current battle.">
                      <IconInfoCircle className="w-[15px]" />
                    </ToolTip>
                  </div>
                  <div className="text-5xl text-yellow-400">
                    {formatToMoney(battleInfoQuery.data?.droidTaps || "0")}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center mt-5">
                  <div className="flex gap-1 items-center">
                    <span className="text-xl text-gray-400 tracking-wider">
                      Active Players
                    </span>
                    <ToolTip tip="The current number of active players on this side and in the current battle.">
                      <IconInfoCircle className="w-[15px]" />
                    </ToolTip>
                  </div>
                  <div className="text-3xl ">
                    {formatToMoney(battleInfoQuery.data?.numDroids || "0")}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-end p-2">
                  {battleInfoQuery.data && (
                    <div className="text-center mb-2">
                      <StakeHistoryDialog
                        spends={battleInfoQuery.data?.spends || []}
                        curBattleId={battleInfoQuery.data?.battleId as string}
                      />
                    </div>
                  )}

                  {battleInfoQuery.data && (
                    <StakeDialog
                      side="Droid"
                      battleId={battleInfoQuery.data?.battleId as string}
                      balance={bondBalanceQuery.data || "0"}
                    />
                  )}
                </div>
              </div>

              <div className="font-jersey10 text-4xl xl:text-8xl flex flex-col justify-center items-center">
                VS
              </div>

              <div className="flex flex-col w-[250px] font-jersey10 min-h-[300px] border border-[#EFA6A6]/30 rounded-2xl bg-gradient-to-b from-black to-black/50">
                <div className="flex justify-center">
                  <span className="p-2 px-5 relative font-jersey10 tracking-wider text-2xl -top-[22px] text-center bg-[#E11212] inline-block rounded-full m">
                    Bandit Side
                  </span>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="flex gap-1 items-center">
                    <span className="text-xl text-gray-400 tracking-wider">
                      Battle Taps
                    </span>
                    <ToolTip tip="The total taps created by the players on this side and in the current battle.">
                      <IconInfoCircle className="w-[15px]" />
                    </ToolTip>
                  </div>
                  <div className="text-5xl text-yellow-400">
                    {formatToMoney(battleInfoQuery.data?.banditTaps || "0")}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center mt-5">
                  <div className="flex gap-1 items-center">
                    <span className="text-xl text-gray-400 tracking-wider">
                      Active Players
                    </span>
                    <ToolTip tip="The current number of active players on this side and in the current battle.">
                      <IconInfoCircle className="w-[15px]" />
                    </ToolTip>
                  </div>
                  <div className="text-3xl">
                    {formatToMoney(battleInfoQuery.data?.numBandits || "0")}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-end p-2">
                  {battleInfoQuery.data && (
                    <div className="text-center mb-2">
                      <StakeHistoryDialog
                        spends={battleInfoQuery.data?.spends || []}
                        curBattleId={battleInfoQuery.data?.battleId as string}
                      />
                    </div>
                  )}

                  {battleInfoQuery.data && (
                    <StakeDialog
                      side="Bandit"
                      battleId={battleInfoQuery.data?.battleId as string}
                      balance={bondBalanceQuery.data || "0"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <MainContainerConnectButton
          className="bg-black"
          authenticate
          showLoader
        />
      </div>
      {<WarBondBackgroundImage />}
    </div>
  );
}
