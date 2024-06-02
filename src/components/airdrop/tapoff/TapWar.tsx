import moment from "moment";
import randomstring from "randomstring";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useInterval } from "usehooks-ts";
import { useConnectorContext } from "../../../hooks/connectors/useConnectorContext.tsx";
import useStore from "../../../hooks/store/useStore.ts";
import { useGameAudioPlayer } from "../../../hooks/useGameAudioPlayer.ts";
import useImagePreloader from "../../../hooks/useImagePreloader.ts";
import { useSession } from "../../../hooks/useSession.ts";
import { useToast } from "../../../hooks/useToast.tsx";
import { cn, iOSversion } from "../../../libs/helpers.ts";
import { MainContainerConnectButton } from "../../MainContainerConnectButton.tsx";
import { FiredCoin } from "./FiredCoin.tsx";
import { GameBackgroundImage } from "./GameBackgroundImage.tsx";
import LoaderOverlay from "./LoaderOverlay.tsx";
import { OverheatIndicator } from "./OverheatIndicator.tsx";
import { Ship } from "./Ship.tsx";
import { TapCounter } from "./TapCounter.tsx";
import { TapWarHeader } from "./TapWarHeader.tsx";
import { shipImages } from "./contants.ts";
import useTapSocketService, { InfoResult } from "./useTapSocketService.ts";

const audioBgPath = "/audio/bg_game_audio.mp3";
const audioFirePath = "/audio/fire_audio.mp3";

export function TapWar() {
  useImagePreloader(shipImages);
  const { address } = useConnectorContext();
  const { token } = useSession();
  const [taps, setTaps] = useState("");
  const [tapIncrement, setTapIncrement] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const tapCountRef = useRef<any>();
  const shipRef = useRef<any>();
  const [gunCount, setGunCount] = useState(1);
  const [firedCoins, setFiredCoins] = useState<ReactNode[]>([]);
  const [playerInfo, setPlayerInfo] = useState<InfoResult>();
  const [showTapToFireNotice, setShowTapToFireNotice] = useState(true);
  const [overheatLevel, setOverheatLevel] = useState(0);
  const [overheatLevelPct, setOverheatLevelPct] = useState(0);
  const { info, countTaps, ping, isReady, tap } = useTapSocketService();
  const [isPinging, setIsPinging] = useState(false);
  const [hideLoader, setHideLoader] = useState(false);
  const { simpleError } = useToast();
  const { gameMaximized } = useStore((state) => ({
    gameMaximized: state.gameMaximized,
  }));
  const { playAudio, pauseAudio, playing, paused, isFirstPlay } =
    useGameAudioPlayer();

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
          setTaps(result.tapCount);
          setPlayerInfo(result);
          setGunCount(result.rapidFire.active ? 5 : 1);

          if (!isPinging) {
            const overheatLevelPct =
              (result.overheatLvl / result.maxOverheatLvl) * 100;
            setOverheatLevelPct(overheatLevelPct);
            setOverheatLevel(result.overheatLvl);
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
            setOverheatLevel(result.overheatLvl);
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

  function fire() {
    setShowTapToFireNotice(false);

    if (overheatLevelPct <= 0) return;

    setFiredCoins(
      firedCoins.length > 10000
        ? [createCoinsToFire(gunCount)]
        : [...firedCoins, ...createCoinsToFire(gunCount)],
    );

    if (isFirstPlay(audioBgPath)) {
      playAudio(audioBgPath, true, false);
    }

    const doFire = async () => {
      setLastTapTime(moment().unix());

      const iosVersion = iOSversion();
      if (!paused && (!iosVersion || (iosVersion && iosVersion[0] > 16))) {
        setTimeout(() => {
          playAudio(audioFirePath, false, true);
        }, 100);
      }

      try {
        const result = await tap();
        setTaps(result.tapCount);
        setTapIncrement(result.tapIncrement);

        const { maxOverheatLvl } = playerInfo || { maxOverheatLvl: 0 };
        const { overheatLvl } = result;
        const overheatLevel = (overheatLvl / maxOverheatLvl) * 100;
        setOverheatLevelPct(overheatLevel);
        setOverheatLevel(result.overheatLvl);
      } catch (error: any) {
        simpleError(error.message, { duration: 1000 });
      }
    };

    doFire();
  }

  function createCoinsToFire(count: number) {
    const coins: ReactNode[] = [];
    for (let i = 0; i < count; i++) {
      coins.push(
        <FiredCoin
          key={randomstring.generate()}
          ship={shipRef}
          target={tapCountRef}
          fire
        />,
      );
    }
    return coins;
  }

  function toggleAudioPause() {
    if (playing) {
      pauseAudio(audioBgPath);
      pauseAudio(audioFirePath);
    } else {
      playAudio(audioBgPath);
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
        <TapWarHeader
          playerInfo={playerInfo}
          audioState={playing ? "playing" : "stopped"}
          toggleAudioPause={toggleAudioPause}
        />

        {address && !!token && (
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
