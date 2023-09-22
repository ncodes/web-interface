import { Label } from "../ui/label.tsx";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { Slider } from "../ui/slider.tsx";
import IconCaution from "../icons/IconCaution.tsx";
import Input2 from "../Input2.tsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { humanizeDur2 } from "../../libs/helpers.ts";

export function EditSwapExpiry({
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
  const [duration, setDuration] = useState(defaultValue || 1800);
  const [focused, setFocused] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    onValueChanged && onValueChanged(duration, err, setErr);
  }, [duration, err]);

  return (
    <div className="flex justify-between mt-3">
      <Label className="font-normal flex items-center gap-1">
        <span>Expire</span>
        <ToolTip tip="The number of seconds within which the swap is expected to be executed, otherwise, it is cancelled.">
          <IconInfoCircle width="13px" />
        </ToolTip>
      </Label>
      <div>
        <Input2
          type="number"
          value={duration.toString()}
          placeholder="0"
          containerClassName="w-[150px]"
          isFocused={focused}
          onChange={(e) => {
            setDuration(parseInt(e.target.value));
          }}
          after={
            <div>
              <div className="p-3 pt-0 pb-2">
                <Slider
                  value={[duration]}
                  min={0}
                  max={3600}
                  step={1}
                  disabled={disabled}
                  onValueChange={(value) => {
                    setFocused(true);
                    setDuration(value[0]);
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
              {humanizeDur2(duration)}
            </div>
          }
        />
      </div>
    </div>
  );
}
