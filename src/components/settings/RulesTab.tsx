import { TabsContent } from "../ui/Tabs.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { LiquidityInstruction } from "./LiquidityInstruction.tsx";

export function RulesTab() {
  return (
    <TabsContent value="rules" className={`w-full h-full px-0`}>
      <ScrollArea
        type="scroll"
        viewportClassName="absolute xl:relative"
        className="h-full relative"
      >
        <Accordion type="single" collapsible defaultValue="instructions">
          <AccordionItem className="mt-3" value="instructions">
            <AccordionTrigger className="px-5 text-lg pb-2 tracking-wide">
              Instruction
            </AccordionTrigger>
            <AccordionContent className="px-5 tracking-wide pb-10">
              <LiquidityInstruction />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </TabsContent>
  );
}
