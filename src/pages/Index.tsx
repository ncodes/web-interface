import { ActivityStream } from "../components/ActivityStream.tsx";
import { ScrollAreaHorizontal } from "../components/ui/scroll-area.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs.tsx";
import { Footer } from "../components/Footer.tsx";
import Layout from "./Layout.tsx";
import EmojiAvatar from "../components/avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../components/avatar/useAvatar.tsx";
import { Button } from "../components/ui/Button.tsx";
import { shortenAddress } from "../libs/helpers.ts";
import { UserHoverCard } from "../components/liquidity/UserHoverCard.tsx";

function StreamItem({
  address,
  children,
  time,
}: {
  address: string;
  children?: React.ReactNode;
  time?: string;
}) {
  return (
    <div className="flex gap-2 w-full md:w-[500px]">
      <div>
        <UserHoverCard>
          <EmojiAvatar size={AvatarSize.Medium} randomStr="0x1234" />
        </UserHoverCard>
      </div>
      <div className="flex flex-1 flex-col gap-1 bg-card-background rounded-xl rounded-tl-none border border-gray-800">
        <div className="flex justify-between border-b border-gray-800 p-2">
          <span className="text-gray-500 text-sm font-light">
            @{shortenAddress(address)}
          </span>
          <span className="text-gray-400 font-light text-xs">{time}</span>
        </div>
        <div className="p-2 text-sm">{children}</div>
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <Layout
      tab={
        <Tabs
          defaultValue="home"
          className="w-full h-full transition-all duration-500"
        >
          <ScrollAreaHorizontal type="scroll">
            <TabsList className="justify-start px-3 py-2 border-b border-modal-border pt-0">
              <TabsTrigger
                value="home"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Home
              </TabsTrigger>
              <TabsTrigger
                value="my-activity"
                className="font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Following
              </TabsTrigger>
              <TabsTrigger
                value="top"
                className="xl:hidden font-light relative top-2 text-[14px] bg-transparent data-[state=active]:text-chinese-green h-[0] py-[14px] pb-5  data-[state=active]:font-medium"
              >
                Top
              </TabsTrigger>
            </TabsList>
          </ScrollAreaHorizontal>
          <TabsContent value="home">
            <div className="flex flex-col md:items-center gap-5 md:px-5 py-5">
              <StreamItem
                address="0xEB892e4300bA60442e0f5c3605F82002157a488F"
                time="2 days ago"
              >
                <div className=" items-center text-gray-200 font-light">
                  Added Liquidity of 10 BTC to{" "}
                  <a href="#" className="text-chinese-green">
                    BTC/UNI
                  </a>{" "}
                  market.
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="full"
                    className="border-gray-800 text-sm"
                  >
                    View Liquidity
                  </Button>
                </div>
              </StreamItem>

              <StreamItem
                address="0xEB892e4300bA60442e0f5c3605F82002157a488F"
                time="4 days ago"
              >
                <div className=" items-center text-gray-200 font-light">
                  Create a new market for XBT/USDT pairs.
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="full"
                    className="border-gray-800 text-sm"
                  >
                    View Market
                  </Button>
                </div>
              </StreamItem>

              <StreamItem
                address="0xEB892e4300bA60442e0f5c3605F82002157a488F"
                time="4 days ago"
              >
                <div className=" items-center text-gray-200 font-light">
                  Create a new market for XBT/USDT pairs.
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="full"
                    className="border-gray-800 text-sm"
                  >
                    View Market
                  </Button>
                </div>
              </StreamItem>

              <StreamItem
                address="0xEB892e4300bA60442e0f5c3605F82002157a488F"
                time="4 days ago"
              >
                <div className=" items-center text-gray-200 font-light">
                  Create a new market for XBT/USDT pairs.
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="full"
                    className="border-gray-800 text-sm"
                  >
                    View Market
                  </Button>
                </div>
              </StreamItem>

              <StreamItem
                address="0xEB892e4300bA60442e0f5c3605F82002157a488F"
                time="4 days ago"
              >
                <div className=" items-center text-gray-200 font-light">
                  Create a new market for XBT/USDT pairs.
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="full"
                    className="border-gray-800 text-sm"
                  >
                    View Market
                  </Button>
                </div>
              </StreamItem>

              <StreamItem
                address="0xEB892e4300bA60442e0f5c3605F82002157a488F"
                time="4 days ago"
              >
                <div className=" items-center text-gray-200 font-light">
                  Create a new market for XBT/USDT pairs.
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="full"
                    className="border-gray-800 text-sm"
                  >
                    View Market
                  </Button>
                </div>
              </StreamItem>

              <StreamItem
                address="0xEB892e4300bA60442e0f5c3605F82002157a488F"
                time="4 days ago"
              >
                <div className=" items-center text-gray-200 font-light">
                  Create a new market for XBT/USDT pairs.
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="full"
                    className="border-gray-800 text-sm"
                  >
                    View Market
                  </Button>
                </div>
              </StreamItem>
            </div>
          </TabsContent>
          <TabsContent value="my-activity" className=""></TabsContent>
          <TabsContent value="top" className="px-5">
            <ActivityStream />
          </TabsContent>
        </Tabs>
      }
      rightSide={
        <div>
          <ActivityStream />
          <Footer />
        </div>
      }
    />
  );
}
