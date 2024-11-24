import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useStore from "../../hooks/store/useStore.ts";
import { cn } from "../../libs/utils.ts";
import { ToolTip } from "../ToolTip.tsx";
import { Button } from "../ui/Button.tsx";

export function AirdropHeader({
  onViewChanged,
  defaultView,
}: {
  onViewChanged?: (string) => void;
  defaultView?: "trade" | "claim";
}) {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
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
    <div className="border-y h-full rounded-t-3xl border-gray-900 flex flex-col md:flex-row gap-3 justify-between items-center p-3 pl-5">
      <div className="flex flex-col items-center mt-3 md:mt-0">
        <img
          src="/images/dexdrop.png"
          className="w-[100px] xxs:w-[120px] xs:w-[150px] md:w-[150px]"
        />
      </div>
      <div className="flex items-center gap-1.5 text-lg font-silkscreen">
        <img src="/images/airdrop-icons/point-star.svg" className="w-4 h-4" />
        <ToolTip tip="Points">
          <span>{user?.points}</span>
        </ToolTip>
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
        <ToolTip tip="Coming soon">
          <Button
            disabled
            className={cn(
              "rounded-xl text-white bg-gray-900/70 hover:text-gray-800 font-silkscreen",
            )}
          >
            Stake
          </Button>
        </ToolTip>
      </div>
    </div>
  );
}
