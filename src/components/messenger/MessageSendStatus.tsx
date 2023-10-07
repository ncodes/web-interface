import _ from "lodash";
import { Check, CheckCheck } from "lucide-react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { isSwapDraftee } from "../../libs/api_utils.ts";
import { shortenAddress } from "../../libs/helpers.ts";
import { ToolTip } from "../ToolTip.tsx";
import IconCaution from "../icons/IconCaution.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";
import { Message } from "./db.ts";

export function MessageSendStatus({
  swap,
  status,
  readers,
  onResend,
}: {
  status: Message["status"];
  readers: string[];
  swap: Swap;
  onResend?: () => void;
}) {
  const { address } = useConnectorContext();

  return (
    <div className="relative flex justify-end">
      {status == "sending" && (
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
      {status == "sent" && (
        <div className="flex absolute -top-2 text-xs h-[10px] font-extralight tracking-wider items-center gap-1 justify-end text-gray-500">
          <span>
            <ToolTip tip="Sent">
              <Check width="15" className="text-gray-500" />
            </ToolTip>
          </span>
        </div>
      )}
      {status == "delivered" && (
        <div className="flex absolute -top-2 text-xs h-[10px] font-extralight tracking-wider items-center gap-1 justify-end text-gray-500">
          <span>
            <ToolTip tip="Delivered">
              <CheckCheck width="15" className="text-gray-500" />
            </ToolTip>
          </span>
        </div>
      )}
      {status == "read" && (
        <div className="flex absolute -top-2 text-xs h-[10px] font-extralight tracking-wider items-center gap-1 justify-end text-gray-500">
          <span>
            <ToolTip
              tip={
                <>
                  {isSwapDraftee(swap, address) ? (
                    <>
                      <b className="text-gray-500 mb-1 inline-block animate-in fade-in fade-out">
                        Seen By:
                      </b>
                      <br />
                      {_.uniq(readers)?.map((r) => {
                        return (
                          <span key={r}>
                            {shortenAddress(r)}
                            <br />
                          </span>
                        );
                      })}
                    </>
                  ) : (
                    <>Read</>
                  )}
                </>
              }
            >
              <CheckCheck width="15" className="text-green-500" />
            </ToolTip>
          </span>
        </div>
      )}
      {status == "failed" && (
        <div className="flex  text-xs h-[10px] justify-end">
          <Button
            variant="link"
            className="flex items-center gap-1 h-auto p-0 font-extralight tracking-wide text-red-500 text-xs"
            onClick={() => {
              onResend && onResend();
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
