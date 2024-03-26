import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer.tsx";
import ScrollOverflowIndicator from "../components/ScrollOverflowIndicator.tsx";
import { EnergonConversionTabContent } from "../components/points/EnergonConversionTabContent.tsx";
import { LeaderboardTabContent } from "../components/points/LeaderboardTabContent.tsx";
import { NFTConverstionTabContent } from "../components/points/NFTConversionTabContent.tsx";
import { PointSearchBar } from "../components/points/PointSearchBar.tsx";
import PointStream from "../components/points/PointStream.tsx";
import { ReferralsTabContent } from "../components/points/ReferralsTabContent.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import Layout from "./Layout.tsx";

function MarketTabs({ defaultTab }: { defaultTab?: string }) {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(defaultTab || "leaderboard");
  const loc = useLocation();

  return (
    <Tabs
      defaultValue={defaultTab || "leaderboard"}
      className="w-full transition-all duration-500  flex flex-1 flex-col"
      onValueChange={(value) => {
        setCurrentTab(value);
      }}
    >
      <ScrollOverflowIndicator
        arrowContainerRightClassName="rounded-tr-3xl right-[1px]"
        arrowContainerLeftClassName="rounded-tl-3xl"
        showArrow
      >
        <ScrollAreaHorizontal type="scroll" className="w-full rounded-t-3xl">
          <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
            <div className="flex flex-1 w-full items-center px-1 py-2 pt-0">
              <TabsTrigger
                value="leaderboard"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={() => {
                  navigate("/points");
                }}
              >
                Leaderboard
              </TabsTrigger>
              <TabsTrigger
                value="referrals"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/referrals");
                }}
              >
                Referrals
              </TabsTrigger>
              <TabsTrigger
                value="energon"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/energon");
                }}
              >
                Energon
              </TabsTrigger>
              <TabsTrigger
                value="nft"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/nft");
                }}
              >
                NFT
              </TabsTrigger>
            </div>
          </TabsList>
        </ScrollAreaHorizontal>
      </ScrollOverflowIndicator>
      <div className="flex shrink-0 gap-2 items-center justify-end">
        {loc.pathname != "/energon" && loc.pathname != "/nft" && (
          <div className="hidden md:block">
            <PointSearchBar />
          </div>
        )}
      </div>
      {currentTab == "leaderboard" && <LeaderboardTabContent />}
      {currentTab == "referrals" && <ReferralsTabContent />}
      {currentTab == "energon" && <EnergonConversionTabContent />}
      {currentTab == "nft" && <NFTConverstionTabContent />}
    </Tabs>
  );
}

export default function Points({ defaultTab }: { defaultTab?: string }) {
  const loc = useLocation();
  return (
    <Layout
      title="My Points - Joint"
      bodyContainerClassName="min-h-[97%] xl:min-h-full flex flex-col"
      body={<MarketTabs defaultTab={defaultTab} />}
      rightSide={
        loc.pathname != "/energon" &&
        loc.pathname != "/nft" && (
          <div className="flex w-full justify-between flex-col pt-3">
            <PointStream />
            <div className="relative">
              <div className="text-gray-200 bottom-0 w-full">
                <Footer />
              </div>
            </div>
          </div>
        )
      }
    />
  );
}
