import { cn } from "../../libs/utils.ts";
import {
  getPayer,
  getSwapDisputeOutcome,
  isDisputeAbandoned,
  isDisputed,
  isDisputer,
  isLastDisputeStalled,
  isSwapDisputeEnded,
  isSwapDisputeExecuted,
  isSwapParticipant,
} from "../../libs/api_utils.ts";
import { isEqlStr } from "../../libs/helpers.ts";
import IconSpinner from "../icons/IconSpinner.tsx";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { CountDown } from "../Countdown.tsx";
import { CheckCircle, XCircle } from "lucide-react";
import IconConflict from "../icons/IconConflict.tsx";
import moment from "moment/moment";
import { TimerIcon } from "@radix-ui/react-icons";
import { SwapRowLinks } from "./SwapRowLinks.tsx";
import { SwapPageState } from "../../hooks/store/useStore.ts";
import { IDBadge } from "../IDBadge.tsx";

export default function SwapRowLayer2({
  swap,
  address,
  swapPageState,
  disableCancelBtn,
}: {
  swap: Swap;
  address: string;
  swapPageState: SwapPageState;
  disableCancelBtn: boolean;
}) {
  const disputeStatus = getSwapDisputeOutcome(swap);

  const as = {
    releaser: {
      isWaitingForPayment: false,
      isPaid: false,
      isReleased: false,
      isCancelled: false,
      isSwapDisputed: false,
      isDisputeStalled: false,
    },
    payer: {
      isWaitingForPayment: false,
      isPaymentTimeout: false,
      isPaid: false,
      isReleased: false,
      isCancelled: false,
      isSwapDisputed: false,
      isDisputeStalled: false,
    },
  };

  as.releaser.isWaitingForPayment =
    !!address &&
    !swap.paid &&
    !swap.cancelled &&
    !isEqlStr(getPayer(swap), address);

  as.releaser.isPaid =
    !!address &&
    swap.paid &&
    !swap.released &&
    !isDisputed(swap) &&
    !isEqlStr(getPayer(swap), address);

  as.releaser.isReleased =
    !!address &&
    swap.paid &&
    ((swap.released && !isDisputed(swap)) ||
      (isDisputed(swap) && disputeStatus == "" && !!swap.released) ||
      (isDisputed(swap) && disputeStatus == "stalled" && !!swap.released) ||
      (isDisputed(swap) && disputeStatus == "released")) &&
    !isEqlStr(getPayer(swap), address);

  as.releaser.isCancelled =
    !!address &&
    ((swap.cancelled && !isDisputed(swap)) ||
      (isDisputed(swap) && disputeStatus == "cancelled")) &&
    !isEqlStr(getPayer(swap), address);

  as.releaser.isSwapDisputed =
    !!address &&
    swap.paid &&
    !swap.released &&
    isDisputed(swap) &&
    !isSwapDisputeEnded(swap) &&
    !swapPageState.revealPhaseEnded &&
    !isEqlStr(getPayer(swap), address);

  as.releaser.isDisputeStalled =
    !!address &&
    swap.paid &&
    !swap.released &&
    (isDisputeAbandoned(swap) || isLastDisputeStalled(swap)) &&
    !isEqlStr(getPayer(swap), address);

  as.payer.isWaitingForPayment =
    !!address &&
    !swap.paid &&
    !swap.cancelled &&
    disableCancelBtn &&
    isEqlStr(getPayer(swap), address);

  as.payer.isPaymentTimeout =
    !!address &&
    !swap.paid &&
    !swap.cancelled &&
    !disableCancelBtn &&
    isEqlStr(getPayer(swap), address);

  as.payer.isPaid =
    !!address &&
    swap.paid &&
    !swap.released &&
    !isDisputed(swap) &&
    isEqlStr(getPayer(swap), address);

  as.payer.isCancelled =
    !!address &&
    ((swap.cancelled && !isDisputed(swap)) ||
      (isDisputed(swap) && disputeStatus == "cancelled")) &&
    isEqlStr(getPayer(swap), address);

  as.payer.isReleased =
    !!address &&
    !swap.cancelled &&
    ((swap.released && !isDisputed(swap)) ||
      (isDisputed(swap) && disputeStatus == "" && !!swap.released) ||
      (isDisputed(swap) && disputeStatus == "stalled" && !!swap.released) ||
      (isDisputed(swap) && disputeStatus == "released")) &&
    isEqlStr(getPayer(swap), address);

  as.payer.isSwapDisputed =
    !!address &&
    swap.paid &&
    !swap.released &&
    isDisputed(swap) &&
    !isSwapDisputeEnded(swap) &&
    isEqlStr(getPayer(swap), address);

  as.payer.isDisputeStalled =
    !!address &&
    swap.paid &&
    !swap.released &&
    (swapPageState.revealPhaseEnded == undefined ||
      swapPageState.revealPhaseEnded) &&
    isLastDisputeStalled(swap) &&
    isEqlStr(getPayer(swap), address);

  return (
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
          {as.releaser.isWaitingForPayment && (
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
          {as.releaser.isPaid && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <IconSpinner width="15" className="animate-spin" />{" "}
              <ToolTip
                className="flex gap-1 w-full justify-between md:justify-start"
                tip={
                  <span>
                    The payer has indicated that they have made payment.{" "}
                    <b className="text-chinese-green">
                      Verify the payment and click 'Release' to release the
                      asset to the payer if and only if you have received the
                      payment
                    </b>
                    . <br />
                    <br />
                    The payer may start a dispute if you fail to release the
                    asset within the time limit.
                    <br />
                    <br />
                    You may also start a dispute ("Appeal") if there is a
                    problem with the payment.
                  </span>
                }
              >
                <span>
                  Payer has paid.{" "}
                  <span className="font-medium animate-pulse duration-1000 text-chinese-green">
                    Verify payment and release
                  </span>
                </span>
                <IconInfoCircle width="15" />
              </ToolTip>
            </span>
          )}

          {/* If releaser and releaser has released */}
          {as.releaser.isReleased && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <CheckCircle width="15" />{" "}
              <span>
                {(!isDisputed(swap) ||
                  (isDisputed(swap) &&
                    ["", "stalled"].includes(disputeStatus) &&
                    swap.released)) &&
                  "Swap was released"}

                {isDisputed(swap) &&
                  isSwapDisputeExecuted(swap) &&
                  !["", "stalled"].includes(disputeStatus) &&
                  "Swap was released via dispute resolution"}

                {!swap.released &&
                  isDisputed(swap) &&
                  !isSwapDisputeExecuted(swap) &&
                  "Swap will be released after dispute verdict execution"}
              </span>
            </span>
          )}

          {/* If releaser and swap has been cancelled */}
          {as.releaser.isCancelled && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <XCircle width="15" />{" "}
              <span>
                {!isDisputed(swap) && "Swap was cancelled"}
                {isDisputed(swap) &&
                  isSwapDisputeExecuted(swap) &&
                  "Swap was cancelled via dispute resolution"}
                {isDisputed(swap) &&
                  !isSwapDisputeExecuted(swap) &&
                  "Swap will be cancelled after dispute verdict execution"}
              </span>
            </span>
          )}

          {/* If releaser and swap has been disputed */}
          {as.releaser.isSwapDisputed && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <IconConflict width="15" />{" "}
              <ToolTip
                className="flex gap-1 w-full justify-between md:justify-start"
                tip={
                  <span>
                    This swap is now locked in a dispute. The disputer wants the
                    swap to be{" "}
                    <b>
                      {swap.disputes[0].wantRelease ? "released" : "cancelled"}
                    </b>
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
          {as.releaser.isDisputeStalled && (
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
          {as.payer.isWaitingForPayment && (
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
                    The counterpart or protocol may cancel the trade if you fail
                    to pay within the time limit.
                  </>
                }
              >
                <span>Awaiting your payment {""}</span>
                <IconInfoCircle width="15" />
              </ToolTip>
            </span>
          )}

          {/* If payer and payer has not paid and cancel time has reached */}
          {as.payer.isPaymentTimeout && (
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
          {as.payer.isPaid && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <IconSpinner width="15" className="animate-spin" />{" "}
              <ToolTip
                className="flex gap-1 w-full justify-between md:justify-start"
                tip={
                  <span>
                    Waiting for counterpart to release the swap. You may start a
                    dispute ("Appeal") if the counterpart fails to release the
                    swap within the time limit.
                    <br />
                    <br />
                    The counterpart may also start a dispute ("Appeal") if there
                    is an issue with your payment.
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
          {as.payer.isCancelled && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <XCircle width="15" />{" "}
              <span>
                {!isDisputed(swap) && "Swap was cancelled"}
                {isDisputed(swap) &&
                  isSwapDisputeExecuted(swap) &&
                  "Swap was cancelled via dispute resolution"}
                {isDisputed(swap) &&
                  !isSwapDisputeExecuted(swap) &&
                  "Swap will be cancelled after dispute verdict execution"}
              </span>
            </span>
          )}

          {/* If payer and releaser has released */}
          {as.payer.isReleased && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <CheckCircle width="15" />{" "}
              <ToolTip
                className="flex gap-1 w-full justify-between md:justify-start"
                tip=""
              >
                <span>
                  {(!isDisputed(swap) ||
                    (isDisputed(swap) &&
                      disputeStatus == "" &&
                      swap.released)) &&
                    "Swap was released"}

                  {isDisputed(swap) &&
                    isSwapDisputeExecuted(swap) &&
                    "Swap was released via dispute resolution"}

                  {!swap.released &&
                    isDisputed(swap) &&
                    !isSwapDisputeExecuted(swap) &&
                    "Swap will be released after dispute verdict execution"}
                </span>
                <IconInfoCircle width="15" />
              </ToolTip>
            </span>
          )}

          {/* If payer and swap has been disputed and the dispute has not been executed */}
          {as.payer.isSwapDisputed && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <IconConflict width="15" />{" "}
              <ToolTip
                className="flex gap-1 w-full justify-between md:justify-start"
                tip={
                  <span>
                    This swap is now locked in a dispute. The disputer wants the
                    swap to be{" "}
                    <b>
                      {swap.disputes[0].wantRelease ? "released" : "cancelled"}
                    </b>
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

          {/* If payer and swap has been disputed but the dispute was stalled */}
          {as.payer.isDisputeStalled && (
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
        className="flex py-1 text-[12px] text-gray-400 gap-1 items-center tracking-wide font-light justify-between md:justify-start"
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
        <IDBadge id={swap?.orderId} tip="Swap ID" />
      </span>
      {address && !isSwapParticipant(swap, address) && (
        <div className="flex">
          <SwapRowLinks swap={swap} />
        </div>
      )}
    </div>
  );
}
