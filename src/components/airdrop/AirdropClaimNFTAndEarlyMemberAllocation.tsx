import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, MinusCircle } from "lucide-react";
import { useState } from "react";
import { useAirdropService } from "../../hooks/services/backend/useAirdropService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { useToast } from "../../hooks/useToast.tsx";
import { formatToMoney } from "../../libs/helpers.ts";
import { ToolTip } from "../ToolTip.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";

export function AirdropClaimNFTAndEarlyMemberAllocation() {
  const {
    claimNFTAllocation,
    claimEarlyMemberAllocation,
    claimPointsAllocation,
  } = useAirdropService();
  const user = useStore((store) => store.user);
  const { notifyError, notifySuccess } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    nft: false,
    earlyMember: false,
    point: false,
  });

  const claimNFTAllocMut = useMutation({
    mutationFn: claimNFTAllocation,
  });

  const claimEarlyMemberAllocMut = useMutation({
    mutationFn: claimEarlyMemberAllocation,
  });

  const claimPointsAllocMut = useMutation({
    mutationFn: claimPointsAllocation,
  });

  async function claimNFTAlloc() {
    try {
      setLoading({ ...loading, nft: true });
      await claimNFTAllocMut.mutateAsync();
      queryClient.refetchQueries({ queryKey: ["getUser"] });
      notifySuccess(`Successfully claimed allocation`);
      setLoading({ ...loading, nft: false });
    } catch (error) {
      setLoading({ ...loading, nft: false });
      notifyError((error as { message: string }).message);
    }
  }

  async function claimEarlyMemberAlloc() {
    try {
      setLoading({ ...loading, earlyMember: true });
      await claimEarlyMemberAllocMut.mutateAsync();
      queryClient.refetchQueries({ queryKey: ["getUser"] });
      notifySuccess(`Successfully claimed allocation`);
      setLoading({ ...loading, earlyMember: false });
    } catch (error) {
      setLoading({ ...loading, earlyMember: false });
      notifyError((error as { message: string }).message);
    }
  }

  async function claimPointsAlloc() {
    try {
      setLoading({ ...loading, point: true });
      await claimPointsAllocMut.mutateAsync();
      queryClient.refetchQueries({ queryKey: ["getUser"] });
      notifySuccess(`Successfully claimed allocation`);
      setLoading({ ...loading, point: false });
    } catch (error) {
      setLoading({ ...loading, point: false });
      notifyError((error as { message: string }).message);
    }
  }

  return (
    <div className=" border rounded-xl border-gray-800 min-h-[100px]">
      <div className="flex rounded-b-2xl justify-between items-center tracking-wider p-2 gap-3 px-4 border-b border-gray-800">
        <div className="flex items-center gap-2 font-bold text-xl font-jersey25 tracking-wider">
          <img src="/images/airdrop-icons/coin.svg" className="w-5" />
          <span>Claim $JOIN Allocation</span>
          <ToolTip
            tip="Claim $JOIN allocation for your points, NFTs, and early member role."
            className="text-gray-500 relative -left-1 mt-[2px]"
          >
            <InfoCircledIcon width="20px" />
          </ToolTip>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-gray-800/80">
        <div className="p-3 pl-4 gap-2 flex items-center tracking-wider">
          <span>
            <CheckCircle2 size="20" className="text-green-400" />
          </span>
          <span className="text-gray-400 block ">
            <div>
              You have <span className="text-gray-100">{user?.points}</span>{" "}
              point{(user?.points ?? 0) > 1 ? "s" : ""}
            </div>
            <div className="text-xs tracking-wider text-gray-600">
              Allocation:{" "}
              <span className="text-gray-100">
                {formatToMoney(user?.pointsAllocs || "0")} JOIN
              </span>
            </div>
          </span>
          <span className="flex-1 flex justify-end">
            {(user?.pointsAllocs ?? 0) > 0 && !user?.pointsAllocsClaimed && (
              <Button
                size="sm"
                className="w-[80px] hover:scale-105"
                disabled={loading.point}
                onClick={claimPointsAlloc}
              >
                {!loading.point ? (
                  "Claim"
                ) : (
                  <>
                    <IconSpinner
                      width="15px"
                      className="animate-spin"
                      fill="fill-gray-800"
                    />
                  </>
                )}
              </Button>
            )}
            {user?.pointsAllocsClaimed && (
              <span className="text-gray-400 text-sm">Claimed</span>
            )}
          </span>
        </div>

        <div className="p-3 pl-4 gap-2 flex items-center tracking-wider">
          <span>
            <CheckCircle2 size="20" className="text-green-400" />
          </span>
          <span className="text-gray-400 block ">
            <div>
              You have{" "}
              <span className="text-gray-100">{user?.nft?.count ?? 0}</span>{" "}
              DroidPD NFT{(user?.nft?.count ?? 0) > 1 ? "s" : ""}
            </div>
            <div className="text-xs tracking-wider text-gray-600">
              Allocation:{" "}
              <span className="text-gray-100">
                {(user?.nft?.count || 0) > 0 && !!user?.nft?.totalAlloc
                  ? formatToMoney(user?.nft?.totalAlloc ?? "0")
                  : "0"}{" "}
                JOIN
              </span>
            </div>
          </span>
          <span className="flex-1 flex justify-end">
            {(user?.nft?.count ?? 0) > 0 && !user?.nft?.claimed && (
              <Button
                size="sm"
                className="w-[80px] hover:scale-105"
                disabled={loading.nft}
                onClick={claimNFTAlloc}
              >
                {!loading.nft ? (
                  "Claim"
                ) : (
                  <>
                    <IconSpinner
                      width="15px"
                      className="animate-spin"
                      fill="fill-gray-800"
                    />
                  </>
                )}
              </Button>
            )}
            {user?.nft?.claimed && (
              <span className="text-gray-400 text-sm">Claimed</span>
            )}
          </span>
        </div>

        <div className="p-3 pl-4 gap-2 flex items-center tracking-wider">
          <span>
            {user?.isEarlyDiscordMember ? (
              <CheckCircle2 size="20" className="text-green-400" />
            ) : (
              <MinusCircle size="20" className="text-gray-500" />
            )}
          </span>

          <span className="text-gray-400 block ">
            <div>
              {user?.isEarlyDiscordMember ? (
                <>
                  You have <b className="text-gray-200">Early Member</b> role
                </>
              ) : (
                <>No "Early Member" role</>
              )}
            </div>
            <div className="text-xs tracking-wider text-gray-600">
              Allocation:{" "}
              <span className="text-gray-100">
                {user?.isEarlyDiscordMember
                  ? formatToMoney(user?.earlyDiscordMemberAlloc || "0")
                  : "0"}{" "}
                JOIN
              </span>
            </div>
          </span>
          <span className="flex-1 flex justify-end">
            {user?.isEarlyDiscordMember && !user?.earlyDiscordMemberClaimed && (
              <Button
                size="sm"
                className="w-[80px] hover:scale-105"
                disabled={loading.earlyMember}
                onClick={claimEarlyMemberAlloc}
              >
                {!loading.earlyMember ? (
                  "Claim"
                ) : (
                  <>
                    <IconSpinner
                      width="15px"
                      className="animate-spin"
                      fill="fill-gray-800"
                    />
                  </>
                )}
              </Button>
            )}
            {user?.earlyDiscordMemberClaimed && (
              <span className="text-gray-400 text-sm">Claimed</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
