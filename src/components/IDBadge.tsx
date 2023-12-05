import { ReactNode } from "react";
import { ToolTip } from "./ToolTip.tsx";
import CopyToClipboard from "react-copy-to-clipboard";

export function IDBadge(props: { id: number; tip?: ReactNode }) {
  if (props.id == undefined) return null;

  return (
    <ToolTip tip={props.tip}>
      <CopyToClipboard text={props.id.toString()}>
        <span className="border-card-border text-sm px-1 text-gray-500 border rounded-full flex gap-0.5 font-medium transition-all duration-300 hover:scale-110">
          <span>#</span>
          <span className="text-gray-400 font-light">{props.id}</span>
        </span>
      </CopyToClipboard>
    </ToolTip>
  );
}
