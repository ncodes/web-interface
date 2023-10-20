import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { isSynth } from "../../libs/api_utils.ts";
import {
  formatToHighDenom,
  formatToMoney,
  powOf,
  powOfD,
  toBN,
  toDec,
  toLDD,
} from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { FilterItem } from "../FilterItem.tsx";
import IconCaution from "../icons/IconCaution.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";

export function ManageLiqEditAmount({
  liquidity,
  market,
  baseUsdRate,
  onValueChanged,
}: {
  liquidity: Liquidity;
  market: Market;
  baseUsdRate: number;
  onValueChanged?: (
    value: string,
    err: string,
    setErr: Dispatch<SetStateAction<string>>
  ) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [curBaseBalance, setCurBaseBalance] = useState<bigint>(0n);
  const [amount, setAmount] = useState(
    liquidity
      ? toDec(liquidity.amount).div(powOfD(1, market.baseDecimals)).toFixed()
      : ""
  );
  const [err, setErr] = useState("");
  const { getTokenBalance, address } = useConnectorContext();

  useEffect(() => {
    (async () => {
      if (isSynth(market.baseType)) return;
      const bal = await getTokenBalance(market.baseAddress, address);
      setCurBaseBalance(bal);
    })();
  }, []);

  useEffect(() => {
    if (!amount) return setErr("");

    const amountLD = toLDD(amount, market.baseDecimals);
    if (amountLD.gt(toDec(curBaseBalance))) {
      setErr("Insufficient balance");
    } else {
      setErr("");
    }
  }, [amount]);

  useEffect(() => {
    if (!amount && !err && !focused) return;
    onValueChanged && onValueChanged(amount, err, setErr);
  }, [amount, err]);

  return (
    <FilterItem
      title="Amount"
      tip={
        !liquidity
          ? `Specify the amount of ${market.base} to add as liquidity`
          : `Increase or reduce the amount of liquidity`
      }
    >
      <div className="w-full">
        <div className="flex gap-4 items-center">
          <div
            className={cn(
              "flex-1 bg-card-background border rounded-2xl transition-all duration-500",
              {
                "border-card-border": !focused,
                "border-chinese-green ring-2 ring-chinese-green": focused,
              }
            )}
          >
            <div className="flex justify-between px-3 pt-1 text-[10px] text-gray-400 tracking-wider">
              <span className="text-gray-200 font-medium">{market.base}</span>
              {!isSynth(market.baseType) && (
                <span className="flex gap-2">
                  <span>
                    BAL:{" "}
                    {formatToHighDenom(
                      toBN(curBaseBalance),
                      market.baseDecimals
                    )}
                  </span>
                  <span>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-chinese-green text-[10px] hover:bg-transparent hover:text-chinese-green/90"
                      onClick={() => {
                        setAmount(
                          toDec(curBaseBalance)
                            .div(powOf(1, market.baseDecimals).toString())
                            .toFixed()
                        );
                      }}
                    >
                      Max
                    </Button>
                  </span>
                </span>
              )}
            </div>
            <Input
              value={amount}
              type="number"
              placeholder="0.00"
              className="bg-transparent border-transparent px-3 outline-none focus-visible:!ring-0"
              onChange={(e) => setAmount(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <div className="flex flex-wrap justify-between px-3 pb-1 text-[10px] text-gray-400 tracking-wider">
              {baseUsdRate && amount && (
                <span>
                  {"$" +
                    formatToMoney(
                      toDec(baseUsdRate)
                        .mul(parseFloat(amount))
                        .toFixed(baseUsdRate < 1 ? 4 : 2)
                    )}
                </span>
              )}
              {err && (
                <span className="flex items-center gap-1 text-red-500 text-xs font-light pb-1">
                  <span>
                    <IconCaution width="15" fillA="#cb0c2c" />
                  </span>
                  <span>{err}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        {liquidity && (
          <>
            <p className="flex text-gray-500 font-light text-xs pt-2 items-center gap-1">
              <IconInfoCircle width="14px" /> Subtracted amount is returned to
              the wallet.
            </p>
            <p className="flex text-gray-500 font-light text-xs pt-2 items-center gap-1">
              <IconInfoCircle width="14px" /> Additional amount may require
              approval.
            </p>
          </>
        )}
      </div>
    </FilterItem>
  );
}
