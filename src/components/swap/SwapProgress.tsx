import { Label } from "../ui/label.tsx";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { Button } from "../ui/Button.tsx";
import { CheckCircle, MessageSquare, XCircle } from "lucide-react";
import { isEqlStr, shortenAddress } from "../../libs/helpers.ts";
import {
  countDisputeVotes,
  getDisputeStatus,
  getPayer,
  isInDispute,
  isDisputer,
  isSwapCounterparty,
  isSwapDraftee,
  isSwapParticipant,
  isDisputed,
  getDisputeOutcome,
  isSwapDisputeExecuted,
} from "../../libs/api_utils.ts";
import useConnector from "../../hooks/connectors/useConnector.tsx";
import { CountDown } from "../Countdown.tsx";
import { cn } from "../../libs/utils.ts";
import { useState } from "react";
import IconConflict from "../icons/IconConflict.tsx";
import useStore from "../../hooks/store/useStore.ts";

export function SwapProgress({
  swap,
  onRequestOpenChat,
}: {
  swap: Swap;
  onRequestOpenChat: () => void;
}) {
  const { address } = useConnector();
  const [canCancel, setCanCancel] = useState(false);
  const [canDispute, setCanDispute] = useState(false);
  const { swapPageState } = useStore((s) => ({
    swapPageState: s.swapPageState,
  }));

  return (
    <div className="mt-3 flex-1">
      <div className="text-xl font-medium md:px-5 flex justify-between">
        <div className="flex items-center gap-1">
          <span className="tracking-wide">Progress</span>
          <span className="mt-[2px]">
            <ToolTip tip="Track the progress of the swap">
              <IconInfoCircle width="18px" />
            </ToolTip>
          </span>
        </div>
        <div className="h-[42px]">
          {address && isSwapParticipant(swap, address) ? (
            <Button
              variant="ghost"
              className="flex font-semibold items-center gap-1 text-chinese-green"
              onClick={onRequestOpenChat}
            >
              <MessageSquare width="20px" /> Chat
              <div className="rounded-full h-[20px] min-w-[20px] px-[5px] leading-[20px] flex justify-center items-center  bg-red-600 text-[10px]">
                2
              </div>
            </Button>
          ) : (
            <>&nbsp;</>
          )}
        </div>
      </div>
      <div>
        <div className="bg-card-background border rounded-2xl border-card-border w-full mt-3 pb-5">
          {/* -- when not payer -- */}
          {/* ---- when awaiting payment -- */}
          {address &&
            !swap.paid &&
            !swap.cancelled &&
            !isEqlStr(getPayer(swap), address) && (
              <>
                <Label className="block p-5 py-3 pb-1 text-lg">
                  Awaiting Payment
                </Label>
                <div className="px-5 font-light text-gray-300 text-sm">
                  Waiting for the counterpart to send payment. This swap will be
                  eligible for cancellation when the waiting time is over.
                </div>
                <div className="px-5 text-2xl py-2 flex flex-col">
                  {!canCancel && (
                    <span className="text-xs text-gray-500 mt-2">
                      CANCELLABLE IN
                    </span>
                  )}
                  <span className="text-red-500">
                    <CountDown
                      isoDate={swap.cancelAt}
                      onDone={() => {
                        setCanCancel(true);
                      }}
                      full
                    />
                  </span>
                </div>
                <div className="px-5 ">
                  <Button
                    variant="destructive"
                    size="full"
                    disabled={!canCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          {/* ---- end when awaiting payment */}
          {/* ---- when payment was made -- */}
          {address &&
            swap.paid &&
            !swap.released &&
            !isDisputed(swap) &&
            !isEqlStr(getPayer(swap), address) && (
              <>
                <Label className="block p-5 py-3 pb-1 text-lg">Release</Label>
                <div className="px-5 font-light text-gray-300 text-sm">
                  The counterpart has made payment.{" "}
                  <b className="text-white tracking-wider">
                    Release the asset after you have verified the payment with
                    your payment method provider
                  </b>
                  .
                  <br />
                  <br />
                  <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                    <span>
                      <IconInfoCircle className="text-yellow-500" />
                    </span>
                    <span>
                      If you do not release the asset before the timer below
                      expires, the swap may be disputed.
                    </span>
                  </span>
                  <span className="p-2 mt-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                    <span>
                      <IconInfoCircle className="text-yellow-400" />
                    </span>
                    <span>
                      If you did not see the payment or there was a problem with
                      the payment, you can dispute the swap.
                    </span>
                  </span>
                  <span className="p-2 mt-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                    <span>
                      <IconInfoCircle className="text-yellow-400" />
                    </span>
                    <span>
                      Dispute may lock the liquidity for an extended period of
                      time, so attempt to resolve any issue with the counterpart
                      using the messaging system first.
                    </span>
                  </span>
                </div>
                <div className="px-5 text-2xl py-2 pt-0 flex flex-col">
                  {!canDispute && (
                    <span className="text-xs text-gray-500 mt-5">
                      DISPUTABLE IN
                    </span>
                  )}
                  <span className="text-yellow-500">
                    <CountDown
                      isoDate={swap.disputeFrom}
                      onDone={() => {
                        setCanDispute(true);
                      }}
                      full
                    />
                  </span>
                </div>
                <div className="flex px-5 mt-2 gap-2">
                  <Button variant="default" size="full">
                    Release
                  </Button>
                  <Button
                    variant="outline"
                    className={cn("hover:bg-black hover:text-chinese-green", {
                      "w-[150px]": !canDispute,
                      "w-full": canDispute,
                    })}
                    size="full"
                    disabled={!canDispute}
                  >
                    Appeal
                  </Button>
                </div>
              </>
            )}
          {/* ---- end when payment was made */}
          {/* -- end when not payer -- */}
          {/* -- when payer -- */}
          {/* ---- when payment is requested -- */}
          {!swap.paid &&
            !swap.cancelled &&
            address &&
            isEqlStr(getPayer(swap), address) && (
              <>
                <Label className="block p-5 py-3 pb-1 text-lg tracking-wide">
                  Send Payment
                </Label>
                <div className="px-5 font-light text-gray-300 text-sm">
                  The counterpart requires payment.{" "}
                  <b className="text-white tracking-wider">
                    Send payment to the counterpart using the payment method
                    they shared with you in the chat.
                  </b>
                  <br />
                  <br />
                  <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                    <span>
                      <IconInfoCircle className="text-yellow-500" />
                    </span>
                    <span>
                      Click <b className="text-white">"I have Paid"</b> button
                      below after you have sent the payment.
                    </span>
                  </span>
                  <br />
                  <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                    <span>
                      <IconInfoCircle className="text-yellow-500" />
                    </span>
                    <span>
                      If you do not send payment before the timer below expires,
                      the swap will be eligible for cancellation.
                    </span>
                  </span>
                </div>
                <div className="px-5 text-2xl py-2 pb-0 flex flex-col">
                  {!canCancel && (
                    <span className="text-xs text-gray-500 mt-4">
                      CANCELLABLE IN
                    </span>
                  )}
                  <span className="text-red-500">
                    <CountDown
                      isoDate={swap.cancelAt}
                      onDone={() => {
                        setCanCancel(true);
                      }}
                      full
                    />
                  </span>
                </div>
                <div className="flex px-5 mt-4 gap-2">
                  {!canCancel && (
                    <Button
                      variant="default"
                      className="px-0 xxs:px-4"
                      size="full"
                    >
                      I Have Paid
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    className={cn({
                      "w-[150px]": !canCancel,
                      "w-full": canCancel,
                    })}
                    disabled={!canCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          {/* --- end when payment is requested */}
          {/* ---- when waiting for release -- */}
          {address &&
            swap.paid &&
            !swap.released &&
            !isDisputed(swap) &&
            isEqlStr(getPayer(swap), address) && (
              <>
                <Label className="block p-5 py-3 pb-1 text-lg">
                  Awaiting Release
                </Label>
                <div className="px-5 font-light text-gray-300 text-sm">
                  The counterpart is expected to verify your payment and release
                  the swap once your payment has been confirmed.
                  <br />
                  <br />
                  <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                    <span>
                      <IconInfoCircle className="text-yellow-500" />
                    </span>
                    <span>
                      If the counterpart does not release the swap before the
                      timer below expires, you can start a dispute.
                    </span>
                  </span>
                  <br />
                  <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                    <span>
                      <IconInfoCircle className="text-yellow-500" />
                    </span>
                    <span>
                      You are encouraged to use the messaging system to resolve
                      issues with the counterpart before initiating a dispute.
                    </span>
                  </span>
                </div>
                <div className="px-5 text-2xl py-2 flex flex-col">
                  {!canDispute && (
                    <span className="text-xs text-gray-500 mt-3">
                      DISPUTABLE IN
                    </span>
                  )}
                  <span className="text-yellow-500">
                    <CountDown
                      isoDate={swap.disputeFrom}
                      onDone={() => {
                        setCanDispute(true);
                      }}
                      full
                    />
                  </span>
                </div>
                <div className="flex px-5 mt-2 gap-2">
                  <Button
                    variant="outline"
                    className="px-0 xxs:px-4 hover:bg-black hover:text-chinese-green"
                    size="full"
                    disabled={!canDispute}
                  >
                    Appeal
                    <CountDown wrapL="&nbsp;(" isoDate={swap.disputeFrom} />
                  </Button>
                </div>
              </>
            )}
          {/* ---- end when waiting for release -- */}
          {/* -- end when payer -- */}
          {/* ---- when swap was released -- */}
          {swap.paid && swap.released && !isDisputed(swap) && (
            <>
              <Label className="p-5 py-3 pb-0 relative top-1 text-lg flex items-center gap-2 text-chinese-green">
                <CheckCircle className="20" /> <span>Swap Released</span>
              </Label>
            </>
          )}
          {/* ---- end when swap was released -- */}
          {/* ---- when swap was cancelled -- */}
          {swap.cancelled && !isDisputed(swap) && (
            <>
              <Label className="p-5 py-3 pb-0 relative top-1 text-lg flex items-center gap-2 text-red-500">
                <XCircle className="20" /> <span>Swap Cancelled</span>
              </Label>
            </>
          )}
          {/* ---- end when swap was cancelled -- */}
          {/* ---- when swap was disputed but not executed or awaiting execution -- */}
          {address &&
            isInDispute(swap) &&
            !["awaiting_exec", "executed"].includes(
              getDisputeStatus(swap.disputes[0])
            ) && (
              <>
                <Label className="flex gap-1 items-center p-5 py-3 pb-1 text-lg text-orange-500">
                  <span>
                    <IconConflict width="20" />
                  </span>
                  <span>Disputed</span>
                </Label>
                <div className="px-5 font-light text-gray-200 text-sm tracking-wide">
                  {!isDisputer(swap, address) ? (
                    <>
                      The counterpart (
                      {shortenAddress(swap.disputes[0].creator)}) has initiated
                      a dispute concerning this swap.{" "}
                      {shortenAddress(swap.disputes[0].creator)} wants to{" "}
                      <b className="font-medium text-chinese-green">
                        {swap.disputes[0].wantRelease ? "release" : "cancel"}
                      </b>{" "}
                      the swap.
                    </>
                  ) : (
                    <>
                      You initiated a dispute concerning this swap. You are
                      requesting to have the swap{" "}
                      <b className="font-medium text-chinese-green">
                        {swap.disputes[0].wantRelease
                          ? "released"
                          : "cancelled"}
                      </b>
                      .
                    </>
                  )}
                </div>

                {isSwapCounterparty(swap, address) && (
                  <div className="px-5 font-light text-gray-300 text-sm tracking-wide mt-4">
                    <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                      <span>
                        <MessageSquare className="text-yellow-500" />
                      </span>
                      <span>
                        Mediators will be drafted to resolve the dispute. You
                        must use the chat system to engage with the mediator(s).
                      </span>
                    </span>
                  </div>
                )}

                {isSwapDraftee(swap, address, true) && (
                  <div className="px-5 font-light text-gray-300 text-sm tracking-wide mt-4">
                    <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                      <span>
                        <MessageSquare className="text-yellow-500" />
                      </span>
                      <span>
                        As a mediator, you must use the chat system to engage
                        with the counterparties.
                      </span>
                    </span>
                  </div>
                )}

                {isSwapCounterparty(swap, address) &&
                  !isEqlStr(getPayer(swap), address) && (
                    <div className="px-5 font-light text-gray-300 text-sm tracking-wide mt-4">
                      <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                        <span>
                          <IconInfoCircle className="text-yellow-500" />
                        </span>
                        <span>
                          You can still release the asset at any time in the
                          dispute if the issues have been resolved.
                        </span>
                      </span>

                      <div className="flex mt-5 gap-2">
                        <Button variant="default" size="full">
                          Release
                        </Button>
                      </div>
                    </div>
                  )}
              </>
            )}
          {/* ---- end when swap was disputed but not executed or awaiting execution -- */}

          {/* ---- when swap was disputed but dispute is awaiting exec -- */}
          {address &&
            (swapPageState.revealPhaseEnded == undefined ||
              swapPageState.revealPhaseEnded) &&
            isDisputed(swap) &&
            ["awaiting_exec", "released", "cancelled", "stalled"].includes(
              getDisputeStatus(swap.disputes[0])
            ) && (
              <>
                {getDisputeOutcome(swap.disputes[0]) == "stalled" && (
                  <>
                    <Label className="flex gap-2 items-center p-5 py-3 pb-1 text-lg text-gray-300">
                      <span>
                        <IconConflict width="20" />
                      </span>
                      <span>Dispute Stalled</span>
                    </Label>
                    <div className="px-5 font-light text-gray-200 text-sm tracking-wide">
                      <span>
                        The mediators where unable to reach a verdict.{" "}
                      </span>
                    </div>
                  </>
                )}

                {getDisputeOutcome(swap.disputes[0]) == "released" && (
                  <>
                    <Label className="flex gap-2 items-center p-5 py-3 pb-1 text-lg text-green-300">
                      <span>
                        <CheckCircle width="20" />
                      </span>
                      {!isSwapDisputeExecuted(swap) && (
                        <span>Release (pending)</span>
                      )}
                      {isSwapDisputeExecuted(swap) && <span>Released</span>}
                    </Label>
                    <div className="px-5 font-light text-gray-200 text-sm tracking-wide">
                      <span>The mediators voted to release the swap.</span>
                    </div>
                  </>
                )}

                {getDisputeOutcome(swap.disputes[0]) == "cancelled" && (
                  <>
                    <Label className="flex gap-2 items-center p-5 py-3 pb-1 text-lg text-red-300">
                      <span>
                        <XCircle width="20" />
                      </span>
                      {!isSwapDisputeExecuted(swap) && (
                        <span>Cancel (pending)</span>
                      )}
                      {isSwapDisputeExecuted(swap) && <span>Cancelled</span>}
                    </Label>
                    <div className="px-5 font-light text-gray-200 text-sm tracking-wide">
                      <span>
                        The mediators voted to cancel the swap. Locked assets
                        will be released back to the owner.
                      </span>
                    </div>
                  </>
                )}

                <div className="px-5 font-light text-gray-200 text-sm tracking-wide">
                  <div className="mb-1 mt-3">
                    <span className="inline-block min-w-[30px] px-[5px] rounded font-medium bg-green-400 text-gray-800">
                      {countDisputeVotes(swap.disputes[0]).release}
                    </span>{" "}
                    voted to <b>release</b>
                  </div>
                  <div className="mb-1">
                    <span className="inline-block min-w-[30px] px-[5px] rounded font-medium bg-red-400 text-gray-800">
                      {countDisputeVotes(swap.disputes[0]).cancel}
                    </span>{" "}
                    voted to <b>cancel</b>.
                  </div>
                  <div>
                    <span className="inline-block min-w-[30px] px-[5px] rounded font-medium bg-gray-400 text-gray-800">
                      {countDisputeVotes(swap.disputes[0]).miss}
                    </span>{" "}
                    did not vote.
                  </div>
                </div>

                {isSwapCounterparty(swap, address) &&
                  getDisputeOutcome(swap.disputes[0]) == "stalled" && (
                    <div className="px-5 font-light text-gray-300 text-sm tracking-wide mt-4">
                      <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                        <span>
                          <IconInfoCircle className="text-yellow-500" />
                        </span>
                        {!isEqlStr(getPayer(swap), address) ? (
                          <span>
                            You may start a new dispute or release the swap if
                            the issue has been resolved.
                          </span>
                        ) : (
                          <span>You may start a new dispute.</span>
                        )}
                      </span>
                      <div className="flex mt-5 gap-2">
                        {!isEqlStr(getPayer(swap), address) && (
                          <Button variant="default" size="full">
                            Release
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="px-0 xxs:px-4 hover:bg-black hover:text-chinese-green"
                          size="full"
                        >
                          Appeal
                        </Button>
                      </div>
                    </div>
                  )}
              </>
            )}
          {/* ---- end when swap was disputed but dispute is stalled -- */}
        </div>
      </div>
    </div>
  );
}
