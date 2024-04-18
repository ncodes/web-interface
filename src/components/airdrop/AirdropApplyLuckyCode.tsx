import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useAirdropService } from "../../hooks/services/backend/useAirdropService.ts";
import { useToast } from "../../hooks/useToast.tsx";
import { formatToMoney, isZero, toHD } from "../../libs/helpers.ts";
import Input2 from "../Input2.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { Button } from "../ui/Button.tsx";

export function AirdropApplyLuckyCode() {
  const { applyLuckyCode } = useAirdropService();
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("0");
  const { notifyError, notifySuccess } = useToast();
  const queryClient = useQueryClient();

  const applyLuckyCodeMut = useMutation({
    mutationFn: applyLuckyCode,
  });

  async function apply() {
    try {
      const amount = await applyLuckyCodeMut.mutateAsync(code);
      setAmount(toHD(amount, 18));
      await queryClient.refetchQueries({ queryKey: ["getUser"] });
      notifySuccess(`Successfully applied code`);
      setCode("");
    } catch (error) {
      notifyError((error as { message: string }).message);
    }
  }

  return (
    <div className=" border rounded-xl border-gray-800 min-h-[100px]">
      <div className="flex rounded-b-2xl justify-between items-center tracking-wider p-2 gap-3 px-4 border-b border-gray-800">
        <div className="flex items-center gap-2 font-bold">
          <img src="/images/airdrop-icons/chip.svg" className="w-5" />
          <span>Apply Lucky Code</span>
          <ToolTip
            tip="Claim $JOIN allocation by applying your lucky code"
            className="text-gray-500 relative -left-1 mt-[2px]"
          >
            <InfoCircledIcon width="20px" />
          </ToolTip>
        </div>
      </div>
      {!isZero(amount) && (
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-green-400 border-b border-gray-800">
          <CheckCircle2 size="15" />{" "}
          <span>{formatToMoney(amount)} JOIN allocated</span>
        </div>
      )}
      <div className="p-3">
        <Input2
          placeholder="Enter your luck code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          containerClassName="!rounded-full"
          className="pt-2 pl-5 md:!text-lg"
          afterInput={
            <Button
              size="lg"
              className="mr-1 md:text-lg"
              disabled={applyLuckyCodeMut.isPending || !code}
              onClick={() => {
                apply();
              }}
            >
              Apply
            </Button>
          }
        />
      </div>
    </div>
  );
}
