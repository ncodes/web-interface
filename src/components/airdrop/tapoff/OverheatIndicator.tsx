import IconFire from "../../icons/IconFire.tsx";
import { Progress } from "../../ui/progress.tsx";
import { InfoResult } from "./useTapSocketService.ts";

export function OverheatIndicator({
  overheatLevel,
  overheatLevelPct,
  playerInfo,
}: {
  overheatLevel: number;
  overheatLevelPct: number;
  playerInfo?: InfoResult;
}) {
  return (
    <div className="flex flex-col items-center gap-3 w-full px-10 mb-5">
      <span className="flex items-center gap-1">
        <IconFire className="w-5 h-5 text-yellow-500" />
        <span className="font-light font-abrilFatFace tracking-wider text-sm text-gray-300">
          {Math.floor(overheatLevel || 0)}/{" "}
          <span className="text-xs">{playerInfo?.maxOverheatLvl || 0}</span>
        </span>
      </span>
      <div className="block w-full bg-gray-900 border border-gray-800 p-1 rounded-full bg-gradient-to-b from-gray-900 to-gray-700">
        <Progress
          value={overheatLevelPct}
          className="w-full h-4 
      bg-gray-900
      [&_.indicator]:border-t [&_.indicator]:border-yellow-100 [&_.indicator]:bg-gradient-to-b [&_.indicator]:from-amber-300 [&_.indicator]:via-yellow-300 [&_.indicator]:to-yellow-600 [&_.indicator]:rounded-full"
        />
      </div>
    </div>
  );
}
