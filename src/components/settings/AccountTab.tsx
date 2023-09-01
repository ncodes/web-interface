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
    <TabsContent value="account" className="w-full h-full px-0">
      <div className="pt-2">
        <Accordion type="single" collapsible value="link-account">
          <AccordionItem value="link-account">
            <AccordionTrigger className="px-5 text-xl pb-2 tracking-wide">
              Link Account
            </AccordionTrigger>
            <AccordionContent className="px-5 tracking-wide">
              <LinkAccountSetting />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </TabsContent>
  );
}
