import { TabsContent } from "../ui/Tabs.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";
import { LinkAccountSetting } from "./LinkAccountSetting.tsx";

export function AccountTab() {
  return (
    <TabsContent value="account" className={`w-full h-full px-0`}>
      <Accordion type="single" collapsible defaultValue="link-account">
        <AccordionItem value="link-account">
          <AccordionTrigger className="px-5 text-lg pb-2 tracking-wide mt-2">
            Link Account
          </AccordionTrigger>
          <AccordionContent className="px-5 tracking-wide">
            <LinkAccountSetting />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TabsContent>
  );
}
