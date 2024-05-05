import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { useAirdropService } from "../../../hooks/services/backend/useAirdropService";
import { useToast } from "../../../hooks/useToast";
import { logError, toDec } from "../../../libs/helpers";
import Input2 from "../../Input2";
import IconSpinner from "../../icons/IconSpinner";
import { Button } from "../../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/Dialog";

export function StakeDialog({
  side,
  balance,
  battleId,
}: {
  side: "Droid" | "Bandit";
  balance: string;
  battleId: string;
}) {
  const { stakeBond } = useAirdropService();
  const [value, setValue] = useState(balance);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { notifyError, notifySuccess } = useToast();
  const queryClient = useQueryClient();

  const stakeBondMut = useMutation({
    mutationFn: stakeBond,
  });

  async function doStake() {
    setLoading(true);
    try {
      await stakeBondMut.mutateAsync({
        battleId,
        side: side.toLowerCase(),
        amount: value,
      });
      await queryClient.refetchQueries({ queryKey: ["getBondBalance"] });
      notifySuccess("Action was successful!", { label: "Success" });
      setOpen(false);
      setValue(balance);
    } catch (error) {
      notifyError((error as { message: string }).message, { label: "Error" });
      logError("doStake:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      modal={true}
      onOpenChange={(open) => {
        if (!open) {
          setValue(balance);
        }
        setOpen(open);
      }}
    >
      <div className="flex justify-center items-center select-none">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="full"
            rounded="xl"
            className="p-2 h-auto bg-gradient-to-b text-4xl text-gray-950 from-yellow-300 to-yellow-500 hover:scale-105 transition-all duration-500"
          >
            Stake Bond
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 outline-none select-none w-[310px] xxs:w-[350px] md:w-auto lg:w-[425px] top-[15%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b border-gray-800 space-y-0">
            <DialogTitle className="text-center  text-black font-jersey20 text-2xl tracking-wide bg-gradient-to-b from-yellow-200  to-yellow-600 rounded-t-lg py-1">
              Stake Bond
            </DialogTitle>
          </DialogHeader>
          <div className="min-h-[200px]">
            <div className="px-5 pt-3 pb-0 font-light text-sm text-gray-200 tracking-wider">
              By staking your $BOND on the {side} side, you will share the $JOIN
              allocation received by the {side} side at the end of the battle.
              <br />
              <br />
              Your share will be determined by the amount of bond you stake
              relative to the total bond staked and the duration you have staked
              your bond. The higher and older your stake is, the more your
              allocation.
            </div>
            <div className="px-5 mt-5 pt-3 border-t border-gray-900">
              <span className="mb-2 block text-gray-400">How much?</span>
              <Input2
                type="number"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                placeholder="0.0"
                focusedClassName="ring-yellow-500 border-yellow-500"
                afterInput={
                  <Button
                    variant="link"
                    className="py-0 h-auto text-yellow-300 text-xs"
                    onClick={() => {
                      setValue(balance);
                    }}
                  >
                    MAX
                  </Button>
                }
              />
            </div>
            <div className="px-5 pb-5">
              <Button
                className="w-full text-lg bg-gradient-to-b mt-3 from-yellow-300 to-yellow-600 transition-all duration-200 hover:scale-[1.02]"
                disabled={
                  toDec(balance).isZero() ||
                  toDec(value || "0").lte(0) ||
                  toDec(value || "0").gt(balance) ||
                  loading
                }
                onClick={() => {
                  if (confirm("Are you sure you want to stake?")) {
                    doStake();
                  }
                }}
              >
                {!loading && "Stake"}
                {loading && (
                  <IconSpinner className="animate-spin w-[20px] text-gray-800" />
                )}
              </Button>
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
