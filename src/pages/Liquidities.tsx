import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs.tsx";
import Layout from "./Layout.tsx";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import ScrollGradientIndicator from "../components/ScrollGradientIndicator.tsx";
import { LiquidityRow } from "../components/liquidity/LiquidityRow.tsx";

function MyLiquidityTabContent() {
  return <LiquidityRow base="BTC" quote="UNI" />;
}

function MyWatchTabContent() {
  return <LiquidityRow base="BTC" quote="UNI" />;
}

function Page() {
  return (
    <Tabs
      defaultValue="my-liquidity"
      className="w-full h-full transition-all duration-500"
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollGradientIndicator className="[&::before]:rounded-tr-none w-full">
          <ScrollAreaHorizontal type="scroll" className="w-full">
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="my-liquidity"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                My Liquidity
              </TabsTrigger>
              <TabsTrigger
                value="watching"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Watching
              </TabsTrigger>
            </div>
          </ScrollAreaHorizontal>
        </ScrollGradientIndicator>
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
      <TabsContent
        value="my-liquidity"
        className="p-3 pt-0 flex flex-col gap-3"
      >
        <MyLiquidityTabContent />
      </TabsContent>
      <TabsContent value="watching" className="p-3 pt-0 flex flex-col gap-3">
        <MyWatchTabContent />
      </TabsContent>
    </Tabs>
  );
}

export default function Liquidities() {
  return (
    <Layout
      tab={<Page />}
      // rightSide={
      //   <div className="flex flex-col h-full mt-2">
      //     <div className="text-gray-200">
      //       <Footer />
      //     </div>
      //   </div>
      // }
    />
  );
}
