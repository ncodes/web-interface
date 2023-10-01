import { Message } from "./db.ts";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Check } from "lucide-react";
import { Button } from "../ui/Button.tsx";
import IconCaution from "../icons/IconCaution.tsx";
import { ToolTip } from "../ToolTip.tsx";

export function MessageItemStatus({
  msg,
  onResend,
}: {
  msg: Message;
  onResend?: (msg: Message) => void;
}) {
  return (
    <div className="relative flex justify-end">
      {msg.status == "sending" && (
        <div className="flex absolute -top-3 text-xs font-extralight tracking-wider items-center gap-1 justify-end text-gray-500">
          <span>
            <ToolTip tip="Sending">
              <IconSpinner
                className="animate-spin"
                width="10px"
                fill="fill-gray-500"
              />
            </ToolTip>
          </span>
        </div>
      )}
      {msg.status == "sent" && (
        <div className="flex absolute -top-2 text-xs h-[10px] font-extralight tracking-wider items-center gap-1 justify-end text-gray-500">
          <span>
            <ToolTip tip="Sent">
              <Check width="15" className="text-gray-500" />
            </ToolTip>
          </span>
        </div>
      )}
      {msg.status == "failed" && (
        <div className="flex  text-xs h-[10px] justify-end">
          <Button
            variant="link"
            className="flex items-center gap-1 h-auto p-0 font-extralight tracking-wide text-red-500 text-xs"
            onClick={() => {
              onResend && onResend(msg);
            }}
          >
            <span>
              <IconCaution
                width="15"
                className="text-red-400"
                fillA="#cb0c2c"
                fillB="#050404"
              />
            </span>
            <span>failed to send. </span>
            <span>
              <b>Resend</b>
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
