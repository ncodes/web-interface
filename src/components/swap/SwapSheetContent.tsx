import { cn } from "../../libs/utils.ts";
import { SwapInput } from "./SwapInput.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";
import { IconSettingsOutline } from "../icons/IconSettingsOutline.tsx";
import { EditSwapSlippage } from "./EditSwapSlippage.tsx";
import { Button } from "../ui/Button.tsx";
import { EditSwapExpiry } from "./EditSwapExpiry.tsx";
import { useEffect, useState } from "react";
import {
  delay,
  formatToHighDenom,
  formatToMoney,
  isDev,
  isEmpty,
  isZero,
  powOfD,
  toDec,
  toHD,
  toHDD,
  toLD,
  trimZeros,
} from "../../libs/helpers.ts";
import IconCaution from "../icons/IconCaution.tsx";
import { useInterval } from "usehooks-ts";
import useCoreContract from "../../hooks/services/contracts/useCoreContract.ts";
import { isERC20, isSynth } from "../../libs/api_utils.ts";
import { useBaseQuoteRate } from "../../hooks/useBaseQuoteRate.ts";
import * as Separator from "@radix-ui/react-separator";
import { useToast } from "../../hooks/toast/toast.tsx";
import { Address, decodeEventLog } from "viem";
import IconSpinner from "../icons/IconSpinner.tsx";
import { useNavigate } from "react-router-dom";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";

/**
 * SwapSheetContent
 * @param liquidity The liquidity object
 * @param market The market object
 * @param offSheet - whether the component is rendered in a sheet or not
 * @constructor
 */
