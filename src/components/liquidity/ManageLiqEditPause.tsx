import { useEffect, useState } from "react";
import { FilterItem } from "../FilterItem.tsx";
import { Switch } from "../ui/switch.tsx";

export function ManageLiqEditPause({
  liquidity,
  onValueChanged,
  disabled,
}: {
  liquidity?: Liquidity;
  market: Market;
  disabled?: boolean;
  onValueChanged?: (value: boolean) => void;
}) {
  const [pause, setPause] = useState(liquidity ? liquidity.paused : false);

  useEffect(() => {
    onValueChanged && onValueChanged(pause);
  }, [pause]);

  return (
    <FilterItem
      title="Pause"
      tip="Pause the liquidity to prevent it from getting swapped"
    >
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          <Switch
            checked={pause}
            disabled={disabled}
            onCheckedChange={(checked) => {
              setPause(checked);
            }}
          />
        </div>
      </div>
    </FilterItem>
  );
}
