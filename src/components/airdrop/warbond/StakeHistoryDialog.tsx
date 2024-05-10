import { X } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { BondSpends } from "../../../hooks/services/backend/useAirdropService";
import { formatToHighDenom } from "../../../libs/helpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/Dialog";

export function StakeHistoryDialog({
  spends,
  curBattleId,
}: {
  spends: BondSpends;
  curBattleId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      modal={true}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <div className="flex justify-center items-center select-none">
        <DialogTrigger asChild>
          <a
            href="#"
            className="tracking-wide text-gray-500 hover:text-gray-200"
          >
            Stake History
          </a>
        </DialogTrigger>

        <DialogContent className="p-0 outline-none select-none w-[310px] xxs:w-[350px] md:w-auto lg:w-[425px] top-[15%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b border-gray-800 space-y-0">
            <DialogTitle className="text-center  text-black font-jersey20 text-2xl tracking-wide bg-gradient-to-b from-yellow-200  to-yellow-600 rounded-t-lg py-1">
              Stake History
            </DialogTitle>
          </DialogHeader>
          <div className="min-h-[200px] max-h-[300px] overflow-auto divide-y divide-gray-900">
            {spends.map((spend, index) => (
              <div key={index} className="flex gap-2 p-3">
                <img
                  src="/images/game/war_bond_coin.svg"
                  className="w-[20px]"
                />
                <div className="text-sm tracking-wider">
                  <div>
                    <span className="font-jersey25">{spend.amount} $BOND</span>{" "}
                    spent
                  </div>
                  <div className="font-jersey25 flex gap-3">
                    <span>
                      <span className="text-gray-400">Side:</span>{" "}
                      <span className="capitalize">{spend.side}</span>
                    </span>
                    <span>
                      <span className="text-gray-400">$JOIN:</span>{" "}
                      {curBattleId === spend.battleId
                        ? "Pending"
                        : formatToHighDenom(spend.allocation, 18)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 text-right text-xs text-gray-500 tracking-wider">
                  {moment(spend.createdAt).fromNow()}
                </div>
              </div>
            ))}
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
