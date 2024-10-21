import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import moment from "moment";
import { ReactNode, useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import { isAddress } from "viem";
import { useConnectorContext } from "../../../hooks/connectors/useConnectorContext.tsx";
import { useUserService } from "../../../hooks/services/backend/useUserService.ts";
import useStore from "../../../hooks/store/useStore.ts";
import { useGameAudioPlayer } from "../../../hooks/useGameAudioPlayer.ts";
import useImagePreloader from "../../../hooks/useImagePreloader.ts";
import { useSession } from "../../../hooks/useSession.ts";
import { useToast } from "../../../hooks/useToast.tsx";
import { cn, logError, toDec } from "../../../libs/helpers.ts";
import Input2 from "../../Input2.tsx";
import { MainContainerConnectButton } from "../../MainContainerConnectButton.tsx";
import { Button } from "../../ui/Button.tsx";
import { EmptyBodyCard } from "../../ui/EmptyBodyCard.tsx";
import { Label } from "../../ui/label.tsx";
import { GameBackgroundImage } from "./GameBackgroundImage.tsx";
import LoaderOverlay from "./LoaderOverlay.tsx";
import { shipImages } from "./contants.ts";
import useTapSocketService, { InfoResult } from "./useTapSocketService.ts";

const audioFirePath = "/audio/fire_audio.mp3";
const audioBgPath = "/audio/bg_game_audio.mp3";

export function TapWar() {
  useImagePreloader(shipImages);
  const { address } = useConnectorContext();
  const { token } = useSession();
  const user = useStore((state) => state.user);
  const [taps, setTaps] = useState("");
  const [tapIncrement, setTapIncrement] = useState(0);
  const [lastTapTime, _setLastTapTime] = useState(0);
  // const tapCountRef = useRef<any>();
  // const shipRef = useRef<any>();
  const [_gunCount, setGunCount] = useState(1);
  const [_firedCoins, setFiredCoins] = useState<ReactNode[]>([]);
  const [playerInfo, setPlayerInfo] = useState<InfoResult>();
  const [showTapToFireNotice, setShowTapToFireNotice] = useState(true);
  const [_setOverheatLevel] = useState(0);
  const [_overheatLevelPct, setOverheatLevelPct] = useState(0);
  const { info, countTaps, ping, isReady } = useTapSocketService();
  const [isPinging, setIsPinging] = useState(false);
  const [hideLoader, setHideLoader] = useState(false);
  const { transferScores } = useUserService();
  const [transferAddress, setTransferAddress] = useState("");
  const { notifyError, notifySuccess } = useToast();
  const { gameMaximized } = useStore((state) => ({
    gameMaximized: state.gameMaximized,
  }));
  const { pauseAudio } = useGameAudioPlayer();
  const transferScoresMut = useMutation({
    mutationFn: transferScores,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      pauseAudio(audioBgPath);
      pauseAudio(audioFirePath);
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    countTaps()
      .then((result) => {
        setTaps(result.count);
      })
      .catch(console.error)
      .finally(() => {
        setHideLoader(true);
      });

    info()
      .then((result) => {
        setPlayerInfo(result);
      })
      .catch(console.error)
      .finally(() => {
        setHideLoader(true);
      });
  }, [isReady]);

  useInterval(
    () => {
      if (moment().unix() - lastTapTime < 5) return;
      setShowTapToFireNotice(true);
      setFiredCoins([]);
    },
    isFiring() || !showTapToFireNotice ? 5000 : null,
  );

  useInterval(
    () => {
      if (!isReady) return;
      info()
        .then((result) => {
          if (!taps) setTaps(result.tapCount);
          if (!tapIncrement) setTapIncrement(parseInt(result.tapIncrement));

          if (toDec(result.tapCount).gte(taps)) {
            setTaps(result.tapCount);
          }

          setPlayerInfo(result);
          setGunCount(result.rapidFire.active ? 5 : 1);

          if (!isPinging) {
            const overheatLevelPct =
              (result.overheatLvl / result.maxOverheatLvl) * 100;
            setOverheatLevelPct(overheatLevelPct);
            // setOverheatLevel(result.overheatLvl);
          }
        })
        .catch((e) => {
          console.error("info", e);
        });
    },
    isReady ? 500 : null,
  );

  useInterval(
    () => {
      if (!isReady) return;
      setIsPinging(true);
      ping()
        .then((result) => {
          const { maxOverheatLvl } = playerInfo || {};
          const { overheatLvl } = result;
          if (!maxOverheatLvl) return;

          if (!isFiring()) {
            const overheatLevelPct = (overheatLvl / maxOverheatLvl) * 100;
            setOverheatLevelPct(overheatLevelPct);
            // setOverheatLevel(result.overheatLvl);
          }
        })
        .catch(() => {
          //
        });
    },
    isReady ? 1000 : null,
  );

  function isFiring() {
    return moment().unix() - lastTapTime < 1;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // function fire() {
  //   setShowTapToFireNotice(false);

  //   if (overheatLevelPct <= 0) return;

  //   setFiredCoins(
  //     firedCoins.length > 10000
  //       ? [createCoinsToFire(gunCount)]
  //       : [...firedCoins, ...createCoinsToFire(gunCount)],
  //   );

  //   if (isFirstPlay(audioBgPath)) {
  //     playAudio(audioBgPath, true, false);
  //   }

  //   const doFire = async () => {
  //     setLastTapTime(moment().unix());

  //     const iosVersion = iOSversion();
  //     if (!paused && (!iosVersion || (iosVersion && iosVersion[0] > 16))) {
  //       setTimeout(() => {
  //         playAudio(audioFirePath, false, true);
  //       }, 100);
  //     }

  //     try {
  //       const result = await tap();
  //       setTaps(result.tapCount);
  //       setTapIncrement(result.tapIncrement);

  //       const { maxOverheatLvl } = playerInfo || { maxOverheatLvl: 0 };
  //       const { overheatLvl } = result;
  //       const overheatLevel = (overheatLvl / maxOverheatLvl) * 100;
  //       setOverheatLevelPct(overheatLevel);
  //       setOverheatLevel(result.overheatLvl);
  //     } catch (error: any) {
  //       simpleError(error.message, { duration: 1000 });
  //     }
  //   };

  //   doFire();
  // }

  // function createCoinsToFire(count: number) {
  //   const coins: ReactNode[] = [];
  //   for (let i = 0; i < count; i++) {
  //     coins.push(
  //       <FiredCoin
  //         key={randomstring.generate()}
  //         ship={shipRef}
  //         target={tapCountRef}
  //         fire
  //       />,
  //     );
  //   }
  //   return coins;
  // }

  // function toggleAudioPause() {
  //   if (playing) {
  //     pauseAudio(audioBgPath);
  //     pauseAudio(audioFirePath);
  //   } else {
  //     playAudio(audioBgPath);
  //   }
  // }

  function isTransferDisabled() {
    return (
      !transferAddress ||
      !isAddress(transferAddress) ||
      toDec(user?.tapScore || "0").lte(0) ||
      toDec(user?.points || "0").lte(0)
    );
  }

  async function doTransferScores() {
    if (confirm("Are you sure you want to transfer your scores?")) {
      try {
        await transferScoresMut.mutateAsync({ address: transferAddress });
        notifySuccess("Transfer was successfully");
        setTransferAddress("");
        queryClient.invalidateQueries({ queryKey: ["getUser"] });
      } catch (error) {
        logError(error);
        notifyError((error as Error).message);
      }
    }
  }

  return (
    <div
      className={cn(
        "h-full w-full flex flex-col flex-1 transition-all duration-300",
        {
          "fixed top-0 left-0 z-30 bg-black": gameMaximized,
        },
      )}
    >
      {!!address && !!token && !hideLoader && (
        <div className="z-30">{address && <LoaderOverlay />}</div>
      )}
      <div className="flex flex-col z-20 w-full h-full absolute rounded-b-3xl">
        {/* <TapWarHeader
          playerInfo={playerInfo}
          audioState={playing ? "playing" : "stopped"}
          toggleAudioPause={toggleAudioPause}
        /> */}

        {/* {address && !!token && (
          <div className="flex flex-col justify-between flex-1">
            <div className="flex-1 flex justify-center py-5 lg:py-10">
              <TapCounter
                tapCountRef={tapCountRef}
                count={taps}
                rank={playerInfo?.rank || ""}
                rankInfo={playerInfo?.rankInfo}
              />
            </div>

            <Ship
              fire={() => {
                fire();
              }}
              firedCoins={firedCoins}
              tapIncrement={tapIncrement}
              overheatLevel={overheatLevelPct}
              showTapToFireNotice={showTapToFireNotice}
              firing={isFiring()}
              shipRef={shipRef}
              rank={playerInfo?.rank || ""}
            />

            <div className="h-[100px] flex flex-col justify-end">
              <div className="mt-16">
                <OverheatIndicator
                  overheatLevel={overheatLevel}
                  overheatLevelPct={overheatLevelPct}
                  maxOverheatLvl={playerInfo?.maxOverheatLvl}
                /> 
              </div>
            </div>
          </div>
        )} */}

        {address && !!token && (
          <div className="flex justify-center items-center h-full">
            <EmptyBodyCard
              className={cn(
                "min-h-[100px] px-1 items-start bg-black md:min-w-[400px] max-w-[300px] mt-12 md:mt-0 pt-0",
              )}
              label={
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Send className="text-chinese-green" width="20" />
                  <span className="font-jersey20 text-xl">Transfer Scores</span>
                </div>
              }
            >
              <div className="flex flex-col gap-2 px-2 w-full">
                <Label className="tracking-wide bg-gray-800/70 p-2 rounded-xl">
                  Points:{" "}
                  <span className="text-chinese-green font-light">
                    {user?.points}
                  </span>{" "}
                  | TAPs:{" "}
                  <span className="text-chinese-green font-light">
                    {user?.tapScore}
                  </span>
                </Label>
                <span className="text-gray-500 text-xs font-light inline-block mb-1">
                  Enter a valid Ethereum wallet address to transfer your TAP
                  score. This action cannot be undone.
                </span>
                <Input2
                  type="text"
                  placeholder="Enter Ethereum wallet address"
                  className="pl-2 transition-all duration-500 hover:scale-x-[1.01] focus:scale-x-[1.01]"
                  value={transferAddress}
                  onChange={(e) => {
                    setTransferAddress(e.target.value);
                  }}
                />
                <Button
                  disabled={isTransferDisabled()}
                  onClick={doTransferScores}
                  className="mt-2"
                >
                  {transferScoresMut.isPending && (
                    <Loader2 className="animate-spin ml-2" />
                  )}
                  {transferScoresMut.isPending ? "Transferring..." : "Transfer"}
                </Button>
              </div>
            </EmptyBodyCard>
          </div>
        )}

        <MainContainerConnectButton
          className="bg-black"
          authenticate
          showLoader
        />
      </div>
      {<GameBackgroundImage />}
    </div>
  );
}
