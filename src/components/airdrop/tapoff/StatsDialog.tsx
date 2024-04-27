import { useQuery } from "@tanstack/react-query";
import { PieChart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useConnectorContext } from "../../../hooks/connectors/useConnectorContext";
import { useReferralService } from "../../../hooks/services/backend/useReferralService";
import useStore from "../../../hooks/store/useStore";
import { useToast } from "../../../hooks/useToast";
import { approxNumber, formatToMoney } from "../../../libs/helpers";
import IconCoinGold from "../../icons/IconCoinGold";
import { Button } from "../../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/Dialog";
import { InfoResult } from "./useTapSocketService";

export function StatsDialog({ playerInfo }: { playerInfo: InfoResult }) {
  const defaultRefState = {};
  const { address } = useConnectorContext();
  const user = useStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [curDetailId, setCurDetailId] = useState("");
  const { getRecentReferrees, getInfo } = useReferralService();
  const [loading, setLoading] = useState({ ...defaultRefState });
  const [done, setDone] = useState({ ...defaultRefState });
  const { simpleSuccess } = useToast();

  const recentRefsQuery = useQuery({
    queryKey: ["getRecentReferrees"],
    initialData: [],
    queryFn: getRecentReferrees,
    enabled: open,
  });

  const getReferredInfo = useQuery({
    queryKey: ["getReferredInfo", { address }],
    queryFn: getInfo,
    enabled: open,
  });

  useEffect(() => {
    if (!open || !openDetails) {
      setLoading({ ...defaultRefState });
      setDone(defaultRefState);
    }
  }, [open, openDetails]);

  if (!playerInfo) return null;

  function showDetail(id: string) {
    setCurDetailId(id);
    setOpenDetails(true);
  }

  function getMessage(platform: string) {
    switch (platform) {
      case "x":
        return `Hey Cadet! $JOIN the fight. \nCommand a ship in @0xJoint's new game.\n🎁 3K TAPs enlist reward.\n`;
      case "telegram":
        return `\nHey Cadet! $JOIN the fight. \nCommand a ship in @jointproto's new game. \n🎁 3K TAPs enlist reward.\n`;
      default:
        return "Hey Cadet! $JOIN the fight. Command a ship in https://x.com/0xJoint new game. \n🎁 3K TAPs enlist reward.\n";
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (openDetails) {
          setOpenDetails(false);
        }
      }}
    >
      <div className="flex justify-center items-center select-none">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 hover:scale-110 hover:rotate-2"
          >
            <div className="flex w-[60px] flex-col border  items-center rounded-lg px-3 py-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-yellow-500 text-black border-yellow-100/50">
              <span>
                <PieChart />
              </span>
              <span className="text-black font-jersey25 tracking-wider">
                Stats
              </span>
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 outline-none select-none sm:min-w-[425px] sm:max-w-[425px] top-[15%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b border-gray-800 space-y-0">
            <DialogTitle className="text-center  text-black font-jersey20 text-2xl tracking-wide bg-gradient-to-b from-yellow-200  to-yellow-600 rounded-t-lg py-1">
              Game Stats
            </DialogTitle>
          </DialogHeader>
          <div className="min-h-[200px]">
            <div className="px-5 pt-2 flex justify-center flex-col items-center border-b pb-5 border-gray-900">
              <span className="mt-10 text-sm text-gray-400 tracking-wider">
                Total TAP Balance
              </span>
              <div className="mt-1 flex gap-1">
                <IconCoinGold width="40" />
                <span className="text-5xl tracking-wider font-abrilFatFace uppercase">
                  {approxNumber(playerInfo.gameStats?.totalBalance, 4)}
                </span>
              </div>
            </div>

            <div className="px-5 flex justify-center flex-col items-center border-b pb-5 border-gray-900">
              <span className="mt-5 text-sm text-gray-400 tracking-wider">
                Total Shots Fired
              </span>
              <div className="mt-1 flex gap-1 tracking-wider">
                <span className="text-xl font-abrilFatFace">
                  {formatToMoney(playerInfo.gameStats.totalShots)}
                </span>
              </div>

              <span className="mt-5 text-sm text-gray-400 tracking-wider">
                Total Players
              </span>
              <div className="mt-1 flex gap-1 tracking-wider">
                <span className="text-xl font-abrilFatFace">
                  {formatToMoney(playerInfo.gameStats.totalPlayers)}
                </span>
              </div>

              <span className="mt-5 text-sm text-gray-400 tracking-wider">
                Daily Players
              </span>
              <div className="mt-1 flex gap-1 tracking-wider">
                <span className="text-xl font-abrilFatFace">
                  {formatToMoney(playerInfo.gameStats.totalPlayersLast24h)}
                </span>
              </div>

              <span className="mt-5 text-sm text-gray-400 tracking-wider">
                Online Players
              </span>
              <div className="mt-1 flex gap-1 tracking-wider">
                <span className="text-xl font-abrilFatFace">
                  {formatToMoney(playerInfo.gameStats.totalPlayersLast1min)}
                </span>
              </div>
            </div>
          </div>

          <X
            className="absolute right-0 mr-2 top-2 cursor-pointer opacity-80 hover:opacity-100 text-gray-900"
            onClick={() => {
              setOpen(false);
            }}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}
