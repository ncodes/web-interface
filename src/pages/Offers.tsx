import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer.tsx";
import ScrollOverflowIndicator from "../components/ScrollOverflowIndicator.tsx";
import IconFilterOutline from "../components/icons/IconFilterOutline.tsx";
import { MyOffersTabContent } from "../components/offer/MyOffersTabContent.tsx";
import { OfferFilter } from "../components/offer/OfferFilter.tsx";
import { OfferFilterSheet } from "../components/offer/OfferFilterSheet.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import Layout from "./Layout.tsx";

import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";

function OfferTabs({ defaultTab }: { defaultTab?: string }) {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(defaultTab || "offers");
  const [openFilterSheet, setOpenFilterSheet] = useState(false);

  return (
    <Tabs
      defaultValue={defaultTab || "offers"}
      className="w-full h-full transition-all duration-500"
      onValueChange={(value) => {
        setCurrentTab(value);
      }}
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollOverflowIndicator className="[&::before]:rounded-tr-none w-full">
          <ScrollAreaHorizontal type="scroll" className="w-full">
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="offers"
                className="font-light gap-1 relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/my/offers");
                }}
              >
                Offers
              </TabsTrigger>
            </div>
          </ScrollAreaHorizontal>
        </ScrollOverflowIndicator>
        <div className="flex shrink-0 pr-2 gap-2 items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="xl:hidden justify-center flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green">
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
                <IconFilterOutline /> Filter Offers
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TabsList>
      {currentTab == "offers" && <MyOffersTabContent />}
      <OfferFilterSheet
        active={openFilterSheet}
        onOpen={(open) => {
          setOpenFilterSheet(open);
        }}
      />
    </Tabs>
  );
}

export default function Offers() {
  const { connected } = useConnectorContext();

  const rightSide = connected ? (
    <div className="flex w-full h-full justify-between flex-col pt-3">
      <OfferFilter />
      <div className="relative">
        <div className="text-gray-200 bottom-0 w-full">
          <Footer />
        </div>
      </div>
    </div>
  ) : null;

  return <Layout body={<OfferTabs />} rightSide={rightSide} />;
}
