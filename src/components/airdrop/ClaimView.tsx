import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useBondCurveDistroContract from "../../hooks/services/contracts/useBondCurveTokenContract.ts";
import useStore from "../../hooks/store/useStore.ts";
import { useSession } from "../../hooks/useSession.ts";
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
import IconTask from "../icons/IconTask.tsx";
import { IconX } from "../icons/IconX.tsx";
import { Button } from "../ui/Button.tsx";
import { BuyBanner } from "./BuyBanner.tsx";

// const AllowWithdraw = false;
const AllowClaim = true;

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
    getTotalClaimed,
    humanizeErrors,
  } = useBondCurveDistroContract();
  const { notifyError, notifySuccess } = useToast();
  const user = useStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  // const [_withdrawing, setWithdrawing] = useState(false);
  const originalClaims = [...claims];
  const token = useSession();

  const unclaimedClaims = claims.filter((claim) => !claim.claimedAt);

  claims = claims.filter((claim) => {
    return !claim.claimedAt && !!claim.signature;
  });

  const sigs = claims.map((claim) => claim.signature || "");
  const nonces = claims.map((claim) => BigInt(claim.nonce));
  const claimIds = claims.map((claim) => BigInt(claim.claimId));
  const amounts = unclaimedClaims.map((claim) => BigInt(claim.amount));
  const amountsWithSig = claims.map((claim) => BigInt(claim.amount));
  const queryClient = useQueryClient();

  const unclaimedBalQry = useQuery({
    queryKey: ["getUnclaimedBalance", { address }],
    queryFn: () => claimsBalanceOf(address),
    enabled: !!address,
    refetchInterval: 60000,
  });

  const totalClaimedQry = useQuery({
    queryKey: ["getTotalClaimed"],
    queryFn: () => getTotalClaimed(),
    refetchInterval: 60000,
  });

  async function handleClaim() {
    try {
      setLoading(true);
      await claimMulti(sigs, claimIds, nonces, amountsWithSig);
      await queryClient.invalidateQueries({
        queryKey: ["getClaims", { address }],
      });
      await queryClient.invalidateQueries({
        queryKey: ["getUnclaimedBalance"],
      });
      await queryClient.invalidateQueries({ queryKey: ["getTotalClaimed"] });
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

  // async function handleWithdraw() {
  //   try {
  //     setWithdrawing(true);
  //     await withdrawClaim();
  //     await queryClient.refetchQueries({ queryKey: ["getClaims"] });
  //     await queryClient.refetchQueries({ queryKey: ["getUnclaimedBalance"] });
  //     await queryClient.refetchQueries({ queryKey: ["getTotalClaimed"] });
  //     await delay(5000);
  //     setWithdrawing(false);
  //     notifySuccess("Withdraw successful");
  //   } catch (error) {
  //     setWithdrawing(false);
  //     const msg = humanizeErrors(error);
  //     notifyError(msg, { duration: 5000 });
  //     logError(error);
  //   }
  // }

  function canClaim() {
    if (loading || !AllowClaim) return false;
    if (claims.length === 0) return false;
    if (toDec(amounts.reduce((a, b) => a + b, BigInt(0))).eq(0)) return false;
    return true;
  }

  // function canWithdraw() {
  // if (withdrawing) return false;
  // return toDec(unclaimedBalQry.data || BigInt(0)).gt(0) && AllowWithdraw;
  // }

  function hasClaimed() {
    return originalClaims.some((claim) => !!claim.claimedAt);
  }

  const hasDexUserClaim = originalClaims.some(
    (claim) => claim.name.startsWith("dex_user") && !claim.claimedAt,
  );

  const hasPointClaim = originalClaims.some(
    (claim) => claim.name.startsWith("point") && !claim.claimedAt,
  );

  const hasNftClaim = originalClaims.some(
    (claim) => claim.name.startsWith("nft") && !claim.claimedAt,
  );

  const requireSwap =
    (hasDexUserClaim || hasPointClaim || hasNftClaim) && !user?.hasSwapped;

  const hasClaimedAll =
    originalClaims.length > 0 &&
    originalClaims.every((claim) => !!claim.claimedAt);

  return (
    <>
      <BuyBanner />
      {!!address && !!token && (
        <div className="px-5 pb-5 pt-4 space-y-4 tracking-wider">
          {!hasClaimedAll && (
            <>
              <div className="w-full md:w-8/12 lg:w-6/12 py-2 bg-card-background border border-gray-900 rounded-xl mx-auto flex flex-col items-center justify-center">
                <span className="flex items-center gap-1 md:text-xl tracking-wider text-gray-100">
                  <span className="text-md font-silkscreen -tracking-widest">
                    YOUR ALLOCATION
                  </span>
                  <ToolTip
                    tip="Total unclaimed JOIN allocations"
                    className="text-gray-400"
                  >
                    <QuestionMarkCircledIcon className="w-4 h-4" />
                  </ToolTip>
                </span>
                <span className="text-3xl md:text-4xl text-chinese-green select-text font-silkscreen -tracking-widest">
                  {formatToHighDenom(
                    amounts.reduce((a, b) => a + b, BigInt(0)),
                  )}
                </span>

                {requireSwap && (
                  <div className="flex border-t border-gray-800/80 pt-2 w-full justify-center items-center gap-1 text-xs mt-4 text-yellow-500 flex-wrap font-silkscreen">
                    <IconTask className="w-4 h-4" />
                    <span>Complete one swap to claim</span>:{" "}
                    <a
                      href="/liquidity/0xEc2b7C1C114c5e74176E53c27156BCf6f09efF97/0xAEA70653A241c7a02BB3624935c51f052390A077/0"
                      className="text-chinese-green/90 hover:text-chinese-green"
                    >
                      [SWAP NOW]
                    </a>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="w-full relative md:w-8/12 lg:w-6/12 min-h-[100px]  lg:min-h-[200px] flex flex-col justify-between bg-card-background border border-gray-900 rounded-xl mx-auto">
            <div className="p-2 space-y-2 w-full min-h-[100px]  lg:min-h-[200px]">
              {originalClaims.length == 0 && (
                <div className="flex flex-col items-center justify-center min-h-[100px]  lg:min-h-[200px] font-silkscreen text-xl">
                  <span className="text-xs px-10 text-center w-full gap-1.5 mb-3">
                    You currently do not have a DEXDROP allocation. You can get
                    JOIN allocation by swapping on Joint. More swaps = more
                    JOIN. <br />
                    <span className="text-xs text-muted/60">
                      (TGE COMING SOON)
                    </span>
                  </span>
                  {/* <span className="text-xs w-full flex justify-center items-center gap-1.5"> */}
                  {/* <span>JOIN The</span> <b className="">Swap-A-Thon</b> */}
                  {/* </span> */}
                  {/* <Link to="/liquidity/0xEc2b7C1C114c5e74176E53c27156BCf6f09efF97/0xAEA70653A241c7a02BB3624935c51f052390A077/0">
                    <Button variant="link" className="text-chinese-green">
                      [1 Swap {">="} 1,500 JOIN]
                    </Button>
                  </Link> */}
                  <span className="flex flex-col mt-2 items-center gap-1 font-satoshi text-xs text-gray-400">
                    {/* <span>More swaps = more JOIN</span>
                    <span>High swap value = more JOIN</span> */}
                    <span className="font-silkscreen mt-1 text-lg">
                      <Link
                        to="/liquidity/0xEc2b7C1C114c5e74176E53c27156BCf6f09efF97/0xAEA70653A241c7a02BB3624935c51f052390A077/0"
                        className="text-chinese-green/90 hover:text-chinese-green"
                      >
                        {">>"} SWAP NOW {"<<"}
                      </Link>
                    </span>
                  </span>
                </div>
              )}

              {(originalClaims || []).map((claim) => (
                <div
                  key={claim.id}
                  className="flex bg-vampire-black/90 border border-gray-800/50 flex-col rounded-xl mb-3 pb-1"
                >
                  <div className="flex justify-between p-3 pb-1.5 gap-4">
                    <span className="font-light text-lg">
                      <span className="font-silkscreen -tracking-widest">
                        {getClaimName(claim)}
                      </span>
                      <span className="flex font-mitr items-center gap-1 text-xs text-muted/60 flex-wrap">
                        {getClaimDescription(claim)}
                      </span>
                    </span>
                    <ToolTip tip={formatToHighDenom(claim.amount)}>
                      <span className="text-chinese-green uppercase font-silkscreen -tracking-widest">
                        {approxAmount(toHD(claim.amount))}
                      </span>
                    </ToolTip>
                  </div>
                  <div className="flex items-center justify-between p-2 px-3 pt-0">
                    {!!claim.claimedAt && (
                      <span className="flex items-center gap-1 text-xs text-green-300 flex-wrap font-silkscreen">
                        <CheckCircle size="15" />
                        <span>Claimed</span>
                      </span>
                    )}

                    {!!claim.claimedAt && claim.claimId == 5 && (
                      <span className="flex items-center gap-1 font-silkscreen text-xs text-gray-500">
                        <span>Resettable</span>
                        <ToolTip tip="This allocation resets if you swap again">
                          <QuestionMarkCircledIcon className="w-3 h-3 text-gray-500" />
                        </ToolTip>
                      </span>
                    )}
                  </div>

                  {/* {!!claim.claimedAt && claim.claimId == 0 && (
                    <span className="flex items-center justify-between gap-1 mx-2 mr-0 font-bold text-sm text-gray-800 font-jersey20 bg-green-400 p-1 px-1 pl-2 rounded-lg">
                      <span className="flex items-center gap-2">
                        <ShoppingCart size="14" className="text-green-800" />{" "}
                        Buy from the liquidity market to reset
                      </span>

                      <Link to="/dexdrop/buy">
                        <Button
                          variant="link"
                          className="h-auto py-0 text-white bg-green-600 rounded-md hover:bg-green-800"
                        >
                          Buy
                        </Button>
                      </Link>
                    </span> */}
                  {/* )} */}

                  {(claim.name.startsWith("dex_user") ||
                    claim.name.startsWith("point") ||
                    claim.name.startsWith("nft")) &&
                    !user?.hasSwapped &&
                    !claim.claimedAt && (
                      <div className="px-2 border-t flex items-center gap-1 border-gray-800/50 py-1 text-xs text-yellow-500 bg-gray-900 rounded-b-xl">
                        <IconTask className="w-4 h-4" />
                        <span className="font-silkscreen">
                          Complete one swap to claim:{" "}
                          <a
                            href="/liquidity/0xEc2b7C1C114c5e74176E53c27156BCf6f09efF97/0xAEA70653A241c7a02BB3624935c51f052390A077/0"
                            className="text-chinese-green/90 hover:text-chinese-green"
                          >
                            [SWAP NOW]
                          </a>
                        </span>
                      </div>
                    )}
                </div>
              ))}
            </div>

            {originalClaims.length > 0 && (
              <div className="p-2 pt-0 flex flex-col gap-2">
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
                    to={`https://twitter.com/intent/tweet?url=https%3A%2F%2Fjntl.ink%2Fdexdrop&via=0xJoint&text=I've%20claimed%20${formatToHighDenom(unclaimedBalQry.data || BigInt(0))}%20JOIN%20tokens%20from%20Joint%27s%20DexDrop.%20Complete%20swaps%20on%20Joint%20to%20be%20eligible&hashtags=DexDrop%2CAirdrop%2CJoint%2CDEX`}
                  >
                    <Button
                      size="full"
                      className="bg-[#1DA1F2]/90 hover:bg-[#1DA1F2]"
                    >
                      <span className="flex items-center gap-1">
                        <IconX className="w-5 h-5" />
                        <span>Share</span>
                      </span>
                    </Button>
                  </Link>
                )}

                <div className=" flex flex-col gap-2 border-t border-gray-800/80 py-5 mt">
                  {/* <span className="text-xs text-gray-400 font-extralight block text-center">
                    Withdrawal will start soon
                  </span> */}
                  {/* <Button
                    variant="secondary"
                    disabled={!canWithdraw()}
                    size="full"
                    onClick={handleWithdraw}
                  >
                    {!withdrawing && "Withdraw"}
                    {withdrawing && (
                      <Loader2 className="animate-spin text-black w-5 h-5" />
                    )}
                  </Button> */}
                  <span className="text-sm flex flex-col  font-silkscreen text-gray-400 font-extralight text-center">
                    <span className="flex items-center gap-1 justify-center">
                      <span className="text-xl">Withdrawable</span>
                      <ToolTip
                        tip={
                          <>
                            You will receive this amount of JOIN when the
                            withdrawal phase starts.
                            <br />
                            <br />
                            <span className="text-xs text-muted/60">
                              Allocations are managed by our Claim System. We
                              have not issued an official ERC20 token for JOIN
                              at this time.
                            </span>
                          </>
                        }
                      >
                        <QuestionMarkCircledIcon className="w-4 h-4 text-gray-500" />
                      </ToolTip>
                    </span>
                    <span className="font-medium text-lg text-gray-200 select-text font-silkscreen -tracking-widest">
                      {formatToHighDenom(unclaimedBalQry.data || BigInt(0))}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className=" p-5 pt-0">
        <div className="w-full p-7 md:w-8/12 lg:w-6/12 h-[40px] bg-card-background border border-gray-900 rounded-xl mx-auto flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <span className="flex items-center gap-1 text-xs text-gray-400 tracking-wide text-center">
              <span className="font-silkscreen">Total Claimed</span>
              <ToolTip tip="Total amount of JOIN claimed">
                <QuestionMarkCircledIcon className="w-4 h-4 text-gray-500" />
              </ToolTip>
            </span>
            <span className="font-silkscreen -tracking-widest select-all">
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
    case 4:
      return "DroidPD Holders";
    case 5:
      return "Swap-A-Thon";
    default:
      return "Unknown";
  }
}

function getClaimDescription(claim: { claimId: number }) {
  switch (claim.claimId) {
    case 0:
      return "Users of Uniswap between Jan 1st - Nov 22nd 2024";
    case 1:
      return "Joint's points program participation";
    case 2:
      return "Early TJOIN purchaser";
    case 3:
      return "Joint's community partner";
    case 4:
      return "DroidPD holders before July 2024";
    case 5:
      return "Swap for JOIN allocations";
    default:
      return "Unknown";
  }
}

function approxAmount(amount: string) {
  if (toDec(amount).lt(999999)) return formatToMoney(amount);
  return approxNumber(amount);
}
