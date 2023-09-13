import { FilterItem } from "../FilterItem.tsx";
import Input2 from "../Input2.tsx";
import IconCaution from "../icons/IconCaution.tsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { isAddress } from "viem";
import { isEqlStr } from "../../libs/helpers.ts";
import { ethers } from "ethers";

export function ManageLiqEditTarget({
  onValueChanged,
  liquidity,
}: {
  market: Market;
  liquidity?: Liquidity;
  onValueChanged?: (
    value: string,
    err: string,
    setErr: Dispatch<SetStateAction<string>>
  ) => void;
}) {
  const [target, setTarget] = useState(
    liquidity && !isEqlStr(liquidity.target, ethers.constants.AddressZero)
      ? liquidity.target
      : ""
  );
  const [err, setErr] = useState("");

  useEffect(() => {
    onValueChanged && onValueChanged(target, err, setErr);
  }, [target, err]);

  return (
    <FilterItem
      title="Target"
      tip="Specify an address that will only be allowed to swap the liquidity"
    >
      <div className="flex gap-4 w-full">
        <Input2
          type="text"
          placeholder="0x0000..."
          value={target}
          onChange={(e) => {
            setTarget(e.target.value);
            if (e.target.value && !isAddress(e.target.value)) {
              setErr("Invalid address");
            } else {
              setErr("");
            }
          }}
          after={
            <div>
              {err && (
                <div className="flex  flex-wrap justify-between px-3 pb-1 text-[10px] text-gray-400 tracking-wider">
                  <span className="flex items-center gap-1 text-red-500 text-xs font-light">
                    <span>
                      <IconCaution width="15" fillA="#cb0c2c" />
                    </span>
                    <span>{err}</span>
                  </span>
                </div>
              )}
            </div>
          }
        />
      </div>
    </FilterItem>
  );
}
