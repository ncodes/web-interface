import { AlertTriangle } from "lucide-react";
import moment from "moment";
import randomstring from "randomstring";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useInterval } from "usehooks-ts";
import { useConnectorContext } from "../../../hooks/connectors/useConnectorContext.tsx";
import useStore from "../../../hooks/store/useStore.ts";
import { useSession } from "../../../hooks/useSession.ts";
import { MainContainerConnectButton } from "../../MainContainerConnectButton.tsx";
import IconSpaceship from "../../icons/IconSpaceship.tsx";
import { Button } from "../../ui/Button.tsx";
import { EmptySheetAlert } from "../../ui/EmptySheetAlert.tsx";
import { FiredCoin } from "./FiredCoin.tsx";
import { OverheatIndicator } from "./OverheatIndicator.tsx";
import { Ship } from "./Ship.tsx";
import { TapCounter } from "./TapCounter.tsx";
import { TapOffHeader } from "./TapOffHeader.tsx";
import useTapSocketService, { InfoResult } from "./useTapSocketService.ts";

export function TapOff() {
  const { address } = useConnectorContext();
  const { hasAccessToken } = useSession();
  const toggleOpenState = useStore((state) => state.toggleOpenState);
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
  const { socket, info, countTaps, ping, connect, token, isConnected, tap } =
    useTapSocketService();

  useEffect(() => {
    if (!socket || isConnected) return;
    connect();
  }, [token, isConnected]);

  useEffect(() => {
    if (!isConnected) return;

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
  }, [isConnected]);

  useInterval(
    () => {
      if (moment().unix() - lastTapTime < 5) return;
      setShowTapToFireNotice(true);
      setFiredCoins([]);
    },
    firing || !showTapToFireNotice ? 5000 : null,
  );

  useInterval(
    () => {
      if (!isConnected) return;
      info()
        .then((result) => {
          setTaps(result.tapCount);
          setPlayerInfo(result);
          setTapIncrement(parseInt(result.tapIncrement));
          setGunCount(result.rapidFire.active ? 5 : 1);
        })
        .catch(console.error);
    },
    isConnected ? 2000 : null,
  );

  useInterval(
    () => {
      if (!isConnected) return;
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
    isConnected ? 1000 : null,
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

    const doFire = async () => {
      try {
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

  return (
    <div className="absolute h-full w-full flex flex-col">
      {!isConnected ||
        (!playerInfo && (
          <div className="w-full h-full bg-black absolute z-20 rounded-b-2xl flex justify-center items-center">
            <IconSpaceship
              width="30"
              className="text-yellow-400 animate-spin"
            />
          </div>
        ))}

      <TapOffHeader />

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
        <div className="flex flex-col justify-between flex-1">
          <div className="flex-1 flex justify-center py-10">
            <TapCounter
              tapCountRef={tapCountRef}
              count={taps}
              rank={playerInfo?.rank || ""}
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
          />

          <div className="h-[100px] mt-16">
            <OverheatIndicator
              overheatLevel={overheatLevel}
              overheatLevelPct={overheatLevelPct}
              playerInfo={playerInfo}
            />
          </div>
        </div>
      )}

      {!address && <MainContainerConnectButton />}
    </div>
  );
}
