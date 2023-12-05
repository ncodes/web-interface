import { Label } from "../ui/label.tsx";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { Slider } from "../ui/slider.tsx";
import IconCaution from "../icons/IconCaution.tsx";
import Input2 from "../Input2.tsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function EditSwapSlippage({
  defaultValue,
  onValueChanged,
  disabled,
}: {
  disabled?: boolean;
  defaultValue?: number;
  onValueChanged?: (
    value: number,
    err: string,
    setErr: Dispatch<SetStateAction<string>>
  ) => void;
}) {
  const [slippage, setSlippage] = useState(defaultValue || 0);
  const [focused, setFocused] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    onValueChanged && onValueChanged(slippage, err, setErr);
  }, [slippage, err]);

  return (
    <div className="flex justify-between">
      <Label className="font-normal flex items-center gap-1">
        <span>Slippage</span>
        <ToolTip tip="The percentage increase in price you can tolerate if the liquidity price changed before execution. ">
          <IconInfoCircle width="13px" />
        </ToolTip>
      </Label>
      <div>
        <Input2
          type="number"
          value={slippage.toString()}
          placeholder="0"
          containerClassName="w-[150px]"
          isFocused={focused}
          onChange={(e) => {
            setSlippage(parseInt(e.target.value || "0"));
          }}
          after={
            <div>
              <div className="p-3 pt-0 pb-2">
                <Slider
                  value={[slippage || 0]}
                  min={0}
                  max={100}
                  step={0.5}
                  disabled={disabled}
                  onValueChange={(value) => {
                    setFocused(true);
                    setSlippage(value[0]);
                  }}
                  onMouseLeave={() => {
                    setFocused(false);
                  }}
                />
              </div>
              <div className="flex  flex-wrap justify-between px-3 text-[10px] text-gray-400 tracking-wider">
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
          }
          afterInput={
            <div className="text-xs font-light p-3 pt-2 pb-0 text-gray-400">
              %
            </div>
          }
        />
      </div>
    </div>
  );
}