export function SwapSheetContent({
  liquidity,
  market,
  offSheet,
}: {
  liquidity: Liquidity;
  market: Market;
  offSheet?: boolean;
}) {
  const navigate = useNavigate();
  const { computeSwapFee, swapQuoteForBase, humanizeErrors } =
    useCoreContract();
  const { notifyError, notifySuccess } = useToast();
  const [approveLoading, setApproveLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [price] = useState(liquidity.price);
  const [maxPrice, setMaxPrice] = useState(price);
  const [slippage, setSlippage] = useState(0);
  const [expireDuration, setExpireDuration] = useState(0);
  const {
    getChainInfo,
    getTokenBalance,
    approveAllowance,
    getTokenSupply,
    humanizeErc20Errors,
    address,
    ready,
    getTokenAllowance,
  } = useConnectorContext();
  const [quoteBal, setQuoteBal] = useState<bigint>(0n);
  const [canSwap, setCanSwap] = useState(false);
  const [amount, setAmount] = useState("");
  const [slippageAmount, setSlippageAmount] = useState(amount);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [amountErr, setAmountErr] = useState("");
  const [quoteAmountErr, setQuoteAmountErr] = useState("");
  const [amountUsd, setAmountUsd] = useState(0);
  const [quoteAmountUsd, setQuoteAmountUsd] = useState(0);
  const [maxQuoteAmount, setMaxQuoteAmount] = useState("");
  const { baseUsdRate, quoteUsdRate } = useBaseQuoteRate(market, true, true);
  const [hasAllowance, setHasAllowance] = useState(false);
  const [amountInputFocused, setAmountInputFocused] = useState(false);
  const [quoteAmountInputFocused, setQuoteAmountInputFocused] = useState(false);

  const [feeInfo, setFeeInfo] = useState({
    protocol: "0",
    market: "0",
    total: "0",
    totalUsd: "0",
    symbol: "",
    protoFeeBps: 0,
  });

  // Update quote balance every 10 seconds
  useInterval(() => {
    if (!ready) return;
    getQuoteBalance().catch(console.error);
  }, 10000);

  // Update quote balance on mount
  useEffect(() => {
    if (!ready) return;
    getQuoteBalance().catch(console.error);
  }, [ready]);

  // Validate amount and quote amount
  useEffect(() => {
    const { baseDecimals, quoteDecimals } = market;
    const { minSwap, maxSwap } = liquidity;

    let amtErrMsg = "";
    if (amount != "") {
      const amt = toDec(amount);
      const denom = powOfD(1, baseDecimals);
      if (!isZero(minSwap) && amt.mul(denom).lt(toDec(minSwap))) {
        amtErrMsg = "Below minimum amount";
      }

      const mxSwap = !isZero(maxSwap) ? maxSwap : liquidity.amount;
      if (amt.mul(denom).gt(toDec(mxSwap))) {
        amtErrMsg = "Above maximum amount";
      }
    }

    let quoteAmtErrMsg = "";
    if (quoteAmount != "" && !isSynth(market.quoteType)) {
      const quoteAmt = toDec(quoteAmount);
      if (quoteAmt.mul(powOfD(1, quoteDecimals)).gt(toDec(quoteBal))) {
        quoteAmtErrMsg = "Insufficient balance";
      }
    }

    setAmountErr(amtErrMsg);
    setQuoteAmountErr(quoteAmtErrMsg);
  }, [amount, quoteAmount, quoteBal, slippage]);

  // Update USD equivalent for amount and quote amount
  useEffect(() => {
    if (baseUsdRate.data != undefined && amount != "") {
      const amt = toDec(amount);
      setAmountUsd(amt.mul(baseUsdRate.data || 0).toNumber());
    }

    if (quoteUsdRate.data != undefined && quoteAmount != "") {
      const quoteAmt = toDec(quoteAmount);
      setQuoteAmountUsd(quoteAmt.mul(quoteUsdRate.data || 0).toNumber());
    }
  }, [amount, quoteAmount, baseUsdRate.data, quoteUsdRate.data]);

  // Set or update amount when quote amount or price is changed
  useEffect(() => {
    (async () => {
      if (!quoteAmountInputFocused) return;
      if (quoteAmount == "") return setAmount("");

      let amount = toDec(quoteAmount).div(toHD(price, market.quoteDecimals));

      const feeInfo = await computeFeeInfo(amount.toFixed());
      setFeeInfo(feeInfo);

      if (feeInfo.symbol == market.base) amount = amount.sub(feeInfo.total);
      setAmount(trimZeros(amount.toFixed(8)));
    })();
  }, [quoteAmount, price]);

  // Set or update quote amount when amount changed
  useEffect(() => {
    (async () => {
      if (!amountInputFocused) return;
      if (amount == "") return setQuoteAmount("");
      let totalFeeBp = 0;

      const feeInfo = await computeFeeInfo(amount);
      setFeeInfo(feeInfo);

      // Add up fees only when base asset is ERC20 (taker pays fees)
      if (isERC20(market.baseType)) {
        totalFeeBp = feeInfo.protoFeeBps + market.commission;
      }

      const priceHD = toHD(price, market.quoteDecimals);
      const amtD = toDec(amount);
      const feePct = totalFeeBp / 100 / 100;
      const newQuoteAmt = amtD.div(1 - feePct).mul(priceHD);
      setQuoteAmount(trimZeros(newQuoteAmt.toFixed(8)));
    })();
  }, [amount]);

  // Determine if swap can be executed
  useEffect(() => {
    if (amountErr || quoteAmountErr) return setCanSwap(false);
    if (!amount) return setCanSwap(false);
    if (!hasAllowance) return setCanSwap(false);
    if (loading) return setCanSwap(false);
    setCanSwap(true);
  }, [
    quoteBal,
    amount,
    quoteAmount,
    amountErr,
    quoteAmountErr,
    hasAllowance,
    loading,
  ]);

  // Adjust max price and max quote amount when slippage is changed
  useEffect(() => {
    (async () => {
      if (isEmpty(quoteAmount)) return;
      if (isZero(slippage)) {
        setMaxQuoteAmount(quoteAmount);
        setMaxPrice(liquidity.price);
        return;
      }

      // compute max price
      const price = toDec(liquidity.price);
      const maxPrice = price.add(price.mul(slippage / 100)).toFixed();
      setMaxPrice(maxPrice);

      // compute output amount
      const { quoteDecimals } = market;
      const newAmount = toDec(quoteAmount).div(toHD(maxPrice, quoteDecimals));
      let totalFees = "0";

      // Add up fees only when base asset is ERC20 (taker pays fees)
      if (isERC20(market.baseType)) {
        const feeInfo = await computeFeeInfo(newAmount.toFixed());
        totalFees = feeInfo.total;
      }

      setSlippageAmount(newAmount.sub(totalFees).toFixed());
    })();
  }, [slippage, quoteAmount]);

  // Update allowance status
  useEffect(() => {
    (async () => {
      if (isZero(maxQuoteAmount)) return setHasAllowance(false);
      if (!isERC20(market.quoteType)) return setHasAllowance(true);

      const allowance = await getTokenAllowance(
        market.quoteAddress,
        address,
        getChainInfo().contracts?.core.address
      );

      const maxQuoteAmtLD = toLD(maxQuoteAmount, market.quoteDecimals);
      setHasAllowance(toDec(allowance).gte(maxQuoteAmtLD));
    })();
  }, [maxQuoteAmount, approveLoading]);

  // Get quote balance
  async function getQuoteBalance() {
    if (isSynth(market.quoteType)) return;
    const { quoteAddress } = market;
    const bal = await getTokenBalance(quoteAddress, address);
    setQuoteBal(bal);
  }

  // Compute fee info
  async function computeFeeInfo(amount: string) {
    if (isZero(amount))
      return {
        protocol: "0",
        market: "0",
        total: "0",
        symbol: "",
        totalUsd: "",
        protoFeeBps: 0,
      };

    const { provider, lid } = liquidity;
    const amt = toLD(amount, market.baseDecimals);
    const fee = await computeSwapFee(
      market.address,
      provider,
      lid,
      address,
      amt,
      price
    );

    let symbol: string;
    let decimals: number;
    let usdRate: number;
    const { base, baseDecimals, quote, quoteDecimals, baseType, quoteType } =
      market;

    if (
      (isERC20(baseType) && isERC20(quoteType)) ||
      (isERC20(baseType) && isSynth(quoteType))
    ) {
      symbol = base;
      decimals = baseDecimals;
      usdRate = baseUsdRate.data || 0;
    } else if (isSynth(baseType) && isERC20(quoteType)) {
      symbol = quote;
      decimals = quoteDecimals;
      usdRate = quoteUsdRate.data || 0;
    } else {
      symbol = "P2P";
      decimals = 18;
      usdRate = 0; // TODO: get P2P rate
    }

    const total = toHD(fee.protocolFee + fee.marketFee, decimals);
    const totalUsd = toDec(total).mul(usdRate);
    return {
      protocol: toHD(fee.protocolFee, decimals),
      market: toHD(fee.marketFee, decimals),
      total: total,
      totalUsd: totalUsd.toFixed(totalUsd.lt(1) ? undefined : 2),
      symbol,
      protoFeeBps: toDec(fee.feeBp).toNumber(),
    };
  }

  // Reset all states
  function reset() {
    setQuoteAmount("");
    setAmount("");
    setFeeInfo({
      protocol: "0",
      market: "0",
      total: "0",
      totalUsd: "0",
      symbol: "",
      protoFeeBps: 0,
    });
  }

  // Request and execute token allowance
  async function doRequestAllowance() {
    try {
      setApproveLoading(true);
      await approveAllowance(
        market.quoteAddress as Address,
        getChainInfo().contracts?.core.address as Address,
        await getTokenSupply(market.baseAddress as Address)
      );
      await delay(5000);
      notifySuccess("Allowance successfully approved", { duration: 5000 });
    } catch (error) {
      const msg = humanizeErc20Errors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setApproveLoading(false);
    }
  }

  async function doSwap() {
    try {
      setLoading(true);
      const { address, quoteDecimals, baseType, baseDecimals } = market;
      const { provider, lid, price } = liquidity;
      const quoteAmt = toDec(quoteAmount);
      const [txHash, txReceipt] = await swapQuoteForBase(
        address,
        provider,
        undefined,
        lid,
        !isSynth(baseType)
          ? toLD(quoteAmt.div(toHD(price, quoteDecimals)), baseDecimals)
          : toLD(amount, baseDecimals),
        toLD(maxPrice, quoteDecimals),
        [],
        0 // TODO: use moment().add(expireDuration, "s").unix()
      );

      // give backend a chance to process tx
      await delay(5000);

      // For interactive swap, redirect to swap page
      if (!market.instant) {
        const event = decodeEventLog({
          abi: getChainInfo().contracts?.core.abi,
          data: txReceipt.logs[txReceipt.logs.length - 1].data,
          topics: txReceipt.logs[txReceipt.logs.length - 1].topics,
        });
        const orderId = (event.args as { numTypeInfo: bigint[] })
          .numTypeInfo[0];
        navigate(`/swap/${orderId}`);
        return;
      }

      reset();
      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Swap was successful`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn("text-white flex flex-col justify-between overflow-auto", {
        "overflow-auto h-full": !offSheet,
      })}
    >
      <div className="flex-1 h-[90vh] xl:h-[100vh]">
        {!offSheet && (
          <div className="flex text-gray-400 w-full px-5 py-2 items-center bg-card-background border-b border-gray-900">
            <span className="flex gap-2 items-center text-sm">
              <span>
                1 {market.base} <span className="text-gray-400">@</span>
              </span>
              <span className="flex  flex-co items-center gap-2">
                <span>
                  {formatToHighDenom(price, market.quoteDecimals)}{" "}
                  {market.quote}
                </span>
                <span className="text-gray-500 text-xs">
                  ($
                  {toHDD(price, market.quoteDecimals)
                    .mul(quoteUsdRate.data || 0)
                    .toFixed(2)}
                  )
                </span>
              </span>
            </span>
          </div>
        )}
        <div className="px-4 pt-5 mb-5 ">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="pl-4 text-gray-200 tracking-wide">In</span>
              <span className="font-extralight text-xs text-blue-300 pr-5">
                ${formatToMoney(quoteAmountUsd) || "0"}
              </span>
            </div>
            <div className="flex flex-col">
              <SwapInput
                avatar={market.quoteLogo}
                avatarFallback={market.quote}
                value={quoteAmount}
                setValue={setQuoteAmount}
                onFocused={setQuoteAmountInputFocused}
                disabled={loading || approveLoading}
                afterInput={
                  isERC20(market.quoteType) &&
                  quoteBal > 0 && (
                    <span className="h-full flex justify-center items-center mr-3">
                      <Button
                        variant="link"
                        className="text-xs px-0 -mt-[4px] font-light"
                        onMouseUp={() => {
                          setQuoteAmount(toHD(quoteBal, market.quoteDecimals));
                          setQuoteAmountInputFocused(true);
                        }}
                        onClick={() => {
                          setQuoteAmountInputFocused(false);
                        }}
                      >
                        Max
                      </Button>
                    </span>
                  )
                }
              />
              <div className="flex justify-between">
                {!isSynth(market.quoteType) && (
                  <div className="flex flex-col text-gray-400 text-xs pl-3 pt-2">
                    <span>
                      <span className="text-gray-300">Balance: </span>
                      {formatToHighDenom(quoteBal, market.quoteDecimals)}
                    </span>
                  </div>
                )}
                <div>
                  {quoteAmountErr && (
                    <span className="flex items-center gap-1 text-red-500 text-xs font-light pt-1">
                      <span>
                        <IconCaution width="15" fillA="#cb0c2c" />
                      </span>
                      <span>{quoteAmountErr}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <div className="flex justify-between items-center">
              <span className="pl-4 text-gray-200 tracking-wide">Out</span>
              <span className="font-extralight text-xs text-blue-300 pr-5">
                ${formatToMoney(amountUsd) || "0"}
              </span>
            </div>
            <div className="flex flex-col">
              <SwapInput
                avatar={market.baseLogo}
                avatarFallback={market.base}
                value={amount}
                setValue={setAmount}
                onFocused={setAmountInputFocused}
                disabled={loading || approveLoading}
              />
              <div className="flex justify-between">
                <div>
                  <div className="flex gap-2 text-gray-400 text-xs pl-3 pt-2">
                    {!isZero(liquidity.minSwap) && (
                      <span>
                        <span className="text-gray-300">Min: </span>
                        {formatToHighDenom(
                          liquidity.minSwap,
                          market.baseDecimals
                        )}
                      </span>
                    )}
                    <span>
                      <span className="text-gray-300">Max: </span>
                      {formatToHighDenom(
                        !isZero(liquidity.maxSwap)
                          ? liquidity.maxSwap
                          : liquidity.amount,
                        market.baseDecimals
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  {amountErr && (
                    <span className="flex items-center gap-1 text-red-500 text-xs font-light pt-1">
                      <span>
                        <IconCaution width="15" fillA="#cb0c2c" />
                      </span>
                      <span>{amountErr}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="m-5 my-0  rounded-2xl pb-3 bg-gray-900 tracking-wide">
          <div className="flex pt-2 pb-2 px-3 justify-between text-xs text-blue-200 border-b border-gray-800">
            <span className="text-gray-400">Network Fees</span>
            <span className="flex gap-1">
              <span>
                {formatToMoney(feeInfo.total)} {feeInfo.symbol}
              </span>
              <span>(${formatToMoney(feeInfo.totalUsd) || "0"})</span>
            </span>
          </div>
          <div className="flex flex-col gap-1 pt-2 text-gray-300 font-light">
            <div className="px-3 text-xs flex justify-between">
              <span>
                Market fee ({market.commission ? market.commission / 100 : 0}%)
              </span>
              <span>
                {toDec(feeInfo.market).lt(1)
                  ? feeInfo.market
                  : formatToMoney(feeInfo.market)}{" "}
                {feeInfo.symbol}
              </span>
            </div>

            <div className="px-3 text-xs flex justify-between">
              <span>
                Protocol fee (
                {feeInfo.protoFeeBps ? feeInfo.protoFeeBps / 100 : 0}%)
              </span>
              <span>
                {toDec(feeInfo.protocol).lt(1)
                  ? feeInfo.protocol
                  : formatToMoney(feeInfo.protocol)}{" "}
                {feeInfo.symbol}
              </span>
            </div>

            {!!slippage && (
              <>
                <Separator.Root
                  orientation="horizontal"
                  className="border-t border-gray-800 my-1"
                />

                <div className="px-3 text-xs flex justify-between">
                  <span className="text-gray-400">Slippage</span>
                  <span className="text-blue-200">{slippage}%</span>
                </div>

                <div className="px-3 text-xs flex justify-between">
                  <span>Expected Price</span>
                  {amount != "" ? (
                    <span className="flex gap-1">
                      <span>
                        {formatToHighDenom(price, market.quoteDecimals)}{" "}
                      </span>
                      {price != maxPrice && (
                        <>
                          <span> - </span>
                          <span>
                            {formatToHighDenom(maxPrice, market.quoteDecimals)}{" "}
                          </span>
                        </>
                      )}
                      <span>{market.base}</span>
                    </span>
                  ) : (
                    "0"
                  )}
                </div>

                <div className="px-3 text-xs flex justify-between">
                  <span>Expected Output</span>
                  {slippageAmount != "" ? (
                    <span className="flex gap-1">
                      <span>{formatToMoney(slippageAmount)}</span>
                      {amount != slippageAmount && (
                        <>
                          <span> - </span>
                          <span>{formatToMoney(amount)}</span>
                        </>
                      )}
                      <span>{market.base}</span>
                    </span>
                  ) : (
                    "0"
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div
          className={cn("p-5 pt-0 px-3 relative mt-3", {
            "pb-[100px]": !offSheet,
          })}
        >
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-none p-1">
              <AccordionTrigger className="transition-all duration-300 rounded-full hover:bg-gray-800 text-xs !text-gray-300 pb-1 tracking-wide p-1 px-3">
                <div className="flex items-center gap-2">
                  <IconSettingsOutline width="15px" /> Advanced Settings
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 px-3 tracking-wide">
                <EditSwapSlippage
                  disabled={loading || approveLoading}
                  defaultValue={slippage}
                  onValueChanged={(val) => {
                    setSlippage(val);
                  }}
                />
                <EditSwapExpiry
                  disabled={loading || approveLoading}
                  defaultValue={expireDuration}
                  onValueChanged={(val) => {
                    setExpireDuration(val);
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-2 p-3 w-full border-t border-gray-800 bg-card-background",
          { "absolute bottom-0 w-full": !offSheet }
        )}
      >
        {isERC20(market.quoteType) && !hasAllowance && (
          <Button
            size="full"
            variant="secondary"
            disabled={isZero(amount) || approveLoading}
            onClick={doRequestAllowance}
          >
            {!approveLoading && <>Approve</>}
            {approveLoading && (
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
        <Button size="full" disabled={!canSwap} onClick={doSwap}>
          {!loading && <>Swap</>}
          {loading && (
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
  );
}
