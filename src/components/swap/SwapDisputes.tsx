import { useState } from "react";
import { Label } from "../ui/label.tsx";
import { DisputeRow } from "../dispute/DisputeRow.tsx";
import { cn } from "../../libs/utils.ts";
import { ChevronDown, ChevronUp } from "lucide-react";

export function SwapDisputes({ swap }: { swap: Swap }) {
  const [showOtherDisputes, setShowOtherDisputes] = useState(false);

  return (
    <div className="px-1 md:px-2 bg-gray-900 mx-1 rounded-xl border border-gray-800/80 py-2">
      <div className="flex flex-col gap-2">
        <div>
          <div className="p-2 pt-0">
            <Label className="font-light">
              Dispute #{swap.disputes[0].disputeId}
            </Label>
          </div>
          <DisputeRow
            dispute={swap.disputes[0]}
            className="border-chinese-green/20"
            noFocus
          />
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
