import { useEffect, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useBadgeMgrContract from "../../hooks/services/contracts/useBadgeMgrContract.ts";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs.tsx";
import { Label } from "../ui/label.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { SwapEventLogs } from "./SwapEventLogs.tsx";

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
            <TabsList className="justify-start px-3 py-2 pb-1 gap-2 relative">
              <TabsTrigger
                value="instructions"
                className="font-light px-3 lg:px-5  font-jersey25 text-[18px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[16px] data-[state=active]:py-[14px] !rounded-full data-[state=active]:font-medium"
              >
                Instructions
              </TabsTrigger>
              <TabsTrigger
                value="logs"
                className="font-light px-3 lg:px-5  font-jersey25 text-[18px] data-[state=active]:!bg-chinese-green data-[state=active]:text-gray-900 h-[0] py-[16px] data-[state=active]:py-[14px] !rounded-full data-[state=active]:font-medium"
              >
                Events
              </TabsTrigger>
            </TabsList>
          </ScrollAreaHorizontal>
        </ScrollOverflowIndicator>
        <TabsContent value="instructions" className="px-0 mt-2">
          <div className="bg-card-background border-none flex flex-col gap-2 rounded-2xl border-card-border w-full pb-3">
            {isFetchingInstructions && (
              <div className="p-5">
                <IconSpinner width="20" />
              </div>
            )}

            {!isFetchingInstructions && (
              <>
                <div>
                  <Label className="block p-5 py-3 pb-1 text-lg">
                    Liquidity Instruction
                  </Label>
                  <p className="px-5 font-light text-sm text-gray-300">
                    {!liquidityInstruction && (
                      <span className="text-gray-500">
                        [no liquidity instruction]
                      </span>
                    )}
                    {liquidityInstruction && (
                      <span className="text-gray-300">
                        {liquidityInstruction}
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <Label className="block p-5 py-3 pb-1 text-lg">
                    General Instruction
                  </Label>
                  <p className="px-5 font-light text-sm text-gray-300">
                    {!globalLiqInstruction && (
                      <span className="text-gray-500">
                        [no general instruction]
                      </span>
                    )}
                    {globalLiqInstruction && (
                      <span className="text-gray-300">
                        {globalLiqInstruction}
                      </span>
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <SwapEventLogs swap={swap} />
      </Tabs>
    </div>
  );
}
