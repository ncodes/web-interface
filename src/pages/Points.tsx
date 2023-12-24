import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer.tsx";
import ScrollOverflowIndicator from "../components/ScrollOverflowIndicator.tsx";
import { LeaderboardTabContent } from "../components/leaderboard/LeaderboardTabContent.tsx";
import { PointSearchBar } from "../components/leaderboard/PointSearchBar.tsx";
import PointStream from "../components/leaderboard/PointStream.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import Layout from "./Layout.tsx";

function MarketTabs({ defaultTab }: { defaultTab?: string }) {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(defaultTab || "leaderboard");

  return (
    <Tabs
      defaultValue={defaultTab || "leaderboard"}
      className="w-full transition-all duration-500  flex flex-1 flex-col"
      onValueChange={(value) => {
        setCurrentTab(value);
      }}
    >
      <TabsList className="bg-card-background rounded-t-3xl flex justify-start w-full items-center border-b border-modal-border">
        <ScrollAreaHorizontal type="scroll" className="w-full">
          <ScrollOverflowIndicator>
            <div className="flex flex-1 w-full gap-2 items-center px-2 py-2 pt-0">
              <TabsTrigger
                value="leaderboard"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={() => {
                  navigate("/leaderboard");
                }}
              >
                Leaderboard
              </TabsTrigger>
              {/* <TabsTrigger
                value="my-markets"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/my/markets");
                }}
              >
                My Markets
              </TabsTrigger>
              <TabsTrigger
                value="watched-markets"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/markets/watching");
                }}
              >
                Watching
              </TabsTrigger> */}
            </div>
          </ScrollOverflowIndicator>
        </ScrollAreaHorizontal>
        <div className="flex shrink-0 gap-2 items-center justify-end">
          <div className="hidden md:block">
            <PointSearchBar />
          </div>
        </div>
      </TabsList>
      {currentTab == "leaderboard" && <LeaderboardTabContent />}
    </Tabs>
  );
}

export default function Points({ defaultTab }: { defaultTab?: string }) {
  return (
    <Layout
      title="My Points - Joint"
      bodyContainerClassName="min-h-[97%] xl:min-h-full flex flex-col"
      body={<MarketTabs defaultTab={defaultTab} />}
      rightSide={
        <div className="flex w-full justify-between flex-col pt-3">
          <PointStream />
          <div className="relative">
            <div className="text-gray-200 bottom-0 w-full">
              <Footer />
            </div>
          </div>
        </div>
      }
    />
  );
}
