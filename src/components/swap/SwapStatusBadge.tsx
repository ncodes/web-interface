import {
  getPayer,
  getSwapDisputeOutcome,
  isDisputed,
  isDisputer,
  isInDispute,
  isLastDisputeStalled,
  isSwapDisputeExecuted,
} from "../../libs/api_utils.ts";
import { ToolTip } from "../ToolTip.tsx";
import IconNoPay from "../icons/IconNoPay.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import IconPaySent from "../icons/IconPaySent.tsx";
import { CheckCircle, XCircle } from "lucide-react";
import IconConflict from "../icons/IconConflict.tsx";

export function SwapStatusBadge({
  paid,
  cancelled,
  swap,
  address,
  released,
  byDispute,
  disputes,
}: {
  paid: boolean;
  cancelled: boolean;
  swap: Swap;
  address: string;
  released: boolean | undefined;
  byDispute: boolean;
  disputes: Dispute[];
}) {
  const isReleased =
    (released && !isDisputed(swap)) ||
    (released && isDisputed(swap) && getSwapDisputeOutcome(swap) == "") ||
    (released && isDisputed(swap) && swap.disputes[0].orderReleased) ||
    (isDisputed(swap) &&
      getSwapDisputeOutcome(swap) == "released" &&
      isSwapDisputeExecuted(swap));

  const isCancelled =
    (cancelled && !isDisputed(swap)) ||
    (isDisputed(swap) &&
      isSwapDisputeExecuted(swap) &&
      getSwapDisputeOutcome(swap) == "cancelled");

  const disputed =
    address &&
    isDisputed(swap) &&
    !isSwapDisputeExecuted(swap) &&
    !released &&
    !cancelled;

  return (
    <span className="flex items-center gap-1 text-xs font-light tracking-wider text-green-400">
      {!paid && !cancelled && !isInDispute(swap) && (
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

      {paid && !released && !isDisputed(swap) && (
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

      {isReleased && (
        <>
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
        </>
      )}

      {isCancelled && (
        <span className="flex bg-red-300/30 rounded-full px-[4px] text-xs items-center font-medium tracking-wider border-red-300 text-red-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={
              byDispute
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

      {disputed && (
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
                    {disputes[0].wantRelease ? (
                      <>
                        <b className="text-chinese-green">release</b> the swap.
                      </>
                    ) : (
                      <>
                        <b className="text-chinese-green">cancel</b> the swap.
                      </>
                    )}
                  </>
                )}
                {isLastDisputeStalled(swap) && (
                  <>
                    The previous dispute is inconclusive. The mediators could
                    not reach a verdict. A new dispute must be started.
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
  );
}
