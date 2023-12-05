import IconSpinner from "../icons/IconSpinner.tsx";
import { TabsContent } from "../ui/Tabs.tsx";
import { Label } from "../ui/label.tsx";

export function SwapEvents({
  isFetchingInstructions,
  liquidityInstruction,
  globalLiqInstruction,
}: {
  isFetchingInstructions: boolean;
  liquidityInstruction: string;
  globalLiqInstruction: string;
}) {
  return (
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
                  <span className="text-gray-300">{liquidityInstruction}</span>
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
                  <span className="text-gray-300">{globalLiqInstruction}</span>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </TabsContent>
  );
}
