import { BaseSyntheticEvent, useState } from "react";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { StatCard } from "../market/StatCard.tsx";
import { Button } from "../ui/Button.tsx";
import { cn } from "../../libs/utils.ts";
import { TimerIcon } from "@radix-ui/react-icons";
import { PairAvatar } from "../avatar/PairAvatar.tsx";
import IconNoPay from "../icons/IconNoPay.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { ToolTip } from "../ToolTip.tsx";
import {
  canAppeal,
  getPayer,
  getSwapDisputeOutcome,
  isDisputeAbandoned,
  isDisputed,
  isDisputer,
  isInDispute,
  isLastDisputeStalled,
  isSwapCounterparty,
  isSwapDisputeEnded,
  isSwapDisputeExecuted,
  isSwapParticipant,
} from "../../libs/api_utils.ts";
import IconPaySent from "../icons/IconPaySent.tsx";
import { CheckCircle, XCircle } from "lucide-react";
import IconConflict from "../icons/IconConflict.tsx";
import {
  formatToHighDenom,
  formatToMoney,
  isEqlStr,
} from "../../libs/helpers.ts";
import { USDAmountToolTip } from "../USDAmountToolTip.tsx";
import moment from "moment";
import { CountDown } from "../Countdown.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import useStore from "../../hooks/store/useStore.ts";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import { SwapRowLinks } from "./SwapRowLinks.tsx";
import useCoreContract from "../../hooks/services/contracts/useCoreContract.ts";
import { useToast } from "../../hooks/toast/toast.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { cancelOrderFunc } from "./functions/cancelOrderFunc.tsx";
import { markOrderAsPaidFunc } from "./functions/markOrderAsPaidFunc.ts";

interface ButtonEnableState {
  appeal: boolean;
  cancel: boolean;
}

