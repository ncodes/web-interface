import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { formatToMoney, toDec, toHD } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { FilterItem } from "../FilterItem.tsx";
import { ToolTip } from "../ToolTip.tsx";
import IconCaution from "../icons/IconCaution.tsx";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";

export function ManageLiqEditPrice({
  liquidity,
  market,
  disabled,
  baseUsdRate,
  quoteUsdRate,
  onValueChanged,
}: {
  liquidity: Liquidity;
  market: Market;
  disabled?: boolean;
  baseUsdRate: number;
  quoteUsdRate: number;
  onValueChanged?: (
    value: string,
    err: string,
    setErr: Dispatch<SetStateAction<string>>
  ) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(
    liquidity ? toHD(liquidity.price, market.quoteDecimals, 0, false) : ""
  );
  const [price, setPrice] = useState(
    liquidity ? toHD(liquidity.price, market.quoteDecimals, 0, false) : ""
  );
  const [increment, setIncrement] = useState(100);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!price) return;
    setPrice(
      toDec(originalPrice || "0")
        .mul(toDec(increment).div(100))
        .toFixed()
    );
  }, [increment]);

  useEffect(() => {
    if (!price && !err && !focused) return;
    onValueChanged && onValueChanged(price, err, setErr);
  }, [price, err]);

  return (
    <FilterItem
      title="Price"
      tip={
        !liquidity
          ? `Set a price. How much ${market.quote} you want to receive for each ${market.base} you add as liquidity`
          : "Update the price of your liquidity"
      }
    >
      <div className="w-full">
        <div className="flex gap-4 items-center">
          <div
            className={cn(
              "flex-1 flex flex-col gap-2 bg-card-background border rounded-2xl transition-all duration-500",
              {
                "border-card-border": !focused,
                "border-chinese-green ring-2 ring-chinese-green": focused,
              }
            )}
          >
            <div className="flex justify-between px-3 pt-1 text-[10px] text-gray-400 tracking-wider">
              <span className="text-gray-200 font-medium">{market.quote}</span>
              {baseUsdRate && quoteUsdRate && (
                <ToolTip
                  tip={`CEX price for ${market.base}/${market.quote} market. Click to use.`}
                >
                  <span
                    className="flex gap-1 items-center"
                    onClick={() => {
                      setIncrement(100);
                      const price = (baseUsdRate / quoteUsdRate).toFixed(8);
                      setPrice(price);
                      setOriginalPrice(price);
                    }}
                  >
                    <span>
                      {formatToMoney((baseUsdRate / quoteUsdRate).toFixed(8))}
                    </span>
                    <span>
                      <InfoCircledIcon
                        width="15"
                        className="text-chinese-green"
                      />
                    </span>
                  </span>
                </ToolTip>
              )}
            </div>
            <div className="flex items-center">
              <Input
                value={price}
                type="number"
                placeholder="0.00"
                disabled={disabled}
                className="bg-transparent border-transparent px-3 outline-none focus-visible:!ring-0"
                onChange={(e) => {
                  setPrice(e.target.value);
                  setOriginalPrice(e.target.value);
                  setIncrement(100);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              <span className="flex gap-1 rounded-full pb-1 pr-3 relative top-[2px]">
                <Button
                  variant="secondary"
                  className="p-0 px-2 h-auto rounded"
                  disabled={disabled || !price}
                  onClick={() => {
                    setIncrement(
                      parseFloat((increment - increment * 0.01).toFixed(1))
                    );
                  }}
                >
                  -
                </Button>
                <div className="flex gap-1 px-1 justify-center items-center">
                  <Input
                    type="number"
                    value={increment}
                    disabled={disabled || !price}
                    className="!w-[40px] text-sm text-center !h-[25px] border-none bg-transparent focus-visible:outline-0 focus-visible:ring-0"
                    onChange={(e) => {
                      setIncrement(
                        parseFloat(parseFloat(e.target.value).toFixed(1))
                      );
                    }}
                  />
                  <span className="text-sm font-light text-gray-400">%</span>
                </div>
                <Button
                  variant="secondary"
                  className="p-0 px-2 h-auto rounded"
                  disabled={disabled || !price}
                  onClick={() => {
                    setIncrement(
                      parseFloat((increment + increment * 0.01).toFixed(1))
                    );
                  }}
                >
                  +
                </Button>
              </span>
            </div>
            <div className="flex flex-wrap justify-between px-3 pb-1 text-[10px] text-gray-400 tracking-wider">
              <span>
                {quoteUsdRate && price && (
                  <>
                    $
                    {formatToMoney(
                      toDec(quoteUsdRate)
                        .mul(price)
                        .toFixed(toDec(quoteUsdRate).mul(price).lt(1) ? 4 : 2)
                    )}
                  </>
                )}
              </span>
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
      </div>
    </FilterItem>
  );
}
