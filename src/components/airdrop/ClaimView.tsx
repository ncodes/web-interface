import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Loader2, ShoppingCart, Twitter } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useBondCurveTokenContract from "../../hooks/services/contracts/useBondCurveTokenContract.ts";
import { useToast } from "../../hooks/useToast.tsx";
import {
  approxNumber,
  delay,
  formatToHighDenom,
  formatToMoney,
  logError,
  toDec,
  toHD,
} from "../../libs/helpers.ts";
import { ToolTip } from "../ToolTip.tsx";
import { Button } from "../ui/Button.tsx";

const AllowWithdraw = true;

export function ClaimView({
  claims,
  address,
}: {
  claims: MerkleClaim[];
  address: string;
}) {
  const {
    claimMulti,
    claims: claimsBalanceOf,
    withdrawClaim,
    getTotalClaimed,
    humanizeErrors,
  } = useBondCurveTokenContract();
  const { notifyError, notifySuccess } = useToast();
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const originalClaims = [...claims];

  claims = claims.filter((claim) => {
    return !claim.claimedAt;
  });

  const proofs = claims.map((claim) => JSON.parse(claim.proof || "[]"));
  const claimIds = claims.map((claim) => BigInt(claim.claimId));
  const amounts = claims.map((claim) => BigInt(claim.amount));
  const queryClient = useQueryClient();

  const unclaimedBalQry = useQuery({
    queryKey: ["getUnclaimedBalance", { address }],
    queryFn: () => claimsBalanceOf(address),
    enabled: !!address,
  });

  const totalClaimedQry = useQuery({
    queryKey: ["getTotalClaimed"],
    queryFn: () => getTotalClaimed(),
  });

  async function handleClaim() {
    try {
      setLoading(true);
      await claimMulti(proofs, address, claimIds, amounts);
      await queryClient.refetchQueries({ queryKey: ["getClaims"] });
      await delay(5000);
      notifySuccess("Claim successful");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const msg = humanizeErrors(error);
      notifyError(msg, { duration: 5000 });
      logError(error);
    }
  }

  async function handleWithdraw() {
    try {
      setWithdrawing(true);
      await withdrawClaim();
      await queryClient.refetchQueries({ queryKey: ["getClaims"] });
      await queryClient.refetchQueries({ queryKey: ["getUnclaimedBalance"] });
      await delay(5000);
      setWithdrawing(false);
      notifySuccess("Withdraw successful");
    } catch (error) {
      setWithdrawing(false);
      const msg = humanizeErrors(error);
      notifyError(msg, { duration: 5000 });
      logError(error);
    }
  }

  function canClaim() {
    if (loading) return false;
    if (claims.length === 0) return false;
    if (toDec(amounts.reduce((a, b) => a + b, BigInt(0))).eq(0)) return false;
    return true;
  }

  function canWithdraw() {
    if (withdrawing) return false;
    return toDec(unclaimedBalQry.data || BigInt(0)).gt(0) && AllowWithdraw;
  }

  function hasClaimed() {
    return originalClaims.some((claim) => !!claim.claimedAt);
  }

  return (
    <>
      {address && (
        <div className="px-5 pb-5 pt-4 space-y-4 tracking-wider">
          <div className="w-full md:w-8/12 lg:w-6/12 h-[100px] bg-card-background border border-gray-900 rounded-xl mx-auto flex flex-col items-center justify-center">
            <span className="flex items-center gap-1 md:text-xl tracking-wider text-gray-100">
              <span className="text-md">JOIN</span>
              <ToolTip
                tip="Total unclaimed JOIN tokens"
                className="text-gray-400"
              >
                <QuestionMarkCircledIcon className="w-4 h-4" />
              </ToolTip>
            </span>
            <span className="text-3xl md:text-4xl text-chinese-green select-text">
              {formatToHighDenom(amounts.reduce((a, b) => a + b, BigInt(0)))}
            </span>
          </div>

          <div className="w-full md:w-8/12 lg:w-6/12 min-h-[300px] flex flex-col justify-between bg-card-background border border-gray-900 rounded-xl mx-auto">
            <div className="p-2 space-y-2 ">
              {(originalClaims || []).map((claim) => (
                <div
                  key={claim.id}
                  className="flex bg-vampire-black/30 border border-gray-800/40 pb-2 flex-col rounded-xl"
                >
                  <div className="flex justify-between p-3 pb-3 gap-4">
                    <span className="font-light text-lg font-jersey25">
                      {getClaimName(claim)}

                      {!!claim.claimedAt && (
                        <span className="flex font-mitr items-center gap-1 text-xs mt-2 text-green-300 flex-wrap">
                          <CheckCircle size="15" />
                          <span>Claimed</span>
                        </span>
                      )}
                    </span>
                    <ToolTip tip={formatToHighDenom(claim.amount)}>
                      <span className="text-chinese-green uppercase">
                        {approxAmount(toHD(claim.amount))}
                      </span>
                    </ToolTip>
                  </div>
                  {!!claim.claimedAt && claim.claimId == 0 && (
                    <span className="flex items-center justify-between gap-1 mx-2 mr-0 font-bold text-sm text-gray-300 font-jersey20 bg-gray-800/50 p-1 px-2 rounded-lg">
                      <span className="flex items-center gap-1">
                        <ShoppingCart
                          size="14"
                          className="text-chinese-green"
                        />{" "}
                        Buy from the liquidity market to reset
                      </span>

                      <Link to="/dexdrop/buy">
                        <Button
                          variant="link"
                          className="h-auto py-0 text-white bg-gray-600 hover:bg-gray-700"
                        >
                          Buy
                        </Button>
                      </Link>
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="p-2 flex flex-col gap-2">
              <Button size="full" onClick={handleClaim} disabled={!canClaim()}>
                {!loading && "Claim"}
                {loading && (
                  <Loader2 className="animate-spin text-black w-5 h-5" />
                )}
              </Button>

              {hasClaimed() && (
                <Link to="https://twitter.com/intent/tweet?url=https%3A%2F%2Fjntl.ink%2Fdexdrop&via=0xJoint&text=I%20just%20claimed%20100%20JOIN%20tokens%20from%20Joint%27s%20DexDrop.%20Have%20you%20used%20Uniswap%20on%20Ethereum%20recently%3F%20Check%20and%20claim%20your%20allocation.%20&hashtags=DexDrop%2CAirdrop%2CJoint%2CDEX">
                  <Button size="full" className="!bg-blue-400">
                    <span className="flex items-center gap-1">
                      <Twitter className="w-5 h-5" />
                      <span>Share</span>
                    </span>
                  </Button>
                </Link>
              )}

              <div className="flex flex-col gap-2 border-t border-gray-800/80 pt-1 mt-2">
                <span className="text-xs text-gray-400 font-extralight block text-center">
                  Available after the liquidity market closes.
                </span>
                <Button
                  variant="secondary"
                  disabled={!canWithdraw()}
                  size="full"
                  onClick={handleWithdraw}
                >
                  {!withdrawing && "Withdraw"}
                  {withdrawing && (
                    <Loader2 className="animate-spin text-black w-5 h-5" />
                  )}
                </Button>
                <span className="text-xs text-gray-500 font-extralight block text-center">
                  Withdrawable:{" "}
                  <span className="font-medium text-gray-200 select-text">
                    {formatToHighDenom(unclaimedBalQry.data || BigInt(0))}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="p-5 pt-0">
        <div className="w-full p-7 md:w-8/12 lg:w-6/12 h-[40px] bg-card-background border border-gray-900 rounded-xl mx-auto flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-gray-400 tracking-wide block text-center">
              Total Claimed
            </span>
            <span>{formatToHighDenom(totalClaimedQry.data || BigInt(0))}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function getClaimName(claim: { claimId: number; name: string }) {
  switch (claim.claimId) {
    case 0:
      if (claim.name.includes("uni_user")) return "Uniswap User";
      return "Testnet, Trialnet and TapWar participation";
    case 1:
      return "TJOIN holder";
    case 2:
      return "Community Partner";
    default:
      return "Unknown";
  }
}

function approxAmount(amount: string) {
  if (toDec(amount).lt(999999)) return formatToMoney(amount);
  return approxNumber(amount);
}
