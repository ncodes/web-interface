import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CoinsIcon } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { formatToHighDenom } from "../../libs/helpers.ts";
import { CountDown } from "../Countdown.tsx";
import { ToolTip } from "../ToolTip.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";

export function FollowRequest({ claims }: { claims: MerkleClaim[] }) {
  const { activateClaims } = useUserService();
  const activateClaimsMut = useMutation({
    mutationFn: activateClaims,
  });
  const [clicked, setClicked] = useState(false);
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);
  const originalClaims = [...claims];
  claims = claims.filter((claim) => {
    return !claim.claimedAt;
  });

  const amounts = claims.map((claim) => BigInt(claim.amount));

  async function doFollow() {
    setClicked(true);
    await activateClaimsMut.mutateAsync();
  }

  async function onDone() {
    queryClient.invalidateQueries({ queryKey: ["getUser"] });
  }

  const hasDexUserClaim = originalClaims.some(
    (claim) => claim.name.startsWith("dex_user") && !claim.claimedAt,
  );

  const hasPointClaim = originalClaims.some(
    (claim) => claim.name.startsWith("point") && !claim.claimedAt,
  );

  const requireSwap = (hasDexUserClaim || hasPointClaim) && !user?.hasSwapped;

  return (
    <div className="px-5 pb-5 py-4 space-y-4 tracking-wider">
      <div className="w-full md:w-8/12 lg:w-6/12 py-2 pb-3 bg-card-background border border-gray-900 rounded-xl mx-auto flex flex-col items-center justify-center">
        <span className="flex items-center gap-1 md:text-xl tracking-wider text-gray-100">
          <span className="text-md font-silkscreen">Allocation</span>
          <ToolTip
            tip="Total tokens claimable after tasks completion."
            className="text-gray-400"
          >
            <QuestionMarkCircledIcon className="w-4 h-4" />
          </ToolTip>
        </span>
        <span className="text-3xl md:text-4xl text-chinese-green select-text font-silkscreen -tracking-widest">
          {formatToHighDenom(amounts.reduce((a, b) => a + b, BigInt(0)))}
        </span>
      </div>

      <div className="w-full md:w-8/12 lg:w-6/12 py-2 pb-3 rounded-xl mx-auto flex flex-col items-center justify-center font-extralight text-gray-400 text-sm border border-gray-900">
        Complete the tasks below to claim
      </div>

      <div className="w-full md:w-8/12 lg:w-6/12  bg-card-background border border-gray-900 rounded-xl mx-auto flex flex-col items-center justify-center">
        <Link
          to="https://x.com/0xJoint"
          className="w-full"
          target="_blank"
          onClick={doFollow}
        >
          <Button
            variant="ghost"
            size="full"
            className="flex-col hover:bg-transparent text-gray-300 rounded-xl hover:bg-[#1DA1F2] hover:text-gray-100 gap-1 py-3 h-auto font-silkscreen items-center"
          >
            <div className="flex items-center gap-2">
              <img
                src="/images/airdrop-icons/twitter.svg"
                className="w-3 h-3"
              />
              FOLLOW @0xJoint
            </div>

            {clicked &&
              (!user?.claimActivatedAt ||
                moment(user?.claimActivatedAt).isAfter(moment())) && (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <span>Verifying</span>
                  <span>
                    {user?.claimActivatedAt && (
                      <CountDown
                        isoDate={user?.claimActivatedAt ?? ""}
                        className="text-xs"
                        onDone={onDone}
                      />
                    )}
                  </span>
                  <IconSpinner className="w-3 h-3 animate-spin" />
                </span>
              )}
          </Button>
        </Link>
      </div>
      <div className="w-full md:w-8/12 lg:w-6/12  bg-card-background border border-gray-900 rounded-xl mx-auto flex flex-col items-center justify-center">
        <Link
          to="https://discord.gg/jfAPEjQ3HD"
          className="w-full"
          target="_blank"
        >
          <Button
            variant="ghost"
            size="full"
            className="flex-col hover:bg-transparent text-gray-300 rounded-xl hover:bg-[#7289DA] hover:text-gray-100 gap-1 py-3 h-auto font-silkscreen items-center"
          >
            <div className="flex items-center gap-2">
              <img
                src="/images/airdrop-icons/discord.svg"
                className="w-4 h-4"
              />
              JOIN US ON DISCORD
            </div>
          </Button>
        </Link>
      </div>

      {requireSwap && (
        <div className="w-full md:w-8/12 lg:w-6/12  bg-card-background border border-gray-900 rounded-xl mx-auto flex flex-col items-center justify-center">
          <Link
            to="/liquidity/0xEc2b7C1C114c5e74176E53c27156BCf6f09efF97/0xAEA70653A241c7a02BB3624935c51f052390A077/0"
            className="w-full"
            target="_blank"
          >
            <Button
              variant="ghost"
              size="full"
              className="flex-col hover:bg-transparent text-gray-300 rounded-xl hover:bg-chinese-green hover:text-gray-900 gap-1 py-3 h-auto font-silkscreen items-center"
            >
              <div className="flex items-center gap-2">
                <CoinsIcon className="w-4 h-4" />
                COMPLETE ONE (1) SWAP
              </div>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
