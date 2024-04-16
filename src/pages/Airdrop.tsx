import { AirdropDashboardTabContent } from "@/components/airdrop/AirdropDashboardTabContent.tsx";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer.tsx";
import ScrollOverflowIndicator from "../components/ScrollOverflowIndicator.tsx";
import { EnergonConversionTabContent } from "../components/airdrop/EnergonConversionTabContent.tsx";
import { GalxeConverstionTabContent } from "../components/airdrop/GalxeConversionTabContent.tsx";
import { LeaderboardTabContent } from "../components/airdrop/LeaderboardTabContent.tsx";
import { NFTConverstionTabContent } from "../components/airdrop/NFTConversionTabContent.tsx";
import { PointSearchBar } from "../components/airdrop/PointSearchBar.tsx";
import PointStream from "../components/airdrop/PointStream.tsx";
import { ReferralsTabContent } from "../components/airdrop/ReferralsTabContent.tsx";
import IconCoinGold from "../components/icons/IconCoinGold.tsx";
import IconLeaderboard from "../components/icons/IconLeaderboard.tsx";
import { IconNFT } from "../components/icons/IconNFT.tsx";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs.tsx";
import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import Layout from "./Layout.tsx";

function AirdropPage({ defaultTab }: { defaultTab?: string }) {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(defaultTab || "leaderboard");
  const loc = useLocation();

  useEffect(() => {
    if (defaultTab) {
      setCurrentTab(defaultTab);
    }
  }, [defaultTab]);

  return (
    <Tabs
      value={currentTab || "leaderboard"}
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
            <div className="flex flex-1 gap-4 w-full items-center px-1 py-2 pt-0">
              <TabsTrigger
                value="airdrop"
                className="flex items-center gap-1 font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={() => {
                  navigate("/airdrop");
                }}
              >
                <IconCoinGold width="25" />
                <span>Airdrop</span>
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="flex items-center gap-2 px-3 font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={() => {
                  navigate("/points");
                }}
              >
                <IconLeaderboard width="25" />
                <span>Leaderboard</span>
              </TabsTrigger>
              {/* <TabsTrigger
                value="referrals"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/referrals");
                }}
              >
                Referrals
              </TabsTrigger> */}
              {/* <TabsTrigger
                value="energon"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/energon");
                }}
              >
                Energon
              </TabsTrigger> */}
              <TabsTrigger
                value="nft"
                className=" flex items-center gap-2 font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/nft");
                }}
              >
                <IconNFT width="20px" className="text-yellow-400" />
                <span>NFT</span>
              </TabsTrigger>
              {/* <TabsTrigger
                value="galxe"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
                onClick={async () => {
                  navigate("/galxe");
                }}
              >
                Galxe
              </TabsTrigger> */}
            </div>
            <div className="flex shrink-0 items-center justify-end">
              {loc.pathname != "/energon" &&
                loc.pathname != "/nft" &&
                loc.pathname != "/airdrop" &&
                loc.pathname != "/galxe" && (
                  <div className="hidden lg:block">
                    <PointSearchBar />
                  </div>
                )}
            </div>
          </TabsList>
        </ScrollAreaHorizontal>
      </ScrollOverflowIndicator>
      {currentTab == "airdrop" && <AirdropDashboardTabContent />}
      {currentTab == "leaderboard" && <LeaderboardTabContent />}
      {currentTab == "referrals" && <ReferralsTabContent />}
      {currentTab == "energon" && <EnergonConversionTabContent />}
      {currentTab == "nft" && <NFTConverstionTabContent />}
      {currentTab == "galxe" && <GalxeConverstionTabContent />}
    </Tabs>
  );
}

export default function Airdrop({ defaultTab }: { defaultTab?: string }) {
  const loc = useLocation();
  return (
    <Layout
      title="My Points - Joint"
      bodyContainerClassName="min-h-[97%] xl:min-h-full flex flex-col"
      body={<AirdropPage defaultTab={defaultTab} />}
      rightSide={
        loc.pathname != "/energon" &&
        loc.pathname != "/nft" &&
        loc.pathname != "/galxe" && (
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
