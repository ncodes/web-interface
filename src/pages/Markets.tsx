import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import Layout from "./Layout.tsx";
import { Button } from "../components/ui/Button.tsx";
import { IconPlus } from "../components/icons/IconPlus.tsx";
import { useState } from "react";
import {
  MarketFilter,
  MarketFilterSheet,
} from "../components/market/MarketFilter.tsx";
import { Footer } from "../components/Footer.tsx";
import IconFilterOutline from "../components/icons/IconFilterOutline.tsx";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import { CreateMarketSheet } from "../components/market/CreateMarketSheet.tsx";
import ScrollGradientIndicator from "../components/ScrollGradientIndicator.tsx";
import { MarketsTabContent } from "../components/market/MarketsTabContent.tsx";
import { MyMarketsTabContent } from "../components/market/MyMarketsTabContent.tsx";
import { WatchedMarketContent } from "../components/market/WatchedMarketContent.tsx";
import { useNavigate } from "react-router-dom";

function MarketTabs({ defaultTab }: { defaultTab?: string }) {
  const [openFilterSheet, setOpenFilterSheet] = useState(false);
  const [openCreateMarketSheet, setOpenCreateMarketSheet] = useState(false);
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(defaultTab || "markets");

  return (
    <Tabs
      defaultValue={defaultTab || "markets"}
      className="w-full h-full transition-all duration-500"
      onValueChange={(value) => {
        setCurrentTab(value);
      }}
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollAreaHorizontal type="scroll" className="w-full">
          <ScrollGradientIndicator>
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="markets"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={() => {
                  navigate("/markets");
                }}
              >
                Markets
              </TabsTrigger>
              <TabsTrigger
                value="my-markets"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/markets/owned");
                }}
              >
                My Markets
              </TabsTrigger>
              <TabsTrigger
                value="watching"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Watching
              </TabsTrigger>
            </div>
          </ScrollGradientIndicator>
        </ScrollAreaHorizontal>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex xl:hidden gap-1 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green"
            onClick={() => setOpenFilterSheet(true)}
          >
            <IconFilterOutline />
          </Button>
          <Button
            size="sm"
            className="hidden md:flex gap-1 items-center transition-all duration-500 hover:scale-x-105"
            onClick={() => {
              setOpenCreateMarketSheet(true);
            }}
          >
            <IconPlus />
            <span className="hidden md:inline">Create Market</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="md:hidden justify-center flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green">
                <DotsVerticalIcon />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  setOpenFilterSheet(true);
                }}
              >
                <IconFilterOutline /> Filter Markets
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  setOpenCreateMarketSheet(true);
                }}
              >
                <IconPlus /> Create Market
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateMarketSheet
            active={openCreateMarketSheet}
            onOpen={(open) => {
              setOpenCreateMarketSheet(open);
            }}
          />
        </div>
      </TabsList>
      {currentTab == "markets" && <MarketsTabContent />}
      {currentTab == "my-markets" && <MyMarketsTabContent />}
      <WatchedMarketContent />
      <MarketFilterSheet
        active={openFilterSheet}
        onOpen={(open) => {
          setOpenFilterSheet(open);
        }}
      />
    </Tabs>
  );
}

export default function Markets({ defaultTab }: { defaultTab?: string }) {
  return (
    <Layout
      tab={<MarketTabs defaultTab={defaultTab} />}
      rightSide={
        <div className="flex flex-col h-full mt-2">
          <MarketFilter />
          <div className="text-gray-200">
            <Footer />
          </div>
        </div>
      }
    />
  );
}
