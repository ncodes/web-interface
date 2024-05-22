import moment from "moment/moment";
import { Dispatch, SetStateAction } from "react";
import { useInterval } from "usehooks-ts";
import useCoreContract from "../../hooks/services/contracts/useCoreContract.ts";
import useDisputeManagerContract from "../../hooks/services/contracts/useDisputeManagerContract.ts";
import useWindowFocus from "../../hooks/useWindowFocus.ts";
import {
  getPayer,
  isDisputed,
  isLastDisputeStalled,
  isSwapCounterparty,
  isSwapDisputeExecuted,
} from "../../libs/api_utils.ts";
import { isEqlStr } from "../../libs/helpers.ts";
import { CountDown } from "../Countdown.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";
import AppealPopOver from "./AppealPopOver.tsx";
import { SwapRowLinks } from "./SwapRowLinks.tsx";

export default function SwapRowLayer3({
  swap,
  address,
  doRelease,
  doCancel,
  doMarkAsPaid,
  doAppeal,
  disableButtons,
  loading,
  setDisableButtons,
}: {
  address: string;
  swap: Swap;
  doRelease: () => void;
  doCancel: () => void;
  doMarkAsPaid: () => void;
  doAppeal: (wantRelease: boolean) => void;
  disableButtons: ButtonEnableState;
  setDisableButtons: Dispatch<SetStateAction<ButtonEnableState>>;
  loading: LoadingState;
}) {
  const { getOrder } = useCoreContract();
  const { getRecentDispute } = useDisputeManagerContract();
  const windowFocus = useWindowFocus();

  const showCancelBtn = !!address && !swap.cancelled && !swap.paid;

  useInterval(
    async () => {
      const order = await getOrder(BigInt(swap.orderId));
      setDisableButtons({ ...disableButtons, cancel: order?.cancelled });
    },
    showCancelBtn && !disableButtons.cancel ? 3000 : null,
  );

  const showPaidBtn =
    !swap.paid &&
    !swap.cancelled &&
    !!address &&
    disableButtons.cancel &&
    moment(swap.cancelAt).isAfter(moment()) &&
    isEqlStr(getPayer(swap), address);

  useInterval(
    async () => {
      const order = await getOrder(BigInt(swap.orderId));
      setDisableButtons({ ...disableButtons, markAsPaid: order?.paid });
    },
    windowFocus && showPaidBtn && !disableButtons.markAsPaid && showPaidBtn
      ? 3000
      : null,
  );

  const showReleaseBtn =
    !!address &&
    swap.paid &&
    ((!isDisputed(swap) && !swap.released) ||
      (isDisputed(swap) && !isSwapDisputeExecuted(swap) && !swap.released)) &&
    !isEqlStr(getPayer(swap), address);

  useInterval(
    async () => {
      const order = await getOrder(BigInt(swap.orderId));
      setDisableButtons({ ...disableButtons, release: order?.released });
    },
    windowFocus && showReleaseBtn && !disableButtons.release ? 3000 : null,
  );

  const showAppealBtn =
    (swap.disputes.length == 0 &&
      swap.paid &&
      !swap.released &&
      !swap.finalizedAt) || // new dispute
    (swap.disputes.length > 0 && !swap.released && isLastDisputeStalled(swap)); // can re-open abandoned dispute

  useInterval(
    async () => {
      const dispute = await getRecentDispute(BigInt(swap.orderId));
      setDisableButtons({
        ...disableButtons,
        appeal: !!dispute && !dispute?.executed,
      });
    },
    windowFocus && showAppealBtn && !disableButtons.appeal ? 3000 : null,
  );

  return (
    <div
      data-click-trigger="1"
      className="flex justify-between border-t border-gray-800"
    >
      <div data-click-trigger="1" className="pt-1 pl-1 flex gap-1">
        {/* Buttons for swap counterparties  */}
        {address && isSwapCounterparty(swap, address) && (
          <>
            {showReleaseBtn && (
              <Button
                size="sm"
                rounded="lg"
                className="text-xs md:text-sm min-w-[100px]"
                scale="sm"
                onClick={doRelease}
                disabled={
                  disableButtons.release || loading[swap.orderId]?.releaseOrder
                }
              >
                {!loading[swap.orderId]?.releaseOrder && <>Release</>}
                {loading[swap.orderId]?.releaseOrder && (
                  <>
                    <IconSpinner
                      width="20"
                      className="animate-spin text-gray-900"
                    />
                  </>
                )}
              </Button>
            )}

            {showPaidBtn && (
              <Button
                size="sm"
                rounded="lg"
                className="text-xs md:text-sm min-w-[108px]"
                scale="sm"
                onClick={doMarkAsPaid}
                disabled={
                  disableButtons.markAsPaid ||
                  loading[swap.orderId]?.markOrderAsPaid
                }
              >
                {!loading[swap.orderId]?.markOrderAsPaid && <>I Have Paid</>}
                {loading[swap.orderId]?.markOrderAsPaid && (
                  <>
                    <IconSpinner
                      width="20"
                      className="animate-spin text-gray-900"
                    />
                  </>
                )}
              </Button>
            )}

            {showCancelBtn && (
              <Button
                size="sm"
                variant="destructive"
                rounded="lg"
                className="text-xs md:text-sm min-w-[100px]"
                scale="sm"
                onClick={doCancel}
                disabled={
                  disableButtons.cancel || loading[swap.orderId]?.cancelOrder
                }
              >
                {!loading[swap.orderId]?.cancelOrder && <>Cancel</>}
                {loading[swap.orderId]?.cancelOrder && (
                  <>
                    <IconSpinner
                      width="20"
                      className="animate-spin text-gray-100"
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

            {showAppealBtn && (
              <AppealPopOver
                modal={true}
                onActivate={doAppeal}
                isReleaser={!isEqlStr(getPayer(swap), address)}
              >
                <Button
                  size="sm"
                  variant="outline"
                  rounded="lg"
                  className="text-xs md:text-sm hover:bg-black hover:text-chinese-green min-w-[100px]"
                  scale="sm"
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
                        className="animate-spin text-gray-100"
                      />
                    </>
                  )}
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
              </AppealPopOver>
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
  );
}
