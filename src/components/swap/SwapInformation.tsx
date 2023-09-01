import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { Label } from "../ui/label.tsx";
import { SwapEventLogs } from "./SwapEventLogs.tsx";

export function SwapInformation({ swap }: { swap: Swap }) {
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
            <div>
              <Label className="block p-5 py-3 pb-1 text-lg">
                Liquidity Instruction
              </Label>
              <p className="px-5 font-light text-sm text-gray-300">
                I pay very fast. I will release the coins as soon as I receive
                payment and confirm it. I will not release the coins if I do not
                receive payment. Share your phone number to get paid faster.
              </p>
            </div>

            <div>
              <Label className="block p-5 py-3 pb-1 text-lg">
                Provider Instruction
              </Label>
              <p className="px-5 font-light text-sm text-gray-300">
                I only trade with verified users that have a good reputation and
                a good track record.
              </p>
            </div>
          </div>
        </TabsContent>

        <SwapEventLogs swap={swap} />
      </Tabs>
    </div>
  );
}
