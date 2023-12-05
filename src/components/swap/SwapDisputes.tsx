import { useState } from "react";
import { Label } from "../ui/label.tsx";
import { DisputeRow } from "../dispute/DisputeRow.tsx";
import { cn } from "../../libs/utils.ts";
import { ChevronDown, ChevronUp } from "lucide-react";
import { isEqlStr } from "../../libs/helpers.ts";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";

function extendDispute(dispute: Dispute, extend: Partial<Dispute> = {}) {
  return {
    ...dispute,
    ...extend,
  };
}

export function SwapDisputes({ swap }: { swap: Swap }) {
  const { address } = useConnectorContext();
  const [showOtherDisputes, setShowOtherDisputes] = useState(false);

  // find dispute drafts where the draftee is address
  const draftsByAddress = swap.disputes[0].draftees.filter((draft) => {
    return isEqlStr(draft.owner, address);
  });

  return (
    <div className="px-1 md:px-2 bg-card-background mx-1 rounded-xl py-2">
      <div className="flex flex-col gap-2">
        <div>
          <div className="p-2 pt-0">
            <Label className="font-medium tracking-wider">
              Dispute #{swap.disputes[0].disputeId}
            </Label>
          </div>
          <div className="flex flex-col gap-3">
            {draftsByAddress.length == 0 && (
              <DisputeRow
                dispute={swap.disputes[0]}
                className="border-chinese-green/20"
                noFocus
              />
            )}
            {draftsByAddress.map((draft) => (
              <DisputeRow
                dispute={extendDispute(swap.disputes[0], {
                  ticketIndex: draft.index,
                })}
                className="border-gray-800"
                key={`${swap.disputes[0].orderId}:${swap.disputes[0].disputeId}:${draft.index}`}
                noFocus
              />
            ))}
          </div>
        </div>

        {/* older disputes */}
        {swap.disputes.length > 1 && (
          <div>
            <div
              className={cn(
                "mb-2 font-extralight hover:text-gray-200 cursor-pointer text-gray-400 text-xs rounded-xl flex justify-center items-center hover:bg-gray-800 border border-gray-800 transition-all duration-300",
                { "bg-gray-800 text-gray-200": showOtherDisputes }
              )}
              onClick={() => {
                setShowOtherDisputes(!showOtherDisputes);
              }}
            >
              <span>See all disputes</span>
              <span>
                {!showOtherDisputes ? (
                  <ChevronDown width="15" />
                ) : (
                  <ChevronUp width="15" />
                )}
              </span>
            </div>
            {swap.disputes.slice(1).map((dispute) => (
              <div
                key={`${dispute.orderId}:${dispute.disputeId}`}
                className={cn(
                  "transition-all duration-500 animate-in slide-in-from-top-10",
                  {
                    "fade-out animate-out slide-out-to-top-10 h-0 overflow-hidden":
                      !showOtherDisputes,
                  }
                )}
              >
                <div className="p-2 pt-0 pb-1">
                  <Label className="font-light">
                    Dispute #{dispute.disputeId}
                  </Label>
                </div>
                <DisputeRow dispute={dispute} noFocus />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
