import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { cn } from "../../libs/utils.ts";
import { Button } from "../ui/Button.tsx";

export function AirdropHeader({
  onViewChanged,
  defaultView,
}: {
  onViewChanged?: (string) => void;
  defaultView?: "trade" | "claim";
}) {
  const navigate = useNavigate();
  const { address } = useConnectorContext();
  const [activeView, setActiveView] = useState<"trade" | "claim">(
    defaultView || "trade",
  );

  useEffect(() => {
    onViewChanged?.(activeView);
  }, [activeView]);

  useEffect(() => {
    setActiveView(defaultView || "trade");
  }, [defaultView]);

  if (!address) return null;

  return (
    <div className="border-y h-full rounded-t-3xl border-gray-900 flex flex-col md:flex-row gap-3 justify-between items-center p-3 pl-5 ">
      <div className="flex flex-col items-center">
        <img
          src="/images/dexdrop.png"
          className="w-[100px] xxs:w-[120px] xs:w-[150px] md:w-[200px]"
        />
      </div>
      <div className="flex gap-1 px-1 py-1 bg-gray-800 rounded-xl">
        <Button
          className={cn(
            "rounded-xl text-white bg-gray-900/70 hover:text-gray-800 font-silkscreen",
            activeView === "claim" && "bg-chinese-green text-black",
          )}
          onClick={() => {
            navigate("/dexdrop/claim");
          }}
        >
          Claim
        </Button>
        <Button
          className={cn(
            "rounded-xl text-white bg-gray-900/70 hover:text-gray-800 font-silkscreen",
            activeView === "trade" && "bg-chinese-green text-black",
          )}
          onClick={() => {
            navigate("/dexdrop/buy");
          }}
        >
          Buy
        </Button>
      </div>
    </div>
  );
}
