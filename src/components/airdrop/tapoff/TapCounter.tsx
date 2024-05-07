import { ToolTip } from "../../ToolTip";
import IconCoinGold from "../../icons/IconCoinGold";
import IconInfoCircle from "../../icons/IconInfoCircle";
import { PlayerRank } from "./PlayerRank";
import { RankInfo } from "./useTapSocketService";

export function TapCounter({
  tapCountRef,
  count,
  rank,
  rankInfo,
}: {
  tapCountRef: any;
  count: string;
  rank: string;
  rankInfo?: RankInfo;
}) {
  return (
    <div className="select-none">
      {/* Title */}
      <div className="flex gap-1 items-center justify-center font-jersey20">
        <IconCoinGold width="20" />
        <span className="text-gray-300">Your Taps</span>
        <ToolTip
          className="opacity-40 hover:opacity-100 transition-all duration-500"
          tip={<>The number of taps you have created.</>}
        >
          <IconInfoCircle />
        </ToolTip>
      </div>
      {/* End Title */}

      {/* Count */}
      <div
        className="flex justify-center hover:scale-105 transition-all duration-500  md:h-[110px] font-jersey25 text-7xl md:text-9xl bg-gradient-to-r
   from-amber-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text
   shadow-2xl"
        ref={tapCountRef}
      >
        {count}
      </div>
      {/* End Count */}

      {/* Rank */}
      {rank && rankInfo && (
        <PlayerRank rank={rank} tapCount={count} rankInfo={rankInfo} />
      )}
      {/* End Rank */}
    </div>
  );
}
