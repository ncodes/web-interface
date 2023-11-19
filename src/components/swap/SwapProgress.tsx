import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, MessageSquare, XCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useInterval } from "usehooks-ts";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useCoreContract from "../../hooks/services/contracts/useCoreContract.ts";
import useDisputeManagerContract from "../../hooks/services/contracts/useDisputeManagerContract.ts";
import useStore from "../../hooks/store/useStore.ts";
import { useToast } from "../../hooks/useToast.tsx";
import {
  countDisputeVotes,
  getDisputeOutcome,
  getDisputeStatus,
  getPayer,
  isDisputed,
  isDisputer,
  isInDispute,
  isLastDisputeStalled,
  isSwapCounterparty,
  isSwapDisputeExecuted,
  isSwapDraftee,
} from "../../libs/api_utils.ts";
import { isEqlStr, shortenAddress } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { CountDown } from "../Countdown.tsx";
import { ToolTip } from "../ToolTip.tsx";
import IconConflict from "../icons/IconConflict.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";
import { Label } from "../ui/label.tsx";
import AppealPopOver from "./AppealPopOver.tsx";
import { ChatButton } from "./ChatButton.tsx";
import { SwapRateCallout } from "./SwapRateCallout.tsx";
import { appealOrderFunc } from "./functions/appealOrderFunc.ts";
import { cancelOrderFunc } from "./functions/cancelOrderFunc.tsx";
import { markOrderAsPaidFunc } from "./functions/markOrderAsPaidFunc.ts";
import { releaseOrderFunc } from "./functions/releaseOrderFunc.ts";

