import { BaseSyntheticEvent, useState } from "react";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { StatCard } from "../market/StatCard.tsx";
import { Button } from "../ui/Button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { cn } from "../../libs/utils.ts";
import { DotsVerticalIcon, TimerIcon } from "@radix-ui/react-icons";
import { PairAvatar } from "../avatar/PairAvatar.tsx";
import IconNoPay from "../icons/IconNoPay.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { ToolTip } from "../ToolTip.tsx";
import {
  canAppeal,
  getPayer,
  isDisputeAbandoned,
  isDisputed,
  isDisputer,
} from "../../libs/api_utils.ts";
import useConnector from "../../hooks/connectors/useConnector.tsx";
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
  const { address } = useConnector();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [enableButtons, setEnableButtons] = useState<ButtonEnableState>({
    appeal: true,
    cancel: true,
  });

  return (
    <div
      className="select-none"
      onClick={(e: BaseSyntheticEvent) => {
        const canTrigger = e.target.getAttribute("data-click-trigger");
        if (canTrigger && canTrigger == "1" && !noFocus) {
          // do something
        }
      }}
    >
      <div
        data-click-trigger="1"
        className={cn(
          "border bg-card-background border-card-border transition-all duration-300 rounded-xl",
          {
            "hover:scale-[1.002] hover:border-chinese-green cursor-pointer":
              !noFocus,
          },
          className
        )}
      >
        <div className="flex flex-col md:flex-row" data-click-trigger="1">
          <div
            data-click-trigger="1"
            className="flex gap-2 p-5 px-3 md:px-3 py-0 items-center shrink-0 md:border-r border-gray-800"
          >
            <div className="flex w-full items-center gap-2 md:px-0 md:py-4 pt-2 md:pt-4">
              <PairAvatar
                base={swap.base}
                quote={swap.quote}
                baseSrc={swap.market.baseLogo}
                quoteSrc={swap.market.quoteLogo}
              />
              <div className="flex md:flex-col gap-2 items-center md:items-start w-full justify-between md:justify-start ">
                <span className="tracking-wide text-xs xs:text-[16px]">
                  {swap.base}
                  <span className="text-gray-500 inline-block mx-1">/</span>
                  {swap.quote}
                </span>

                <span className="flex items-center gap-1 text-xs font-light tracking-wider text-green-400">
                  {!swap.paid && !swap.cancelled && !isDisputed(swap) && (
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

                  {swap.released && (
                    <span className="flex bg-chinese-green/30 rounded-full px-[4px] text-xs items-center font-medium tracking-wider text-chinese-green border-chinese-green">
                      <ToolTip
                        className="flex items-center gap-1"
                        tip={"The asset has been released"}
                      >
                        <CheckCircle width="15" />{" "}
                        <span className="hidden xs:inline">Released</span>
                        <IconInfoCircle
                          width="15"
                          className="hidden xs:inline text-chinese-green"
                        />
                      </ToolTip>
                    </span>
                  )}

                  {address &&
                    isDisputed(swap) &&
                    !swap.released &&
                    !swap.cancelled && (
                      <span className="flex bg-orange-400/30 rounded-xl p-[2px] px-[4px] pb-[3px] text-xs items-center gap-1 font-medium tracking-wider text-orange-400 border-orange-400">
                        <ToolTip
                          className="flex items-center gap-1"
                          tip={
                            isDisputer(swap, address || "")
                              ? `You initiated a dispute to ${
                                  swap.disputes[0].wantRelease
                                    ? `"release" the asset`
                                    : `"cancel" the swap`
                                }`
                              : `The counterpart initiated a dispute to ${
                                  swap.disputes[0].wantRelease
                                    ? `"release" the asset`
                                    : `"cancel" the swap`
                                }`
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

                  {swap.cancelled && (
                    <span className="flex bg-red-400/30 rounded-full px-[4px] text-xs items-center font-medium tracking-wider border-red-400 text-red-400">
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
                          className="hidden xs:inline text-red-400"
                        />
                      </ToolTip>
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden shrink-0">
            <ScrollGradientIndicator>
              <ScrollAreaHorizontal className="flex mr-[1px]">
                <div
                  className="flex-1 flex py-2 px-2 gap-2"
                  data-click-trigger="1"
                >
                  <StatCard
                    title={`Price (${swap.quote})`}
                    tip={`The price of 1 ${swap.base} in ${swap.quote}`}
                  >
                    <span className="flex gap-1">
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
                    <span className="flex gap-1 text-gray-200">
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
                    <span className="flex gap-1 text-gray-200">
                      <span>{formatToMoney(swap.cost)}</span>
                      <USDAmountToolTip v={swap.costUsd} />
                    </span>
                  </StatCard>
                  <StatCard
                    title={`Fee (${swap.feeSymbol})`}
                    tip={`The amount of fee paid`}
                  >
                    <span className="flex gap-1 text-gray-200">
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
            </ScrollGradientIndicator>
          </div>
        </div>

        {/* Layer 2 */}
        <div className="border-t border-gray-800 px-3 py-1 flex flex-col md:flex-row md:justify-between">
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
                    Waiting for payment.
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
                    <span className="font-medium animate-pulse duration-[5000ms] text-chinese-green">
                      Verify payment and release.
                    </span>
                    <CountDown
                      prefix="Disputable in: "
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
            swap.released &&
            !isEqlStr(getPayer(swap), address) && (
              <span className="flex gap-1 text-gray-400 text-xs items-center font-light tracking-wide">
                <CheckCircle width="15" />{" "}
                <span>
                  Swap has been released
                  {isDisputed(swap) && " via dispute resolution"}.
                </span>
              </span>
            )}

          {/* If releaser and swap has been cancelled */}
          {address &&
            !swap.paid &&
            swap.cancelled &&
            !isEqlStr(getPayer(swap), address) && (
              <span className="flex gap-1 text-gray-400 text-xs items-center font-light tracking-wide">
                <XCircle width="15" />{" "}
                <span>
                  Swap has been cancelled
                  {isDisputed(swap) && " via dispute resolution"}.
                </span>
              </span>
            )}

          {/* If releaser and swap has been disputed */}
          {address &&
            swap.paid &&
            !swap.released &&
            isDisputed(swap) &&
            !isDisputeAbandoned(swap) &&
            !isEqlStr(getPayer(swap), address) && (
              <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                <IconConflict width="15" />{" "}
                <ToolTip
                  className="flex gap-1 w-full justify-between md:justify-start"
                  tip={
                    <span>
                      This swap is now locked in a dispute. The disputer wants
                      the swap to be{" "}
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
                      ? " to release the swap."
                      : " to cancel the swap."}
                  </span>
                  <IconInfoCircle width="15" />
                </ToolTip>
              </span>
            )}

          {/* If releaser and swap has been disputed but the dispute was abandoned */}
          {address &&
            swap.paid &&
            !swap.released &&
            isDisputed(swap) &&
            isDisputeAbandoned(swap) &&
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
                  <span>The previous dispute was inconclusive</span>
                  <IconInfoCircle width="15" />
                </ToolTip>
              </span>
            )}

          {/* If payer and payer has not paid */}
          {address &&
            !swap.paid &&
            !swap.cancelled &&
            isEqlStr(getPayer(swap), address) && (
              <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                <IconSpinner width="15" className="animate-spin" />{" "}
                <ToolTip
                  className="flex gap-1 w-full justify-between md:justify-start"
                  tip="Waiting for you to make the payment and click 'I Have Paid'. The counterpart or protocol may cancel the trade if you fail to pay within the time limit."
                >
                  <span>Awaiting your payment {""}</span>
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
                      Waiting for counterpart to release the swap. You may start
                      a dispute ("Appeal") if the counterpart fails to release
                      the swap within the time limit.
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
                      isoDate={swap.disputeFrom}
                    />
                  </span>
                  <IconInfoCircle width="15" />
                </ToolTip>
              </span>
            )}

          {/* If payer and swap is cancelled */}
          {address &&
            !swap.paid &&
            swap.cancelled &&
            isEqlStr(getPayer(swap), address) && (
              <span className="flex text-gray-400 gap-1 text-xs items-center font-light tracking-wide">
                <XCircle width="15" />{" "}
                <span>
                  Swap has been cancelled
                  {isDisputed(swap) && " via dispute resolution"}..
                </span>
              </span>
            )}

          {/* If payer and releaser has released */}
          {address && swap.released && isEqlStr(getPayer(swap), address) && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <CheckCircle width="15" />{" "}
              <ToolTip
                className="flex gap-1 w-full justify-between md:justify-start"
                tip=""
              >
                <span>
                  Swap has been released
                  {isDisputed(swap) && " via dispute resolution"}.
                </span>
                <IconInfoCircle width="15" />
              </ToolTip>
            </span>
          )}

          {/* If payer and swap has been disputed */}
          {address &&
            swap.paid &&
            isDisputed(swap) &&
            !isDisputeAbandoned(swap) &&
            !swap.released &&
            isEqlStr(getPayer(swap), address) && (
              <span className="flex gap-1 text-xs items-center font-light tracking-wide">
                <IconConflict width="15" />{" "}
                <ToolTip
                  className="flex gap-1 w-full justify-between md:justify-start"
                  tip={
                    <span>
                      This swap is now locked in a dispute. The disputer wants
                      the swap to be{" "}
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
                      ? " to release the swap."
                      : " to cancel the swap."}
                  </span>
                  <IconInfoCircle width="15" />
                </ToolTip>
              </span>
            )}

          {/* If payer and swap has been disputed but the dispute was abandoned */}
          {address &&
            swap.paid &&
            isDisputed(swap) &&
            isDisputeAbandoned(swap) &&
            !swap.released &&
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
                  <span>The previous dispute was inconclusive</span>
                  <IconInfoCircle width="15" />
                </ToolTip>
              </span>
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
        </div>

        <div className="flex justify-between border-t border-card-border">
          <div data-click-trigger="1" className="pt-1 pl-1 flex gap-1">
            {swap.paid &&
              !swap.released &&
              address &&
              !isEqlStr(getPayer(swap), address) && (
                <Button
                  size="sm"
                  rounded="lg"
                  className="rounded-tl-none text-xs md:text-sm"
                  scale="sm"
                >
                  Release
                </Button>
              )}

            {!swap.paid &&
              !swap.cancelled &&
              address &&
              isEqlStr(getPayer(swap), address) && (
                <Button
                  size="sm"
                  rounded="lg"
                  className="rounded-tl-none text-xs md:text-sm"
                  scale="sm"
                >
                  I Have Paid
                </Button>
              )}

            {!swap.cancelled && !swap.paid && (
              <Button
                size="sm"
                variant="outline"
                rounded="lg"
                className="text-xs md:text-sm hover:bg-background hover:text-white hover:border-gray-600"
                scale="sm"
                disabled={enableButtons.cancel}
              >
                Cancel{" "}
                <CountDown
                  isoDate={swap.cancelAt}
                  onDone={() => {
                    setEnableButtons({ ...enableButtons, cancel: false });
                  }}
                />
              </Button>
            )}

            {canAppeal(swap) && (
              <Button
                size="sm"
                variant="secondary"
                rounded="lg"
                className="text-xs md:text-sm"
                scale="sm"
                disabled={enableButtons.appeal}
              >
                Appeal{" "}
                <CountDown
                  isoDate={swap.disputeFrom}
                  onDone={() => {
                    setEnableButtons({ ...enableButtons, appeal: false });
                  }}
                />
              </Button>
            )}
          </div>
          <div
            data-click-trigger="1"
            className="flex items-center border-l border-gray-800 shrink-0"
          >
            <span className="hidden lg:inline border-r border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                View Liquidity
              </Button>
            </span>
            <span className="hidden lg:inline border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                View Market
              </Button>
            </span>

            <span className="lg:hidden border-l border-gray-800">
              <DropdownMenu
                onOpenChange={(open) => {
                  setMoreMenuOpen(open);
                }}
              >
                <DropdownMenuTrigger className="outline-0 ring-0">
                  <span
                    className={cn(
                      "px-2 py-3 outline-0 ring-0 flex gap-1  items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green",
                      { "scale-x-105 text-chinese-green": moreMenuOpen }
                    )}
                  >
                    <DotsVerticalIcon />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
                  <DropdownMenuItem className="flex gap-2">
                    View Liquidity
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-2">
                    View Market
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
