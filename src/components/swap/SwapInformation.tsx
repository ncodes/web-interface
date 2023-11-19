import { useEffect, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useBadgeMgrContract from "../../hooks/services/contracts/useBadgeMgrContract.ts";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { SwapEventLogs } from "./SwapEventLogs.tsx";
import { SwapEvents } from "./SwapEvents.tsx";

export function SwapInformation({ swap }: { swap: Swap }) {
  const { loadInstruction } = useBadgeMgrContract();
  const { address } = useConnectorContext();
  const [globalLiqInstruction, setGlobalLiqInstruction] = useState("");
  const [liquidityInstruction, setLiquidityInstruction] = useState("");
  const [isFetchingInstructions, setIsFetchingInstructions] = useState(false);

  useEffect(() => {
    setIsFetchingInstructions(true);
    loadInstruction(address)
      .then((data) => {
        if (!data) return;
        const liqKey =
          `${swap.marketAddress}:${swap.provider}:${swap.lid}`.toLowerCase();
        setGlobalLiqInstruction(data.global);
        setLiquidityInstruction(data.liquidity[liqKey]);
      })
      .finally(() => {
        setIsFetchingInstructions(false);
      });
  }, []);

  return (
    <div className="flex-1 pt-2 mt-5 md:mt-0">
      <Tabs
        defaultValue={swap?.disputes.length > 0 ? "logs" : "instructions"}
        className="w-full h-full  transition-all duration-500"
      >
        <ScrollOverflowIndicator>
          <ScrollAreaHorizontal type="scroll">
            <TabsList className="justify-start px-3 py-2 pb-1 gap-2">
              <TabsTrigger
                value="instructions"
                className="font-light px-3 lg:px-5 text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
              >
                Instructions
              </TabsTrigger>
              <TabsTrigger
                value="logs"
                className="font-light px-3 lg:px-5 text-[14px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[14px] !rounded-full data-[state=active]:font-medium"
              >
                Events
              </TabsTrigger>
            </TabsList>
          </ScrollAreaHorizontal>
        </ScrollOverflowIndicator>
        <SwapEvents
          liquidityInstruction={liquidityInstruction}
          globalLiqInstruction={globalLiqInstruction}
          isFetchingInstructions={isFetchingInstructions}
        />

        <SwapEventLogs swap={swap} />
      </Tabs>
    </div>
  );
}
