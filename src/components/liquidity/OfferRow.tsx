import { BaseSyntheticEvent, useState } from "react";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { StatCard } from "../market/StatCard.tsx";
import { cn } from "../../libs/utils.ts";
import { Button } from "../ui/Button.tsx";
import { DotsVerticalIcon, TimerIcon } from "@radix-ui/react-icons";
import { MessageCircle, PlayCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import IconCoinStack from "../icons/IconCoinStack.tsx";
import { IconMarket } from "../icons/IconMarket.tsx";

export function OfferRow({
  base,
  quote,
  className,
}: {
  base: string;
  quote: string;
  ownerMode?: boolean;
  className?: string;
}) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <div
      onClick={(e: BaseSyntheticEvent) => {
        const canTrigger = e.target.getAttribute("data-click-trigger");
        if (canTrigger && canTrigger == "1") {
          // setOpenSwapSheet(!openSwapSheet);
        }
      }}
    >
      <div
        data-click-trigger="1"
        className={cn(
          "border bg-card-background border-card-border transition-all duration-300 rounded-xl hover:scale-[1.002] hover:border-chinese-green cursor-pointer",
          className
        )}
      >
        <div className="flex flex-col md:flex-row" data-click-trigger="1">
          <div
            data-click-trigger="1"
            className="flex gap-2 p-5 px-3 py-0 items-center shrink-0 border-r border-gray-800"
          >
            <div>
              <EmojiAvatar size={AvatarSize.Small} randomStr="abcen" />
            </div>
            <div
              className="flex py-3 md:py-0 w-full md:w-auto  md:flex-col justify-start xxs:justify-between md:justify-start z-[6] xxs:items-center md:items-start gap-1"
              data-click-trigger="1"
            >
              <span data-click-trigger="1">0xAbc..xYz</span>
              {/*<a className="bg-gray-700">Update</a>*/}
              {/*<a className="bg-red-600">Unaccept</a>*/}
              <span className="md:hidden flex-1 text-xs text-gray-500 flex items-center justify-end gap-1">
                <TimerIcon /> <span className="text-gray-200">3 days ago</span>
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ScrollGradientIndicator>
              <ScrollAreaHorizontal className="flex mr-[1px]">
                <div
                  className="flex-1 flex py-2 px-2 gap-2"
                  data-click-trigger="1"
                >
                  <StatCard
                    title="Price ($)"
                    tip={`The offer price for 1 ${base} in USD`}
                    title2=""
                  >
                    $1,234
                  </StatCard>
                  <StatCard
                    title={`Price (${quote})`}
                    tip={`The offer price for 1 ${base} in ${quote}`}
                  >
                    $1,234
                  </StatCard>
                  <StatCard
                    title={`Amount`}
                    tip={`The amount of ${base} being requested`}
                  >
                    <span className="text-gray-200">100</span>
                  </StatCard>
                  <StatCard
                    title={`Status`}
                    tip={`The current status of the offer`}
                  >
                    <span className="text-gray-200">Pending</span>
                  </StatCard>
                  <StatCard
                    title={`Expires In`}
                    tip={`When the offer will expire`}
                  >
                    <span className="text-gray-200">24:00:00:34</span>
                  </StatCard>
                </div>
              </ScrollAreaHorizontal>
            </ScrollGradientIndicator>
          </div>
        </div>
        <div className="flex justify-between border-t border-card-border">
          <div
            data-click-trigger="1"
            className="flex items-center w-full gap-2 px-3 pr-0 md:px-3 md:pr-0 overflow-hidden"
          >
            <div className="text-xs text-gray-500 tracking-wide font-light">
              <span className="flex py-1 text-xs text-gray-500 gap-1 items-center">
                <TimerIcon /> <span className="text-gray-200">3 days ago</span>
              </span>
            </div>
          </div>
          <div
            data-click-trigger="1"
            className="flex items-center border-l border-gray-800 shrink-0 px-2"
          >
            <span className="hidden lg:inline border-r border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                <PlayCircle width="20px" /> Execute
              </Button>
            </span>

            <span className="hidden lg:inline border-r border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                <MessageCircle width="20px" /> Messages{" "}
                <div className="rounded-full h-[20px] min-w-[20px] px-[5px] leading-[20px] flex justify-center items-center bg-red-600 text-[10px] text-white">
                  2
                </div>
              </Button>
            </span>

            <span className="lg:hidden ">
              <DropdownMenu
                onOpenChange={(open) => {
                  setMoreMenuOpen(open);
                }}
              >
                <DropdownMenuTrigger className="outline-0 ring-0">
                  <span
                    className={cn(
                      "px-2 py-3 outline-0 ring-0 flex gap-1  items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green",
                      { "scale-x-105 text-chinese-green": moreMenuOpen }
                    )}
                  >
                    <DotsVerticalIcon />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
                  <DropdownMenuItem className="flex gap-2">
                    <IconCoinStack width="20px" /> View Liquidity
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-2">
                    <IconMarket width="20px" /> View Market
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
