import { BaseSyntheticEvent, useState } from "react";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { StatCard } from "../market/StatCard.tsx";
import { Button } from "../ui/Button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { cn } from "../../libs/utils.ts";
import { DotsVerticalIcon, TimerIcon } from "@radix-ui/react-icons";
import { PairAvatar } from "../avatar/PairAvatar.tsx";
import IconStatus from "../icons/IconStatus.tsx";
import IconCoinStack from "../icons/IconCoinStack.tsx";
import { IconMarket } from "../icons/IconMarket.tsx";

export function SwapRow({
  base,
  quote,
  noFocus,
  className,
}: {
  base: string;
  quote: string;
  noFocus?: boolean;
  className?: string;
}) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <div
      onClick={(e: BaseSyntheticEvent) => {
        const canTrigger = e.target.getAttribute("data-click-trigger");
        if (canTrigger && canTrigger == "1" && !noFocus) {
          // do something
        }
      }}
    >
      <div
        data-click-trigger="1"
        className={cn(
          "border bg-card-background border-card-border transition-all duration-300 rounded-xl",
          {
            "hover:scale-[1.002] hover:border-chinese-green cursor-pointer":
              !noFocus,
          },
          className
        )}
      >
        <div className="flex flex-col md:flex-row" data-click-trigger="1">
          <div
            data-click-trigger="1"
            className="flex gap-2 p-5 px-3 md:px-5 py-0 items-center shrink-0 md:border-r border-gray-800"
          >
            <div className="flex w-full items-center gap-2 md:gap-1 md:px-0 md:py-4 pt-2 md:pt-4">
              <PairAvatar
                base="BTC"
                quote="UNI"
                baseSrc="/images/icons/asset-icons/btc.svg"
                quoteSrc="/images/icons/asset-icons/uni.svg"
                className="[&>span>img]:w-[35px]"
                className2="[&>span>img]:w-[35px] !-ml-2"
              />
              <div className="flex md:flex-col w-full justify-between md:justify-start">
                <span>
                  {base} - {quote}
                </span>
                <span className="flex items-center gap-1 text-xs font-light tracking-wider text-green-400">
                  <span className="text-gray-300">
                    <IconStatus width="12px" />
                  </span>
                  <span>Released</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden shrink-0">
            <ScrollGradientIndicator>
              <ScrollAreaHorizontal className="flex mr-[1px]">
                <div
                  className="flex-1 flex py-2 px-2 gap-2"
                  data-click-trigger="1"
                >
                  <StatCard
                    title={`Price (${quote})`}
                    tip={`The price of 1 ${base} in ${quote}`}
                  >
                    $1,234
                  </StatCard>
                  <StatCard
                    title="Price ($)"
                    tip={`The price of 1 ${base} in USD`}
                    title2=""
                  >
                    $1,234
                  </StatCard>
                  <StatCard
                    title={`Base (${base})`}
                    tip={`The amount of ${base} requested by the taker`}
                  >
                    <span className="text-gray-200">1,300</span>
                  </StatCard>
                  <StatCard
                    title={`Quote (${quote})`}
                    tip={`The amount of ${quote} to be paid by the taker`}
                  >
                    <span className="text-gray-200">400</span>
                  </StatCard>
                  <StatCard
                    title={`Fee (${quote})`}
                    tip={`The amount of fee paid`}
                  >
                    <span className="text-gray-200">0.56</span>
                  </StatCard>
                  <StatCard
                    title={`Instant`}
                    tip={`Whether the transaction is instant or not`}
                  >
                    <span className="text-gray-200">True</span>
                  </StatCard>
                  <StatCard title={`Status`} tip={`Current status of the swap`}>
                    <span className="text-gray-200">Paid</span>
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
              <span className="hidden md:flex py-1 text-xs text-gray-500 gap-1 items-center">
                <TimerIcon /> <span className="text-gray-200">3 days ago</span>
              </span>
            </div>
          </div>
          <div
            data-click-trigger="1"
            className="flex items-center border-l border-gray-800 shrink-0"
          >
            <span className="hidden lg:inline border-r border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                <IconCoinStack width="20px" /> View Liquidity
              </Button>
            </span>
            <span className="hidden lg:inline border-r border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                <IconMarket width="20px" /> View Market
              </Button>
            </span>

            <span className="lg:hidden border-l border-gray-800">
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
