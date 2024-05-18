import moment from "moment";
import randomstring from "randomstring";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useInterval } from "usehooks-ts";
import { useConnectorContext } from "../../../hooks/connectors/useConnectorContext.tsx";
import useStore from "../../../hooks/store/useStore.ts";
import { useGameAudioPlayer } from "../../../hooks/useGameAudioPlayer.ts";
import useImagePreloader from "../../../hooks/useImagePreloader.ts";
import { useSession } from "../../../hooks/useSession.ts";
import { cn } from "../../../libs/helpers.ts";
import { MainContainerConnectButton } from "../../MainContainerConnectButton.tsx";
import { FiredCoin } from "./FiredCoin.tsx";
import { GameBackgroundImage } from "./GameBackgroundImage.tsx";
import { OverheatIndicator } from "./OverheatIndicator.tsx";
import { Ship } from "./Ship.tsx";
import { TapCounter } from "./TapCounter.tsx";
import { TapOffHeader } from "./TapOffHeader.tsx";
import useTapSocketService, { InfoResult } from "./useTapSocketService.ts";
import { shipImages } from "./contants.ts";

const audioBgPath = "/audio/bg_game_audio.mp3";
const audioFirePath = "/audio/fire_audio.mp3";

export function TapOff() {
  useImagePreloader(shipImages);
  const { address } = useConnectorContext();
  const { token } = useSession();
  const [taps, setTaps] = useState("0");
  const [tapIncrement, setTapIncrement] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const tapCountRef = useRef<any>();
  const shipRef = useRef<any>();
  const [gunCount, setGunCount] = useState(1);
  const [firedCoins, setFiredCoins] = useState<ReactNode[]>([]);
  const [playerInfo, setPlayerInfo] = useState<InfoResult>();
  const [firing, setFiring] = useState(false);
  const [showTapToFireNotice, setShowTapToFireNotice] = useState(true);
  const [overheatLevel, setOverheatLevel] = useState(0);
  const [overheatLevelPct, setOverheatLevelPct] = useState(0);
  const { info, countTaps, ping, isReady, tap } = useTapSocketService();
  const { gameMaximized } = useStore((state) => ({
    gameMaximized: state.gameMaximized,
  }));
  const { playAudio, pauseAudio, manualPaused, playing, isFirstPlay } =
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
      .catch(console.error);

    info()
      .then((result) => {
        setPlayerInfo(result);
      })
      .catch(console.error);
  }, [isReady]);

  useInterval(
    () => {
      if (moment().unix() - lastTapTime < 5) return;
      setShowTapToFireNotice(true);
      setFiredCoins([]);
      pauseAudio(audioBgPath);
      pauseAudio(audioFirePath);
    },
    firing || !showTapToFireNotice ? 5000 : null,
  );

  useInterval(
    () => {
      if (!isReady) return;
      info()
        .then((result) => {
          setTaps(result.tapCount);
          setPlayerInfo(result);
          setTapIncrement(parseInt(result.tapIncrement));
          setGunCount(result.rapidFire.active ? 5 : 1);
        })
        .catch(console.error);
    },
    isReady ? 2000 : null,
  );

  useInterval(
    () => {
      if (!isReady) return;
      ping()
        .then((result) => {
          const { maxOverheatLvl } = playerInfo || {};
          const { overheatLvl } = result;
          if (!maxOverheatLvl) return;
          const overheatLevel = (overheatLvl / maxOverheatLvl) * 100;
          setOverheatLevelPct(overheatLevel);
          setOverheatLevel(result.overheatLvl);
        })
        .catch(() => {
          //
        });
    },
    isReady ? 1000 : null,
  );

  function fire() {
    setFiring(true);
    setShowTapToFireNotice(false);
    setLastTapTime(moment().unix());

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
      try {
        if (!manualPaused) {
          playAudio(audioFirePath, false, true);
        }

        const result = await tap();
        setTaps(result.tapCount);
        setTapIncrement(result.tapIncrement);

        const { maxOverheatLvl } = playerInfo || { maxOverheatLvl: 0 };
        const { overheatLvl } = result;
        const overheatLevel = (overheatLvl / maxOverheatLvl) * 100;
        setOverheatLevelPct(overheatLevel);
        setOverheatLevel(result.overheatLvl);
      } catch (error) {
        // do nothing
      }
    };

    doFire();
  }

  function onFireStop() {
    setFiring(false);
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
      <div className="flex flex-col z-20 w-full h-full absolute rounded-b-3xl">
        <TapOffHeader
          playerInfo={playerInfo}
          audioState={playing ? "playing" : "stopped"}
          toggleAudioPause={toggleAudioPause}
        />

        {address && !!token && (
          <div className="flex flex-col justify-between flex-1">
            <div className="flex-1 flex justify-center py-10">
              <TapCounter
                tapCountRef={tapCountRef}
                count={taps}
                rank={playerInfo?.rank || ""}
                rankInfo={playerInfo?.rankInfo}
              />
            </div>

            <Ship
              fire={fire}
              onFireStop={onFireStop}
              firedCoins={firedCoins}
              tapIncrement={tapIncrement}
              overheatLevel={overheatLevelPct}
              showTapToFireNotice={showTapToFireNotice}
              firing={firing}
              shipRef={shipRef}
              rank={playerInfo?.rank || ""}
            />

            <div className="h-[100px] flex flex-col justify-end">
              <div className=" mt-16">
                <OverheatIndicator
                  overheatLevel={overheatLevel}
                  overheatLevelPct={overheatLevelPct}
                  playerInfo={playerInfo}
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
        {/* <AudioPlayer
          src="/audio/bg_audio.ogg"
          autoPlay={true}
          ref={bgAudioRef}
        /> */}
      </div>
      {<GameBackgroundImage />}
    </div>
  );
}
