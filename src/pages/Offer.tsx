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
import { Messenger } from "../components/messenger/Messenger.tsx";
import { Button } from "../components/ui/Button.tsx";
import { UserHoverCard } from "../components/liquidity/UserHoverCard.tsx";
import EmojiAvatar from "../components/avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../components/avatar/useAvatar.tsx";
import { shortenAddress } from "../libs/helpers.ts";
import { Label } from "../components/ui/label.tsx";

function Event({
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
                Offer
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
        <div className="p-0 m-0">
          <div className=" pr-0 flex-1 ">
            <OfferRow
              base={"BTC"}
              quote={"UNI"}
              className="rounded-none border-r-0 border-l-0 border-t-0 border-b hover:border-b-card-border"
            />
            <div className="flex flex-col md:items-center gap-5 px-3 md:px-5 py-5">
              <Label className="text-xl tracking-wide">Offer Events</Label>
              <Event
                address="0xEB892e4300bA60442e0f5c3605F82002157a488F"
                time="2 days ago"
              >
                <div className=" items-center text-gray-200 font-light">
                  Proposed a new offer (Amount: 10 BTC, Price: 1 UNI)
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="full"
                    className="border-gray-800 text-sm"
                  >
                    Accept
                  </Button>
                </div>
              </Event>
              <Event
                address="0xEB892e4300bA60442e0f5c3605F82002157a488F"
                time="2 days ago"
              >
                <div className=" items-center text-gray-200 font-light">
                  Updated the offer (Amount: 10 BTC, Price: 1 UNI)
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="full"
                    className="border-gray-800 text-sm"
                  >
                    Accept
                  </Button>
                </div>
              </Event>
              <Event
                address="0xEB892e4300bA60442e0f5c3605F82002157a488F"
                time="2 days ago"
              >
                <div className=" items-center text-gray-200 font-light">
                  Accepted the offer
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="full"
                    className="border-gray-800 text-sm"
                  >
                    Execute
                  </Button>
                </div>
              </Event>
            </div>
          </div>
        </div>
      </TabsContent>
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
