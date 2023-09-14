import { TabsContent } from "../ui/Tabs.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";
import { LiquidityInstruction } from "./LiquidityInstruction.tsx";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";

export function RulesTab() {
  const [sheetHeight] = useSheetInfo();

  return (
    <TabsContent value="rules" className={`w-full h-full px-0 ${sheetHeight}`}>
      <Accordion type="single" collapsible defaultValue="instructions">
        <AccordionItem className="mt-3" value="instructions">
          <AccordionTrigger className="px-5 text-lg pb-2 tracking-wide">
            Instruction
          </AccordionTrigger>
          <AccordionContent className="px-5 tracking-wide">
            <LiquidityInstruction />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TabsContent>
  );
}
