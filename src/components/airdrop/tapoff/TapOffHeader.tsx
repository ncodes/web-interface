import { useRef } from "react";
import { useConnectorContext } from "../../../hooks/connectors/useConnectorContext.tsx";
import { AudioState } from "../../../hooks/useGameAudioPlayer.ts";
import { useSession } from "../../../hooks/useSession.ts";
import { IconSoundOff } from "../../icons/IconSoundOff.tsx";
import { IconSoundOn } from "../../icons/IconSoundOn.tsx";
import { Button } from "../../ui/Button.tsx";
import { BoostDialog } from "./BoostDialog.tsx";
import { RefDialog } from "./RefDialog.tsx";
import { StatsDialog } from "./StatsDialog.tsx";
import { TaskDialog } from "./TaskDialog.tsx";
import { InfoResult } from "./useTapSocketService.ts";

export function TapOffHeader({
  playerInfo,
  toggleAudioPause,
  audioState,
}: {
  playerInfo?: InfoResult;
  toggleAudioPause: () => void;
  audioState?: AudioState;
}) {
  const { address } = useConnectorContext();
  const { hasAccessToken } = useSession();
  const audioControlBtn = useRef<HTMLButtonElement>(null);

  return (
    <div className="border-b bg-airdropHeader2 md:bg-airdropHeader3 bg-right-bottom lg:bg-right lg:bg-airdropHeader bg-cover border-gray-900 flex flex-col md:flex-row justify-between items-center md:items-start p-5 py-3">
      <span className="hidden md:flex justify-center items-center h-full text-3xl tracking-wider font-semibold font-jersey10 ml-2">
        TapWar
      </span>

      {address && hasAccessToken(address) && playerInfo && (
        <div>
          <div className="flex gap-5 xs:gap-3 ">
            <RefDialog playerInfo={playerInfo} />

            <TaskDialog playerInfo={playerInfo} />

            <BoostDialog playerInfo={playerInfo} />

            <StatsDialog playerInfo={playerInfo} />
            <Button
              ref={audioControlBtn}
              variant="ghost"
              className="hover:bg-transparent h-auto p-0 hover:scale-110 hover:rotate-2 hidden xs:inline-block"
              onClick={() => {
                toggleAudioPause();
              }}
            >
              <div className="flex w-[60px] flex-col border  items-center rounded-lg px-3 py-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-yellow-500 text-black border-yellow-100/50">
                <span>
                  {audioState == "playing" && (
                    <IconSoundOff className="w-[25px]" />
                  )}
                  {audioState != "playing" && (
                    <IconSoundOn className="w-[25px]" />
                  )}
                </span>
                <span className="text-black font-jersey25 tracking-wider">
                  {audioState == "playing" && "OFF"}
                  {audioState != "playing" && "ON"}
                </span>
              </div>
            </Button>
          </div>
          <Button
            ref={audioControlBtn}
            variant="link"
            className="absolute mt-4 right-0 xs:hidden"
            onClick={() => {
              toggleAudioPause();
            }}
          >
            <div className="flex gap-2 border text-gray-900 bg-yellow-500 border-yellow-500  items-center rounded-lg px-3 py-1 ">
              <span>
                {audioState == "playing" && (
                  <IconSoundOff className="w-[25px]" />
                )}
                {audioState != "playing" && (
                  <IconSoundOn className="w-[25px]" />
                )}
              </span>
              <span className=" font-jersey25 tracking-wider text-gray-900">
                {audioState == "playing" && "OFF"}
                {audioState != "playing" && "ON"}
              </span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
