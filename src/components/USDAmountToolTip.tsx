import { ToolTip } from "./ToolTip.tsx";
import { formatToMoney } from "../libs/helpers.ts";
import { CircleDollarSign } from "lucide-react";

export function USDAmountToolTip(props: { v: number }) {
  return (
    <ToolTip
      tip={"$" + formatToMoney(props.v)}
      className2="text-chinese-green bg-chinese-green/90 text-gray-800 font-medium"
    >
      <span className="text-[10px] text-chinese-green">
        <CircleDollarSign width="14px" />
      </span>
    </ToolTip>
  );
}
