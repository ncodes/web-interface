import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useBondCurveDistroContract from "../../hooks/services/contracts/useBondCurveTokenContract.ts";
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
import { IconX } from "../icons/IconX.tsx";
import { Button } from "../ui/Button.tsx";

const AllowWithdraw = false;

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
  } = useBondCurveDistroContract();
  const { notifyError, notifySuccess } = useToast();
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const originalClaims = [...claims];

  claims = claims.filter((claim) => {
    return !claim.claimedAt;
  });

  const sigs = claims.map((claim) => claim.signature || "");
  const nonces = claims.map((claim) => BigInt(claim.nonce));
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
      await claimMulti(sigs, claimIds, nonces, amounts);
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
            <span className="text-3xl md:text-4xl text-chinese-green select-text font-silkscreen -tracking-widest">
              {formatToHighDenom(amounts.reduce((a, b) => a + b, BigInt(0)))}
            </span>
          </div>

          <div className="w-full relative md:w-8/12 lg:w-6/12 min-h-[100px]  lg:min-h-[200px] flex flex-col justify-between bg-card-background border border-gray-900 rounded-xl mx-auto">
            <div className="p-2 space-y-2 w-full min-h-[100px]  lg:min-h-[200px]">
              {originalClaims.length == 0 && (
                <div className="flex flex-col items-center justify-center min-h-[100px]  lg:min-h-[200px] font-silkscreen text-xl">
                  <span>No Allocation Found</span>
                  <Link to="/dexdrop/buy">
                    <Button variant="link" className="text-chinese-green">
                      [Buy]
                    </Button>
                  </Link>
                </div>
              )}

              {(originalClaims || []).map((claim) => (
                <div
                  key={claim.id}
                  className="flex bg-vampire-black/90 border border-gray-800/40 pb-2 flex-col rounded-xl"
                >
                  <div className="flex justify-between p-3 pb-3 gap-4">
                    <span className="font-light text-lg">
                      <span className="font-silkscreen -tracking-widest">
                        {getClaimName(claim)}
                      </span>
                      <span className="flex font-mitr items-center gap-1 text-xs text-muted/60 flex-wrap">
                        {getClaimDescription(claim)}
                      </span>

                      {!!claim.claimedAt && (
                        <span className="flex items-center gap-1 text-xs mt-2 text-green-300 flex-wrap font-silkscreen">
                          <CheckCircle size="15" />
                          <span>Claimed</span>
                        </span>
                      )}
                    </span>
                    <ToolTip tip={formatToHighDenom(claim.amount)}>
                      <span className="text-chinese-green uppercase font-silkscreen -tracking-widest">
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

            {originalClaims.length > 0 && (
              <div className="p-2 flex flex-col gap-2">
                <Button
                  size="full"
                  onClick={handleClaim}
                  disabled={!canClaim()}
                >
                  {!loading && "Claim"}
                  {loading && (
                    <Loader2 className="animate-spin text-black w-5 h-5" />
                  )}
                </Button>

                {hasClaimed() && (
                  <Link
                    to={`https://twitter.com/intent/tweet?url=https%3A%2F%2Fjntl.ink%2Fdexdrop&via=0xJoint&text=I%20just%20claimed%20${formatToHighDenom(totalClaimedQry.data || BigInt(0))}%20JOIN%20tokens%20from%20Joint%27s%20DexDrop.%20Have%20you%20used%20Uniswap%20or%20PancakeSwap%20recently%3F%20Check%20eligibility%20to%20claim%20yours.%20&hashtags=DexDrop%2CAirdrop%2CJoint%2CDEX`}
                  >
                    <Button
                      size="full"
                      className="bg-blue-400/90 hover:bg-blue-400"
                    >
                      <span className="flex items-center gap-1">
                        <IconX className="w-5 h-5" />
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
                    <span className="font-medium text-gray-200 select-text font-silkscreen -tracking-widest">
                      {formatToHighDenom(unclaimedBalQry.data || BigInt(0))}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-5 pt-0">
        <div className="w-full p-7 md:w-8/12 lg:w-6/12 h-[40px] bg-card-background border border-gray-900 rounded-xl mx-auto flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <span className="flex items-center gap-1 text-xs text-gray-400 tracking-wide text-center">
              <span>Total Claimed</span>
              <ToolTip tip="Total amount of JOIN claimed">
                <QuestionMarkCircledIcon className="w-4 h-4 text-gray-500" />
              </ToolTip>
            </span>
            <span className="font-silkscreen -tracking-widest">
              {formatToHighDenom(totalClaimedQry.data || BigInt(0))}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function getClaimName(claim: { claimId: number }) {
  switch (claim.claimId) {
    case 0:
      return "DEX User";
    case 1:
      return "Point Holder";
    case 2:
      return "TJOIN Holder";
    case 3:
      return "Community Partner";
    default:
      return "Unknown";
  }
}

function getClaimDescription(claim: { claimId: number }) {
  switch (claim.claimId) {
    case 0:
      return "Users of Uniswap between Jan 1st - Nov 10th 2024";
    case 1:
      return "Joint's points program participantion";
    case 2:
      return "Early TJOIN purchaser";
    case 3:
      return "Joint's community partner";
    default:
      return "Unknown";
  }
}

function approxAmount(amount: string) {
  if (toDec(amount).lt(999999)) return formatToMoney(amount);
  return approxNumber(amount);
}