export function SwapProgress({ swap }: { swap: Swap }) {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { address, getChainInfo } = useConnectorContext();
  const {
    cancelOrder,
    getOrder,
    markOrderAsPaid,
    releaseOrder,
    humanizeErrors,
  } = useCoreContract();
  const {
    createDispute,
    getRecentDispute,
    humanizeErrors: humanizeErrorsDM,
  } = useDisputeManagerContract();
  const [, setDisputeId] = useState<number | undefined>();
  const { notifyError, notifySuccess } = useToast();
  const [canCancel, setCanCancel] = useState(false);
  const [canDispute, setCanDispute] = useState(false);
  const [disableButtons, setDisableButtons] = useState<ButtonEnableState>({
    appeal: false,
    cancel: false,
  });
  const { loading, setLoading } = useStore((s) => ({
    loading: s.loading,
    setLoading: s.setLoading,
  }));
  const { swapPageState } = useStore((s) => ({
    swapPageState: s.swapPageState,
  }));

  const showAwaitingPaymentSection =
    address &&
    !swap.paid &&
    !swap.cancelled &&
    !isEqlStr(getPayer(swap), address);

  const showSendPaymentSection =
    !swap.paid &&
    !swap.cancelled &&
    address &&
    isEqlStr(getPayer(swap), address);

  useInterval(
    async () => {
      const order = await getOrder(BigInt(swap.orderId));
      setDisableButtons({ ...disableButtons, cancel: order?.cancelled });
    },
    (showAwaitingPaymentSection || showSendPaymentSection) &&
      !disableButtons.cancel
      ? 5000
      : null,
  );

  useInterval(
    async () => {
      const order = await getOrder(BigInt(swap.orderId));
      setDisableButtons({ ...disableButtons, markAsPaid: order?.paid });
    },
    showSendPaymentSection && !disableButtons.markAsPaid ? 5000 : null,
  );

  const showDisputedSection =
    address &&
    isInDispute(swap) &&
    !["awaiting_exec", "executed", "abandoned"].includes(
      getDisputeStatus(swap.disputes[0]),
    );

  const showDisputedAndAwaitingExecSection =
    address &&
    (swapPageState.revealPhaseEnded == undefined ||
      swapPageState.revealPhaseEnded) &&
    isDisputed(swap) &&
    !swap.disputes[0]?.orderReleased &&
    ["awaiting_exec", "released", "cancelled", "stalled"].includes(
      getDisputeStatus(swap.disputes[0]),
    );

  const showPaymentMadeSection =
    address &&
    swap.paid &&
    !swap.released &&
    !isDisputed(swap) &&
    !isEqlStr(getPayer(swap), address);

  useInterval(
    async () => {
      const order = await getOrder(BigInt(swap.orderId));
      setDisableButtons({ ...disableButtons, release: order?.released });
    },
    (showDisputedSection ||
      showDisputedAndAwaitingExecSection ||
      showPaymentMadeSection) &&
      !disableButtons.release
      ? 5000
      : null,
  );

  const showAwaitingReleaseSection =
    address &&
    swap.paid &&
    !swap.released &&
    !isDisputed(swap) &&
    isEqlStr(getPayer(swap), address);

  useInterval(
    async () => {
      const dispute = await getRecentDispute(BigInt(swap.orderId));
      setDisableButtons({
        ...disableButtons,
        appeal: !!dispute && !dispute?.executed,
      });
    },
    (showDisputedAndAwaitingExecSection || showPaymentMadeSection) &&
      showAwaitingPaymentSection &&
      !disableButtons.appeal
      ? 5000
      : null,
  );

  const showSwapReleasedSection =
    swap.paid &&
    ((swap.released && !isDisputed(swap)) ||
      (swap.released &&
        isDisputed(swap) &&
        getDisputeStatus(swap.disputes[0]) == "abandoned") ||
      swap.disputes[0]?.orderReleased);

  const showSwapCancelledSection = swap.cancelled && !isDisputed(swap);

  async function doCancel() {
    await cancelOrderFunc(
      swap,
      cancelOrder,
      getChainInfo,
      queryClient,
      location,
      loading,
      setLoading,
      humanizeErrors,
      notifySuccess,
      notifyError,
    );
  }

  async function doMarkAsPaid() {
    await markOrderAsPaidFunc(
      swap,
      markOrderAsPaid,
      getChainInfo,
      queryClient,
      location,
      loading,
      setLoading,
      humanizeErrors,
      notifySuccess,
      notifyError,
    );
  }

  async function doRelease() {
    await releaseOrderFunc(
      swap,
      releaseOrder,
      getChainInfo,
      queryClient,
      location,
      loading,
      setLoading,
      humanizeErrors,
      notifySuccess,
      notifyError,
    );
  }

  async function doAppeal(wantRelease: boolean) {
    await appealOrderFunc(
      swap,
      createDispute,
      wantRelease,
      getChainInfo,
      queryClient,
      location,
      loading,
      setDisputeId,
      setLoading,
      humanizeErrorsDM,
      notifySuccess,
      notifyError,
    );
  }

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
        <span className="xl:hidden">
          <ChatButton address={address} swap={swap} disableUnmark />
        </span>
      </div>
      <div>
        <div className="bg-card-background border rounded-2xl border-card-border w-full mt-3 pb-5">
          {/* -- when not payer -- */}
          {/* ---- when awaiting payment -- */}
          {showAwaitingPaymentSection && (
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
                  onClick={doCancel}
                  disabled={
                    !canCancel ||
                    disableButtons.cancel ||
                    loading[swap.orderId]?.cancelOrder
                  }
                >
                  {!loading[swap.orderId]?.cancelOrder && <>Cancel</>}
                  {loading[swap.orderId]?.cancelOrder && (
                    <>
                      <IconSpinner
                        width="20"
                        fill="fill-gray-100"
                        className="animate-spin"
                      />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
          {/* ---- end when awaiting payment */}
          {/* ---- when payment was made -- */}
          {showPaymentMadeSection && (
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
                <Button
                  variant="default"
                  size="full"
                  onClick={doRelease}
                  disabled={
                    disableButtons.release ||
                    loading[swap.orderId]?.releaseOrder
                  }
                >
                  {!loading[swap.orderId]?.releaseOrder && <>Release</>}
                  {loading[swap.orderId]?.releaseOrder && (
                    <>
                      <IconSpinner
                        width="20"
                        fill="fill-gray-900"
                        className="animate-spin"
                      />
                    </>
                  )}
                </Button>
                <AppealPopOver
                  modal={true}
                  onActivate={doAppeal}
                  isReleaser={!isEqlStr(getPayer(swap), address)}
                >
                  <Button
                    variant="outline"
                    className={cn("hover:bg-black hover:text-chinese-green", {
                      "w-[150px]": !canDispute,
                      "w-full": canDispute,
                    })}
                    size="full"
                    disabled={
                      !canDispute ||
                      disableButtons.appeal ||
                      loading[swap.orderId]?.appealOrder
                    }
                  >
                    {!loading[swap.orderId]?.appealOrder && <>Appeal</>}
                    {loading[swap.orderId]?.appealOrder && (
                      <>
                        <IconSpinner
                          width="20"
                          fill="fill-gray-100"
                          className="animate-spin"
                        />
                      </>
                    )}
                  </Button>
                </AppealPopOver>
              </div>
            </>
          )}
          {/* ---- end when payment was made */}
          {/* -- end when not payer -- */}
          {/* -- when payer -- */}
          {/* ---- when payment is requested -- */}
          {showSendPaymentSection && (
            <>
              <Label className="block p-5 py-3 pb-1 text-lg tracking-wide">
                Send Payment
              </Label>
              <div className="px-5 font-light text-gray-300 text-sm">
                The counterpart requires payment.{" "}
                <b className="text-white tracking-wider">
                  Send payment to the counterpart using the payment information
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
                    after you have sent the payment.
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
                    onClick={doMarkAsPaid}
                    disabled={
                      disableButtons.markAsPaid ||
                      loading[swap.orderId]?.markOrderAsPaid
                    }
                  >
                    {!loading[swap.orderId]?.markOrderAsPaid && (
                      <>I Have Paid</>
                    )}
                    {loading[swap.orderId]?.markOrderAsPaid && (
                      <>
                        <IconSpinner
                          width="20"
                          fill="fill-gray-900"
                          className="animate-spin"
                        />
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="destructive"
                  className={cn({
                    "w-[150px]": !canCancel,
                    "w-full": canCancel,
                  })}
                  disabled={
                    !canCancel ||
                    disableButtons.cancel ||
                    loading[swap.orderId]?.cancelOrder
                  }
                  onClick={doCancel}
                >
                  {!loading[swap.orderId]?.cancelOrder && <>Cancel</>}
                  {loading[swap.orderId]?.cancelOrder && (
                    <IconSpinner
                      width="20"
                      className="animate-spin"
                      fill="fill-gray-100"
                    />
                  )}
                </Button>
              </div>
            </>
          )}
          {/* --- end when payment is requested */}
          {/* ---- when waiting for release -- */}
          {showAwaitingReleaseSection && (
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
                <AppealPopOver
                  modal={true}
                  onActivate={doAppeal}
                  isReleaser={!isEqlStr(getPayer(swap), address)}
                >
                  <Button
                    variant="outline"
                    className="px-0 xxs:px-4 hover:bg-black hover:text-chinese-green h-12"
                    size="full"
                    disabled={
                      !canDispute ||
                      disableButtons.appeal ||
                      loading[swap.orderId]?.appealOrder
                    }
                  >
                    {!loading[swap.orderId]?.appealOrder && <>Appeal</>}
                    {loading[swap.orderId]?.appealOrder && (
                      <>
                        <IconSpinner
                          width="20"
                          fill="fill-gray-100"
                          className="animate-spin"
                        />
                      </>
                    )}
                    <CountDown wrapL="&nbsp;(" isoDate={swap.disputeFrom} />
                  </Button>
                </AppealPopOver>
              </div>
            </>
          )}
          {/* ---- end when waiting for release -- */}
          {/* -- end when payer -- */}

          {/* ---- when swap was released -- */}
          {showSwapReleasedSection && (
            <>
              <Label className="p-5 py-3 pb-0 relative top-1 text-lg flex items-center gap-2 text-chinese-green">
                <CheckCircle className="20" /> <span>Swap Released</span>
              </Label>
              <div className="md:h-[92px] px-5 pt-5 font-light text-gray-200 text-sm tracking-wide">
                The swap is complete. Any locked asset has been transferred to
                the intended counterparty.
              </div>
              <SwapRateCallout swap={swap} />
            </>
          )}
          {/* ---- end when swap was released -- */}

          {/* ---- when swap was cancelled -- */}
          {showSwapCancelledSection && (
            <>
              <Label className="p-5 py-3 pb-0 relative top-1 text-lg flex items-center gap-2 text-red-500">
                <XCircle className="20" /> <span>Swap Cancelled</span>
              </Label>
              <div className="md:h-[92px] px-5 pt-5 font-light text-gray-200 text-sm tracking-wide">
                The swap has been cancelled. Any locked asset has be returned
                back to initial owner.
              </div>
              <SwapRateCallout swap={swap} />
            </>
          )}
          {/* ---- end when swap was cancelled -- */}
          {/* ---- when swap was disputed but not executed or awaiting execution -- */}
          {showDisputedSection && (
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
                    The counterpart ({shortenAddress(swap.disputes[0].creator)})
                    has initiated a dispute concerning this swap. They want to{" "}
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
                      {swap.disputes[0].wantRelease ? "released" : "cancelled"}
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
                      Mediators will be drafted to resolve the dispute. You must
                      use the chat system to engage with the mediator(s).
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
                      As a mediator, you must use the chat system to engage with
                      the counterparties.
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
                      <Button
                        variant="default"
                        size="full"
                        onClick={doRelease}
                        disabled={
                          disableButtons.release ||
                          loading[swap.orderId]?.releaseOrder
                        }
                      >
                        {!loading[swap.orderId]?.releaseOrder && <>Release</>}
                        {loading[swap.orderId]?.releaseOrder && (
                          <>
                            <IconSpinner
                              width="20"
                              fill="fill-gray-900"
                              className="animate-spin"
                            />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
            </>
          )}
          {/* ---- end when swap was disputed but not executed or awaiting execution -- */}

          {/* ---- when swap was disputed but dispute is awaiting exec -- */}
          {showDisputedAndAwaitingExecSection && (
            <>
              {getDisputeOutcome(swap.disputes[0]) == "stalled" && (
                <>
                  <Label className="flex gap-2 items-center p-5 py-3 pb-1 text-lg text-gray-300">
                    <span>
                      <IconConflict width="20" />
                    </span>
                    <span className="flex items-center gap-2 justify-between flex-1">
                      <span>Dispute Stalled</span>
                      {!isSwapDisputeExecuted(swap) && (
                        <span className="flex items-center gap-1">
                          <span>
                            <ToolTip tip="awaiting verdict execution">
                              <IconSpinner
                                width="15"
                                className="animate-spin"
                                fill="fill-gray-500"
                              />
                            </ToolTip>
                          </span>
                          <span className="hidden xs:inline text-xs font-light text-gray-500">
                            Awaiting Execution
                          </span>
                        </span>
                      )}
                    </span>
                  </Label>
                  <div className="px-5 font-light text-gray-200 text-sm tracking-wide mt-2">
                    <span>The mediators where unable to reach a verdict. </span>
                  </div>
                </>
              )}

              {getDisputeOutcome(swap.disputes[0]) == "released" && (
                <>
                  <Label className="flex gap-2 items-center p-5 py-3 pb-1 text-lg text-green-300">
                    <span>
                      <CheckCircle width="20" />
                    </span>
                    <span className="flex items-center gap-2 justify-between flex-1">
                      <span>Released</span>
                      {!isSwapDisputeExecuted(swap) && (
                        <span className="flex items-center gap-1">
                          <span>
                            <ToolTip tip="awaiting verdict execution">
                              <IconSpinner
                                width="15"
                                className="animate-spin"
                                fill="fill-gray-500"
                              />
                            </ToolTip>
                          </span>
                          <span className="hidden xs:inline text-xs font-light text-gray-500">
                            Awaiting Execution
                          </span>
                        </span>
                      )}
                    </span>
                  </Label>
                  <div className="px-5 font-light text-gray-200 text-sm tracking-wide mt-2">
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
                    <span className="flex items-center gap-2 justify-between flex-1">
                      <span>Cancelled</span>
                      {!isSwapDisputeExecuted(swap) && (
                        <span className="flex items-center gap-1">
                          <span>
                            <ToolTip tip="awaiting verdict execution">
                              <IconSpinner
                                width="15"
                                className="animate-spin"
                                fill="fill-gray-500"
                              />
                            </ToolTip>
                          </span>
                          <span className="hidden xs:inline text-xs font-light text-gray-500">
                            Awaiting Execution
                          </span>
                        </span>
                      )}
                    </span>
                  </Label>
                  <div className="px-5 font-light text-gray-200 text-sm tracking-wide mt-2">
                    <span>
                      The mediators voted to cancel the swap. Locked assets will
                      be released back to the owner.
                    </span>
                  </div>
                </>
              )}

              <div className="px-5 font-light text-gray-200 text-sm tracking-wide mt-5 mb-5">
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
                    {isSwapDisputeExecuted(swap) && (
                      <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                        <span>
                          <IconInfoCircle className="text-yellow-500" />
                        </span>
                        <>
                          {!isEqlStr(getPayer(swap), address) ? (
                            <span>
                              You can initiate a new dispute or release the swap
                              once the issue is resolved.
                            </span>
                          ) : (
                            <span>You may start a new dispute.</span>
                          )}
                        </>
                      </span>
                    )}

                    {!isSwapDisputeExecuted(swap) && (
                      <span className="p-2 bg-gray-800 border border-gray-700 rounded-md flex gap-2">
                        <span>
                          <IconInfoCircle className="text-yellow-500" />
                        </span>
                        <>
                          {!isEqlStr(getPayer(swap), address) ? (
                            <span>
                              Once the current verdict is executed by miners,
                              you can initiate a new dispute. If the problem is
                              resolved, you can also release the swap.
                            </span>
                          ) : (
                            <span>
                              Once the current verdict is executed by miners,
                              you may start a new dispute.
                            </span>
                          )}
                        </>
                      </span>
                    )}

                    <div className="flex mt-5 gap-2">
                      {!isEqlStr(getPayer(swap), address) && (
                        <Button
                          variant="default"
                          size="full"
                          onClick={doRelease}
                          disabled={
                            disableButtons.release ||
                            loading[swap.orderId]?.releaseOrder
                          }
                        >
                          {!loading[swap.orderId]?.releaseOrder && <>Release</>}
                          {loading[swap.orderId]?.releaseOrder && (
                            <>
                              <IconSpinner
                                width="20"
                                fill="fill-gray-900"
                                className="animate-spin"
                              />
                            </>
                          )}
                        </Button>
                      )}
                      <AppealPopOver
                        modal={true}
                        onActivate={doAppeal}
                        isReleaser={!isEqlStr(getPayer(swap), address)}
                      >
                        <Button
                          variant="outline"
                          className="px-0 xxs:px-4 hover:bg-black hover:text-chinese-green"
                          size="full"
                          disabled={
                            (disableButtons.appeal && !isDisputed(swap)) ||
                            loading[swap.orderId]?.appealOrder ||
                            (isDisputed(swap) &&
                              isLastDisputeStalled(swap) &&
                              !isSwapDisputeExecuted(swap))
                          }
                        >
                          {!loading[swap.orderId]?.appealOrder && <>Appeal</>}
                          {loading[swap.orderId]?.appealOrder && (
                            <>
                              <IconSpinner
                                width="20"
                                fill="fill-gray-100"
                                className="animate-spin"
                              />
                            </>
                          )}
                        </Button>
                      </AppealPopOver>
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
