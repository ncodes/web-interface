import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import Layout from "./Layout.tsx";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import ScrollOverflowIndicator from "../components/ScrollOverflowIndicator.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import { Messenger } from "../components/messenger/Messenger.tsx";
import { OfferTabContent } from "../components/offer/OfferTabContent.tsx";

function Page() {
  return (
    <Tabs
      defaultValue="offers"
      className="w-full h-full transition-all duration-500"
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollOverflowIndicator className="[&::before]:rounded-tr-none w-full">
          <ScrollAreaHorizontal type="scroll" className="w-full">
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="offers"
                className="font-light gap-1 relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Offer
              </TabsTrigger>
            </div>
          </ScrollAreaHorizontal>
        </ScrollOverflowIndicator>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="md:hidden justify-center flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green">
                <DotsVerticalIcon />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0"></DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TabsList>
      <OfferTabContent />
    </Tabs>
  );
}

export default function Offer() {
  return (
    <Layout
      tab={<Page />}
      rightSide={
        <div className="flex flex-col w-full h-full py-3">
          <Messenger sheetMode={false} />
          {/*<Footer />*/}
        </div>
      }
    />
  );
}
