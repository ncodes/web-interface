import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs.tsx";
import Layout from "./Layout.tsx";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import ScrollGradientIndicator from "../components/ScrollGradientIndicator.tsx";
import { useEffect } from "react";
import useStore from "../hooks/store/useStore.ts";
import { OfferRow } from "../components/liquidity/OfferRow.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import { Paginator } from "../components/Paginator.tsx";

function Page() {
  const setCurrentTab = useStore((state) => state.setCurrentTab);

  useEffect(() => {
    setCurrentTab && setCurrentTab("liquidity");
  }, [setCurrentTab]);

  return (
    <Tabs
      defaultValue="offers"
      className="w-full h-full transition-all duration-500"
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollGradientIndicator className="[&::before]:rounded-tr-none w-full">
          <ScrollAreaHorizontal type="scroll" className="w-full">
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="offers"
                className="font-light gap-1 relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Offers
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
      <TabsContent value="offers" className="p-0 m-0 px-0 flex flex-col gap-3">
        <Paginator />
        <div className="p-3 pt-0">
          <div className=" pr-0 flex-1 ">
            <OfferRow base={"BTC"} quote={"UNI"} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default function Offers() {
  return (
    <Layout
      tab={<Page />}
      // rightSide={<div className="flex w-full flex-col h-full pt-2"></div>}
    />
  );
}
