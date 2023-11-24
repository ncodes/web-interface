import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { formatToMoney, isZero, toDec, toHD } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { FilterItem } from "../FilterItem.tsx";
import IconCaution from "../icons/IconCaution.tsx";
import { Input } from "../ui/Input.tsx";

export function ManageLiqEditMaxSwapAmount({
  liquidity,
  market,
  liquidityEdits,
  baseUsdRate,
  disabled,
  onValueChanged,
}: {
  liquidity: Liquidity;
  market: Market;
  liquidityEdits: Partial<Liquidity>;
  baseUsdRate: number;
  disabled?: boolean;
  onValueChanged?: (
    value: string,
    err: string,
    setErr: Dispatch<SetStateAction<string>>,
  ) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [maxSwap, setMaxSwap] = useState(
    liquidity && liquidity.maxSwap != "0"
      ? toHD(liquidity.maxSwap, market.baseDecimals)
      : "",
  );
  const [err, setErr] = useState("");

  useEffect(() => {
    const { amount, minSwap } = liquidityEdits;
    if (amount == undefined || isZero(amount) || !maxSwap) return setErr("");
    if (toDec(maxSwap).gt(toDec(amount || "0"))) {
      setErr(`Must not be greater than ${formatToMoney(amount as string)}`);
    } else if (
      !isZero(maxSwap) &&
      !isZero(minSwap) &&
      minSwap != "" &&
      toDec(maxSwap).lte(toDec(minSwap || "0"))
    ) {
      setErr(`Must be greater than ${formatToMoney(minSwap as string)}`);
    } else {
      setErr("");
    }
  }, [maxSwap, liquidityEdits]);

  useEffect(() => {
    onValueChanged && onValueChanged(maxSwap, err, setErr);
  }, [maxSwap, err]);

  return (
    <FilterItem
      title="Maximum Swap Amount"
      tip={
        !liquidity
          ? `Specify the maximum amount of ${market.base} takers can swap`
          : `Update the maximum amount of ${market.base} takers can swap`
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
              },
            )}
          >
            <div className="pt-1 flex justify-between">
              <Input
                value={maxSwap}
                type="number"
                placeholder="0.00"
                disabled={disabled}
                className="bg-transparent border-transparent px-3 outline-none focus-visible:!ring-0"
                onChange={(e) => setMaxSwap(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              {baseUsdRate && maxSwap && (
                <span className="max-w-[100px] text-[10px] text-gray-400 pr-3 relative top-[6px]">
                  ${formatToMoney(toDec(baseUsdRate).mul(maxSwap).toFixed(2))}
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-between px-3 pb-1 text-[10px] text-gray-400 tracking-wider">
              {err && (
                <span className="flex items-center gap-1 text-red-500 text-xs font-light">
                  <span>
                    <IconCaution width="15" fillA="#cb0c2c" />
                  </span>
                  <span>{err}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </FilterItem>
  );
}
