import { BaseSyntheticEvent, useState } from "react";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { StatCard } from "../market/StatCard.tsx";
import { cn } from "../../libs/utils.ts";
import { PairAvatar } from "../avatar/PairAvatar.tsx";
import { isSwapCounterparty } from "../../libs/api_utils.ts";
import { formatToHighDenom, formatToMoney } from "../../libs/helpers.ts";
import { USDAmountToolTip } from "../USDAmountToolTip.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import useStore from "../../hooks/store/useStore.ts";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import useCoreContract from "../../hooks/services/contracts/useCoreContract.ts";
import { useToast } from "../../hooks/toast/toast.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { cancelOrderFunc } from "./functions/cancelOrderFunc.tsx";
import { markOrderAsPaidFunc } from "./functions/markOrderAsPaidFunc.ts";
import { releaseOrderFunc } from "./functions/releaseOrderFunc.ts";
import { SwapStatusBadge } from "./SwapStatusBadge.tsx";
import { appealOrderFunc } from "./functions/appealOrderFunc.ts";
import useDisputeManagerContract from "../../hooks/services/contracts/useDisputeManagerContract.ts";
import SwapRowLayer2 from "./SwapRowLayer2.tsx";
import SwapRowLayer3 from "./SwapRowLayer3.tsx";

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
  const [, setDisputeId] = useState<number | undefined>(
    swap.disputes.length ? swap.disputes[0].disputeId : undefined
  );
  const { cancelOrder, markOrderAsPaid, releaseOrder, humanizeErrors } =
    useCoreContract();
  const { createDispute, humanizeErrors: humanizeErrorsDM } =
    useDisputeManagerContract();
  const { notifyError, notifySuccess } = useToast();
  const { swapPageState } = useStore((s) => ({
    swapPageState: s.swapPageState,
  }));
  const [disableButtons, setDisableButtons] = useState<ButtonEnableState>({
    appeal: true,
    cancel: true,
    markAsPaid: false,
    release: false,
  });
  const { loading, setLoading } = useStore((s) => ({
    loading: s.loading,
    setLoading: s.setLoading,
  }));

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
      setLoading,
      humanizeErrors,
      notifySuccess,
      notifyError
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
      notifyError
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

                <SwapStatusBadge
                  paid={swap.paid}
                  cancelled={swap.cancelled}
                  swap={swap}
                  address={address}
                  released={swap.released}
                  byDispute={swap.byDispute}
                  disputes={swap.disputes}
                />
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
        <SwapRowLayer2
          swap={swap}
          address={address}
          swapPageState={swapPageState}
          disableCancelBtn={disableButtons.cancel ?? false}
        />

        {address && isSwapCounterparty(swap, address) && (
          <SwapRowLayer3
            address={address}
            swap={swap}
            doRelease={doRelease}
            doCancel={doCancel}
            doMarkAsPaid={doMarkAsPaid}
            doAppeal={doAppeal}
            disableButtons={disableButtons}
            loading={loading}
            setDisableButtons={setDisableButtons}
          />
        )}
      </div>
    </div>
  );
}