export function SwapRow({
  noFocus,
  className,
  swap,
}: {
  noFocus?: boolean;
  className?: string;
  swap: Swap;
}) {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const { address, getChainInfo } = useConnectorContext();
  const { cancelOrder, markOrderAsPaid, humanizeErrors } = useCoreContract();
  const { notifyError, notifySuccess } = useToast();
  const { swapPageState } = useStore((s) => ({
    swapPageState: s.swapPageState,
  }));
  const [disableButtons, setDisableButtons] = useState<ButtonEnableState>({
    appeal: true,
    cancel: true,
  });
  const { loading, setLoading } = useStore((s) => ({
    loading: s.loading,
    setLoading: s.setLoading,
  }));
  const { triggered, setTriggered } = useStore((s) => ({
    triggered: s.triggered,
    setTriggered: s.setTriggered,
  }));

  async function doCancel() {
    await cancelOrderFunc(
      swap,
      cancelOrder,
      getChainInfo,
      queryClient,
      location,
      loading,
      triggered,
      setLoading,
      setTriggered,
      humanizeErrors,
      notifySuccess,
      notifyError
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
      triggered,
      setLoading,
      setTriggered,
      humanizeErrors,
      notifySuccess,
      notifyError
    );
  }

  return (
    <div
      className="select-none"
      onClick={(e: BaseSyntheticEvent) => {
        const canTrigger = e.target.getAttribute("data-click-trigger");
        if (canTrigger && canTrigger == "1" && !noFocus) {
          navigate(`/swap/${swap.orderId}`);
        }
      }}
    >
      <div
        data-click-trigger="1"
        className={cn(
          "border bg-card-background border-card-border transition-all duration-300 rounded-xl border-b-gray-600",
          {
            "hover:border-chinese-green cursor-pointer": !noFocus,
          },
          className
        )}
      >
        <div className="flex flex-col md:flex-row" data-click-trigger="1">
          <div
            data-click-trigger="1"
            className="flex gap-2 p-5 px-3 md:px-3 py-0 items-center shrink-0 md:border-r border-gray-800"
          >
            <div
              data-click-trigger="1"
              className="flex w-full items-center gap-2 md:px-0 md:py-4 pt-2 md:pt-4"
            >
              <PairAvatar
                base={swap.base}
                quote={swap.quote}
                baseSrc={swap.market.baseLogo}
                quoteSrc={swap.market.quoteLogo}
                dataClickTrigger="1"
              />
              <div className="flex md:flex-col gap-2 items-center md:items-start w-full justify-between md:justify-start ">
                <span
                  data-click-trigger="1"
                  className="tracking-wide text-xs xs:text-[16px]"
                >
                  {swap.base}
                  <span className="text-gray-500 inline-block mx-1">/</span>
                  {swap.quote}
                </span>

                <span className="flex items-center gap-1 text-xs font-light tracking-wider text-green-400">
                  {!swap.paid && !swap.cancelled && !isInDispute(swap) && (
                    <span className="flex bg-gray-300/30 rounded-full py-[2px] px-[4px] text-xs items-center gap-1 font-medium tracking-wider text-gray-300">
                      <ToolTip
                        className="flex items-center gap-1"
                        tip={
                          getPayer(swap) == address
                            ? "You have not made payment"
                            : "The counterpart has not made payment"
                        }
                      >
                        <IconNoPay width="15" />{" "}
                        <span className="hidden xs:inline">Unpaid</span>
                        <IconInfoCircle
                          width="15"
                          className="hidden xs:inline text-gray-300"
                        />
                      </ToolTip>
                    </span>
                  )}

                  {swap.paid && !swap.released && !isDisputed(swap) && (
                    <span className="flex bg-yellow-300/30 rounded-full py-[2px] px-[4px] text-xs font-medium tracking-wider border-yellow-300 text-yellow-300">
                      <ToolTip
                        className="flex items-center gap-1"
                        tip={
                          getPayer(swap) == address
                            ? "You have made payment. Now waiting for the counterpart to release the asset"
                            : "The counterpart has made payment. Verify the payment and only release the asset if you have received the payment"
                        }
                      >
                        <IconPaySent width="15" />
                        <span className="hidden xs:inline">Paid</span>
                        <IconInfoCircle
                          width="15"
                          className="hidden xs:inline text-yellow-400"
                        />
                      </ToolTip>
                    </span>
                  )}

                  {(swap.released && !isDisputed(swap)) ||
                    (isDisputed(swap) &&
                      getSwapDisputeOutcome(swap) == "released" &&
                      isSwapDisputeExecuted(swap) && (
                        <span className="flex bg-green-300/30 rounded-full px-[4px] text-xs items-center font-medium tracking-wider text-green-300 border-chinese-green">
                          <ToolTip
                            className="flex items-center gap-1"
                            tip={"The asset has been released"}
                          >
                            <CheckCircle width="15" />{" "}
                            <span className="hidden xs:inline">Released</span>
                            <IconInfoCircle
                              width="15"
                              className="hidden xs:inline text-green-300"
                            />
                          </ToolTip>
                        </span>
                      ))}

                  {((swap.cancelled && !isDisputed(swap)) ||
                    (isDisputed(swap) &&
                      isSwapDisputeExecuted(swap) &&
                      getSwapDisputeOutcome(swap) == "cancelled")) && (
                    <span className="flex bg-red-300/30 rounded-full px-[4px] text-xs items-center font-medium tracking-wider border-red-300 text-red-300">
                      <ToolTip
                        className="flex items-center gap-1"
                        tip={
                          swap.byDispute
                            ? "The swap was cancelled through a dispute"
                            : "The swap was cancelled"
                        }
                      >
                        <XCircle width="15" />
                        <span className="hidden xs:inline">Cancelled</span>
                        <IconInfoCircle
                          width="15"
                          className="hidden xs:inline text-red-300"
                        />
                      </ToolTip>
                    </span>
                  )}

                  {address &&
                    isDisputed(swap) &&
                    !isSwapDisputeExecuted(swap) &&
                    !swap.released &&
                    !swap.cancelled && (
                      <span className="flex bg-orange-400/30 rounded-xl p-[2px] px-[4px] pb-[3px] text-xs items-center gap-1 font-medium tracking-wider text-orange-400 border-orange-400">
                        <ToolTip
                          className="flex items-center gap-1"
                          tip={
                            <>
                              {!isLastDisputeStalled(swap) && (
                                <>
                                  {isDisputer(swap, address || "")
                                    ? "You initiated a dispute to "
                                    : "The counterpart initiated a dispute to "}
                                  {swap.disputes[0].wantRelease ? (
                                    <>
                                      <b className="text-chinese-green">
                                        release
                                      </b>{" "}
                                      the swap.
                                    </>
                                  ) : (
                                    <>
                                      <b className="text-chinese-green">
                                        cancel
                                      </b>{" "}
                                      the swap.
                                    </>
                                  )}
                                </>
                              )}
                              {isLastDisputeStalled(swap) && (
                                <>
                                  The previous dispute is inconclusive. The
                                  mediators could not reach a verdict. A new
                                  dispute must be started.
                                </>
                              )}
                            </>
                          }
                        >
                          <IconConflict width="15" />
                          <span className="hidden xs:inline">Disputed</span>
                          <IconInfoCircle
                            width="15"
                            className="hidden xs:inline text-orange-400"
                          />
                        </ToolTip>
                      </span>
                    )}
                </span>
              </div>
            </div>
          </div>

          <div
            className="flex-1 overflow-hidden shrink-0"
            data-click-trigger="1"
          >
            <ScrollOverflowIndicator>
              <ScrollAreaHorizontal className="flex mr-[1px]">
                <div
                  className="flex-1 flex py-2 px-2 gap-2"
                  data-click-trigger="1"
                >
                  <StatCard
                    title={`Price (${swap.quote})`}
                    tip={`The price of 1 ${swap.base} in ${swap.quote}`}
                  >
                    <span className="flex gap-1" data-click-trigger="1">
                      <span>
                        {formatToHighDenom(
                          swap.price,
                          swap.market.quoteDecimals
                        )}
                      </span>
                      <USDAmountToolTip v={swap.priceUsd} />
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Amount (${swap.base})`}
                    tip={`The amount of ${swap.base} requested by the taker`}
                  >
                    <span
                      className="flex gap-1 text-gray-200"
                      data-click-trigger="1"
                    >
                      <span>
                        {formatToHighDenom(
                          swap.amount,
                          swap.market.baseDecimals
                        )}
                      </span>
                      <USDAmountToolTip v={swap.amountUsd} />
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Cost (${swap.quote})`}
                    tip={`The amount of ${swap.quote} to be paid by the taker`}
                  >
                    <span
                      className="flex gap-1 text-gray-200"
                      data-click-trigger="1"
                    >
                      <span>{formatToMoney(swap.cost)}</span>
                      <USDAmountToolTip v={swap.costUsd} />
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Fee (${swap.feeSymbol})`}
                    tip={`The amount of fee paid`}
                  >
                    <span
                      className="flex gap-1 text-gray-200"
                      data-click-trigger="1"
                    >
                      <span>
                        {formatToHighDenom(swap.fee, swap.market.baseDecimals)}
                      </span>
                      <USDAmountToolTip v={swap.feeUsd} />
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Type`}
                    tip={`Whether the swap is instant or interactive`}
                  >
                    <span className="text-gray-200">
                      {swap.instant ? "Instant" : "Interactive"}
                    </span>
                  </StatCard>
                </div>
              </ScrollAreaHorizontal>
            </ScrollOverflowIndicator>
          </div>
        </div>

        {/* Layer 2 */}
        <div
          data-click-trigger="1"
          className={cn(
            "border-t border-gray-800 px-3 pr-0 md:pr-3 py-1 flex justify-between text-gray-400",
            {
              "flex-col md:flex-row md:justify-between pr-3": isSwapParticipant(
                swap,
                address
              ),
            }
          )}
        >
          {address && isSwapParticipant(swap, address) && (
            <>
              {/* If releaser and payer has not paid */}
              {address &&
                !swap.paid &&
                !swap.cancelled &&
                !isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <IconSpinner width="15" className="animate-spin" />{" "}
                    <ToolTip
                      className="flex gap-1 w-full justify-between md:justify-start"
                      tip="Waiting for the payer to indicate that they have made payment. If the payer fails to make payment within the time limit, the swap can be cancelled by you or eventually by the protocol."
                    >
                      <span className="animate-pulse duration-[5000]">
                        Waiting for payment
                      </span>
                      <IconInfoCircle width="15" />
                    </ToolTip>
                  </span>
                )}

              {/* If releaser and payer has paid */}
              {address &&
                swap.paid &&
                !swap.released &&
                !isDisputed(swap) &&
                !isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <IconSpinner width="15" className="animate-spin" />{" "}
                    <ToolTip
                      className="flex gap-1 w-full justify-between md:justify-start"
                      tip={
                        <span>
                          The payer has indicated that they have made payment.{" "}
                          <b className="text-chinese-green">
                            Verify the payment and click 'Release' to release
                            the asset to the payer if and only if you have
                            received the payment
                          </b>
                          . <br />
                          <br />
                          The payer may start a dispute if you fail to release
                          the asset within the time limit.
                          <br />
                          <br />
                          You may also start a dispute ("Appeal") if there is a
                          problem with the payment.
                        </span>
                      }
                    >
                      <span>
                        Payer has paid{" "}
                        <span className="font-medium animate-pulse duration-[5000ms] text-chinese-green">
                          Verify payment and release.
                        </span>
                        <CountDown
                          wrapL="&nbsp;("
                          prefix="Disputable in: "
                          className="[&>span.time]:text-chinese-green"
                          isoDate={swap.disputeFrom}
                        />
                      </span>
                      <IconInfoCircle width="15" />
                    </ToolTip>
                  </span>
                )}

              {/* If releaser and releaser has released */}
              {address &&
                swap.paid &&
                ((swap.released && !isDisputed(swap)) ||
                  (isDisputed(swap) &&
                    getSwapDisputeOutcome(swap) == "released")) &&
                !isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <CheckCircle width="15" />{" "}
                    <span>
                      {!isDisputed(swap) && "Swap has been released"}
                      {isDisputed(swap) &&
                        isSwapDisputeExecuted(swap) &&
                        "Swap has been released via dispute resolution"}
                      {isDisputed(swap) &&
                        !isSwapDisputeExecuted(swap) &&
                        "Swap will be released after dispute verdict execution"}
                      .
                    </span>
                  </span>
                )}

              {/* If releaser and swap has been cancelled */}
              {address &&
                ((swap.cancelled && !isDisputed(swap)) ||
                  (isDisputed(swap) &&
                    getSwapDisputeOutcome(swap) == "cancelled")) &&
                !isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <XCircle width="15" />{" "}
                    <span>
                      {!isDisputed(swap) && "Swap has been cancelled"}
                      {isDisputed(swap) &&
                        isSwapDisputeExecuted(swap) &&
                        "Swap has been cancelled via dispute resolution"}
                      {isDisputed(swap) &&
                        !isSwapDisputeExecuted(swap) &&
                        "Swap will be cancelled after dispute verdict execution"}
                      .
                    </span>
                  </span>
                )}

              {/* If releaser and swap has been disputed */}
              {address &&
                swap.paid &&
                !swap.released &&
                isDisputed(swap) &&
                !isSwapDisputeEnded(swap) &&
                !swapPageState.revealPhaseEnded &&
                !isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <IconConflict width="15" />{" "}
                    <ToolTip
                      className="flex gap-1 w-full justify-between md:justify-start"
                      tip={
                        <span>
                          This swap is now locked in a dispute. The disputer
                          wants the swap to be{" "}
                          <b>
                            {swap.disputes[0].wantRelease
                              ? "released"
                              : "cancelled"}
                          </b>
                          .
                        </span>
                      }
                    >
                      <span>
                        {isDisputer(swap, address)
                          ? "You started a dispute"
                          : "The counterpart started a dispute"}
                        {swap.disputes[0].wantRelease
                          ? " to release the swap"
                          : " to cancel the swap"}
                      </span>
                      <IconInfoCircle width="15" />
                    </ToolTip>
                  </span>
                )}

              {/* If releaser and swap has been disputed and it stalled  */}
              {address &&
                swap.paid &&
                !swap.released &&
                (isDisputeAbandoned(swap) || isLastDisputeStalled(swap)) &&
                !isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <IconConflict width="15" />{" "}
                    <ToolTip
                      className="flex gap-1 w-full justify-between md:justify-start"
                      tip={
                        <span>
                          The mediators could not reach a verdict. You may{" "}
                          <b>re-appeal</b> or <b>release</b> the swap if the
                          circumstances have changed.
                        </span>
                      }
                    >
                      <span>The previous dispute is inconclusive</span>
                      <IconInfoCircle width="15" />
                    </ToolTip>
                  </span>
                )}

              {/* If payer and payer has not paid and cancel time has not reached */}
              {address &&
                !swap.paid &&
                !swap.cancelled &&
                disableButtons.cancel &&
                isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <IconSpinner width="15" className="animate-spin" />{" "}
                    <ToolTip
                      className="flex gap-1 w-full justify-between md:justify-start"
                      tip={
                        <>
                          Waiting for you to make the payment and to click{" "}
                          <b>'I Have Paid'</b>.
                          <br />
                          <br />
                          The counterpart or protocol may cancel the trade if
                          you fail to pay within the time limit.
                        </>
                      }
                    >
                      <span>Awaiting your payment {""}</span>
                      <IconInfoCircle width="15" />
                    </ToolTip>
                  </span>
                )}

              {/* If payer and payer has not paid and cancel time has reached */}
              {address &&
                !swap.paid &&
                !swap.cancelled &&
                !disableButtons.cancel &&
                isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <IconSpinner width="15" className="animate-spin" />{" "}
                    <ToolTip
                      className="flex gap-1 w-full justify-between md:justify-start"
                      tip="You did mark the swap as paid within the time limit. The counterpart or protocol may cancel the trade at any time."
                    >
                      <span>
                        <b>Timeout! </b>Awaiting cancellation {""}
                      </span>
                      <IconInfoCircle width="15" />
                    </ToolTip>
                  </span>
                )}

              {/* If payer and payer has paid */}
              {address &&
                swap.paid &&
                !swap.released &&
                !isDisputed(swap) &&
                isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <IconSpinner width="15" className="animate-spin" />{" "}
                    <ToolTip
                      className="flex gap-1 w-full justify-between md:justify-start"
                      tip={
                        <span>
                          Waiting for counterpart to release the swap. You may
                          start a dispute ("Appeal") if the counterpart fails to
                          release the swap within the time limit.
                          <br />
                          <br />
                          The counterpart may also start a dispute ("Appeal") if
                          there is an issue with your payment.
                        </span>
                      }
                    >
                      <span>
                        Waiting for release {""}
                        <CountDown
                          prefix="Dispute in: "
                          className="[&>span.time]:text-chinese-green"
                          isoDate={swap.disputeFrom}
                        />
                      </span>
                      <IconInfoCircle width="15" />
                    </ToolTip>
                  </span>
                )}

              {/* If payer and swap is cancelled */}
              {address &&
                ((swap.cancelled && !isDisputed(swap)) ||
                  (isDisputed(swap) &&
                    getSwapDisputeOutcome(swap) == "cancelled")) &&
                isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <XCircle width="15" />{" "}
                    <span>
                      {!isDisputed(swap) && "Swap has been cancelled"}
                      {isDisputed(swap) &&
                        isSwapDisputeExecuted(swap) &&
                        "Swap has been cancelled via dispute resolution"}
                      {isDisputed(swap) &&
                        !isSwapDisputeExecuted(swap) &&
                        "Swap will be cancelled after dispute verdict execution"}
                      .
                    </span>
                  </span>
                )}

              {/* If payer and releaser has released */}
              {address &&
                !swap.cancelled &&
                ((swap.released && !isDisputed(swap)) ||
                  (isDisputed(swap) &&
                    getSwapDisputeOutcome(swap) == "released")) &&
                isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <CheckCircle width="15" />{" "}
                    <ToolTip
                      className="flex gap-1 w-full justify-between md:justify-start"
                      tip=""
                    >
                      <span>
                        {!isDisputed(swap) && "Swap has been released"}
                        {isDisputed(swap) &&
                          isSwapDisputeExecuted(swap) &&
                          "Swap has been released via dispute resolution"}
                        {isDisputed(swap) &&
                          !isSwapDisputeExecuted(swap) &&
                          "Swap will be released after dispute verdict execution"}
                        .
                      </span>
                      <IconInfoCircle width="15" />
                    </ToolTip>
                  </span>
                )}

              {/* If payer and swap has been disputed and the dispute has not been executed */}
              {address &&
                swap.paid &&
                !swap.released &&
                isDisputed(swap) &&
                !isSwapDisputeEnded(swap) &&
                isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <IconConflict width="15" />{" "}
                    <ToolTip
                      className="flex gap-1 w-full justify-between md:justify-start"
                      tip={
                        <span>
                          This swap is now locked in a dispute. The disputer
                          wants the swap to be{" "}
                          <b>
                            {swap.disputes[0].wantRelease
                              ? "released"
                              : "cancelled"}
                          </b>
                          .
                        </span>
                      }
                    >
                      <span>
                        {isDisputer(swap, address)
                          ? "You started a dispute"
                          : "The counterpart started a dispute"}
                        {swap.disputes[0].wantRelease
                          ? " to release the swap"
                          : " to cancel the swap"}
                      </span>
                      <IconInfoCircle width="15" />
                    </ToolTip>
                  </span>
                )}

              {/* If payer and swap has been disputed but the dispute was abandoned */}
              {address &&
                swap.paid &&
                !swap.released &&
                (swapPageState.revealPhaseEnded == undefined ||
                  swapPageState.revealPhaseEnded) &&
                isLastDisputeStalled(swap) &&
                isEqlStr(getPayer(swap), address) && (
                  <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                    <IconConflict width="15" />{" "}
                    <ToolTip
                      className="flex gap-1 w-full justify-between md:justify-start"
                      tip={
                        <span>
                          The mediators could not reach a verdict. You may{" "}
                          <b>re-appeal</b> if the issues remain.
                        </span>
                      }
                    >
                      <span>The previous dispute is inconclusive</span>
                      <IconInfoCircle width="15" />
                    </ToolTip>
                  </span>
                )}
            </>
          )}

          <span
            data-click-trigger="1"
            className="flex py-1 text-[12px] text-gray-400 gap-1 items-center tracking-wide font-light"
          >
            <span className="text-gray-500">
              <ToolTip
                tip={moment(swap.createdAt).fromNow()}
                className="flex gap-1 items-center"
              >
                <span>
                  <TimerIcon />
                </span>
                <span>
                  {moment(swap.createdAt)
                    .format("DD MMM YYYY, h:mm:ss a")
                    .toUpperCase()}
                </span>
              </ToolTip>
            </span>
          </span>
          {address && !isSwapParticipant(swap, address) && (
            <div className="flex">
              <SwapRowLinks swap={swap} />
            </div>
          )}
        </div>

        {address && isSwapCounterparty(swap, address) && (
          <div
            data-click-trigger="1"
            className="flex justify-between border-t border-card-border"
          >
            <div data-click-trigger="1" className="pt-1 pl-1 flex gap-1">
              {/* Buttons for swap counterparties  */}
              {address && isSwapCounterparty(swap, address) && (
                <>
                  {address &&
                    swap.paid &&
                    ((!isDisputed(swap) && !swap.released) ||
                      isInDispute(swap)) &&
                    !isEqlStr(getPayer(swap), address) && (
                      <Button
                        size="sm"
                        rounded="lg"
                        className="text-xs md:text-sm min-w-[100px]"
                        scale="sm"
                      >
                        Release
                      </Button>
                    )}

                  {!swap.paid &&
                    !swap.cancelled &&
                    address &&
                    disableButtons.cancel &&
                    moment(swap.cancelAt).isAfter(moment()) &&
                    isEqlStr(getPayer(swap), address) && (
                      <Button
                        size="sm"
                        rounded="lg"
                        className="text-xs md:text-sm min-w-[108px]"
                        scale="sm"
                        onClick={doMarkAsPaid}
                        disabled={
                          loading[swap.orderId]?.markOrderAsPaid ||
                          triggered[swap.orderId]?.markOrderAsPaid
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

                  {address && !swap.cancelled && !swap.paid && (
                    <Button
                      size="sm"
                      variant="destructive"
                      rounded="lg"
                      className="text-xs md:text-sm min-w-[100px]"
                      scale="sm"
                      onClick={doCancel}
                      disabled={
                        disableButtons.cancel ||
                        loading[swap.orderId]?.cancelOrder ||
                        triggered[swap.orderId]?.cancelOrder
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
                      <CountDown
                        wrapL="&nbsp;("
                        prefix=""
                        isoDate={swap.cancelAt}
                        onDone={() => {
                          setDisableButtons({
                            ...disableButtons,
                            cancel: false,
                          });
                        }}
                      />
                    </Button>
                  )}

                  {canAppeal(swap) && (
                    <Button
                      size="sm"
                      variant="outline"
                      rounded="lg"
                      className="text-xs md:text-sm hover:bg-black hover:text-chinese-green"
                      scale="sm"
                      disabled={disableButtons.appeal}
                    >
                      Appeal
                      <CountDown
                        wrapL="&nbsp;("
                        isoDate={swap.disputeFrom}
                        onDone={() => {
                          setDisableButtons({
                            ...disableButtons,
                            appeal: false,
                          });
                        }}
                      />
                    </Button>
                  )}
                </>
              )}
            </div>
            <div
              data-click-trigger="1"
              className="flex items-center border-l border-gray-800 shrink-0"
            >
              <SwapRowLinks swap={swap} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
