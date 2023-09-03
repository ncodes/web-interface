import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { Label } from "../ui/label.tsx";
import { SwapEventLogs } from "./SwapEventLogs.tsx";
import { useEffect, useState } from "react";
import useInstructions from "../../hooks/instructions/useInstructions.ts";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";

export function SwapInformation({ swap }: { swap: Swap }) {
  const { load } = useInstructions();
  const { address } = useConnectorContext();
  const [globalLiqInstruction, setGlobalLiqInstruction] = useState("");
  const [liquidityInstruction, setLiquidityInstruction] = useState("");
  const [isFetchingInstructions, setIsFetchingInstructions] = useState(false);

  useEffect(() => {
    setIsFetchingInstructions(true);
    load(address)
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
        <ScrollGradientIndicator>
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
        </ScrollGradientIndicator>
        <TabsContent value="instructions" className="px-0 mt-4">
          <div className="bg-card-background border flex flex-col gap-2 rounded-2xl border-card-border w-full pb-3">
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
