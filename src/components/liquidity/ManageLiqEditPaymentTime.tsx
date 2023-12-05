import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useCoreContract from "../../hooks/services/contracts/useCoreContract.ts";
import { humanizeDur, humanizeDur2 } from "../../libs/helpers.ts";
import { FilterItem } from "../FilterItem.tsx";
import Input2 from "../Input2.tsx";
import IconCaution from "../icons/IconCaution.tsx";
import { Slider } from "../ui/slider.tsx";

export function ManageLiqEditPaymentTime({
  liquidity,
  disabled,
  onValueChanged,
}: {
  market: Market;
  liquidity?: Liquidity;
  disabled?: boolean;
  onValueChanged?: (
    value: number,
    err: string,
    setErr: Dispatch<SetStateAction<string>>,
  ) => void;
}) {
  const [duration, setDuration] = useState(liquidity?.timeToPay || 0);
  const [focused, setFocused] = useState(false);
  const [err, setErr] = useState("");
  const { state } = useCoreContract();
  const { ready } = useConnectorContext();
  const [minTimeToPay, setMinTimeToPay] = useState(900);

  useEffect(() => {
    onValueChanged && onValueChanged(duration, err, setErr);
  }, [duration, err]);

  useEffect(() => {
    if (!ready) return;
    state().then((state) => {
      setMinTimeToPay(Number(state[1]));
      if (!duration) setDuration(Number(state[1]));
    });
  }, [ready]);

  return (
    <FilterItem
      title="Payment Time"
      tip={
        !liquidity
          ? "Set time you expect to receive payment (in seconds)"
          : "Update time you expect to receive payment (in seconds)"
      }
    >
      <div className="flex gap-4 w-full">
        <Input2
          type="number"
          value={duration.toString()}
          placeholder="0"
          isFocused={focused}
          disabled={disabled}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            setDuration(value);
            setErr(
              value < minTimeToPay
                ? `Too Low (min: ${humanizeDur(minTimeToPay)})`
                : "",
            );
          }}
          after={
            <div>
              <div className="p-3 pt-1">
                <Slider
                  value={[duration]}
                  min={minTimeToPay}
                  defaultValue={[minTimeToPay || 1800]}
                  max={3600}
                  disabled={disabled}
                  step={1}
                  onValueChange={(value) => {
                    setFocused(true);
                    setDuration(value[0]);
                    setErr(
                      value[0] < minTimeToPay
                        ? `Too Low (min: ${humanizeDur(minTimeToPay)})`
                        : "",
                    );
                  }}
                  onMouseLeave={() => {
                    setFocused(false);
                  }}
                />
              </div>
              <div className="flex  flex-wrap justify-between px-3 pb-1 text-[10px] text-gray-400 tracking-wider">
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
    </FilterItem>
  );
}
