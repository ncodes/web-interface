import { TabsContent } from "../ui/Tabs.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { LinkAccountSetting } from "./LinkAccountSetting.tsx";

export function AccountTab() {
  return (
    <ScrollArea
      type="scroll"
      viewportClassName="absolute xl:relative"
      className="h-full relative"
    >
      <TabsContent
        value="account"
        className={`w-full h-full px-0 overflow-auto`}
      >
        <Accordion type="single" collapsible defaultValue="link-account">
          <AccordionItem value="link-account">
            <AccordionTrigger className="px-5 text-lg pb-2 tracking-wide mt-2">
              Login
            </AccordionTrigger>
            <AccordionContent className="px-5 tracking-wide overflow-auto">
              <LinkAccountSetting />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
    </ScrollArea>
  );
}
