import { PairAvatar } from "../avatar/PairAvatar.tsx";
import IconCopyFilled from "../icons/IconCopyFilled.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import IconHeart from "../icons/IconHeart.tsx";
import { MarketStat } from "./MarketStat.tsx";
import { BadgePill } from "./BadgePill.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { Button } from "../ui/Button.tsx";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import IconFilterOutline from "../icons/IconFilterOutline.tsx";
import { useState } from "react";
import { cn } from "../../libs/utils.ts";
import { EditMarketSheet } from "./EditMarketSheet.tsx";

export function MarketItem({
  base,
  quote,
  ownerMode,
}: {
  base: string;
  quote: string;
  ownerMode?: boolean;
}) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [openEditMarketSheet, setOpenEditMarketSheet] = useState(false);

  return (
    <div className="bg-card-background border border-gray-800 transition-all hover:border-gray-700 duration-300 hover:scale-[1.002] cursor-pointer rounded-xl">
      <div className="flex h-auto">
        <div className="h-full border-r select-none border-gray-800 shrink-0">
          <div className="flex items-center gap-3 px-3 md:px-5 py-4">
            <PairAvatar
              base="BTC"
              quote="UNI"
              baseSrc="/images/icons/asset-icons/btc.svg"
              quoteSrc="/images/icons/asset-icons/uni.svg"
            />
            <div className="flex flex-col">
              <span>
                {base} - {quote}
              </span>
              <span className="flex items-center gap-1 text-sm font-extralight text-blue-200">
                <span>
                  ID:<span className="hidden md:inline"> 0x83...a73b</span>
                </span>
                <IconCopyFilled
                  width="13px"
                  height="13px"
                  className="opacity-70 hover:opacity-100 hover:text-chinese-green cursor-pointer transition-all duration-300 active:text-white active:scale-50"
                />
              </span>
            </div>
          </div>
        </div>
        <div className="w-full overflow-hidden scroll-shadow">
          <ScrollAreaHorizontal type="scroll">
            <div className="py-[8px] flex gap-2 px-3">
              <MarketStat
                title="Price ($)"
                tip={`The price of 1 ${base} in USD`}
                title2={
                  <span className="text-green-400 hidden xxs:inline">
                    (+10%)
                  </span>
                }
              >
                $1,234
              </MarketStat>
              <MarketStat
                title="Price"
                title2="(UNI)"
                tip={`The price of 1 ${base} in ${quote}`}
              >
                50,640
              </MarketStat>
              <MarketStat
                title="24hrs Volume"
                title2=""
                tip={`The total volume of ${base} traded in the last 24hrs`}
              >
                <span className="text-gray-200">$45m</span>
              </MarketStat>
              <MarketStat
                title="Total Liquidity"
                title2=""
                tip={`The total amount of ${base} in the market`}
              >
                <span className="text-gray-200">$125m</span>
              </MarketStat>
              <MarketStat
                title="Commission"
                title2="(%)"
                tip={`The commission reserved for the market owner`}
              >
                <span className="text-gray-200"> 0.5</span>
              </MarketStat>
              <MarketStat
                title="Offer Only"
                title2=""
                width="w-[125px]"
                tip={`Only offers can be made on this market. No direct swap.`}
              >
                <span className="text-gray-200">YES</span>
              </MarketStat>
              <MarketStat
                title="PUT Open"
                title2=""
                width="w-[125px]"
                tip={`Liquidity providers must be allow-listed to provider liquidity to this market`}
              >
                <span className="text-gray-200">YES</span>
              </MarketStat>
              <MarketStat
                title="SWAP Open"
                title2=""
                tip={`Takers must be allow-listed to swap liquidity from this market`}
              >
                <span className="text-gray-200">NO</span>
              </MarketStat>
            </div>
          </ScrollAreaHorizontal>
        </div>
      </div>
      <div className="flex pr-2 justify-between border-t border-gray-800">
        <div className="flex w-full items-center gap-2 px-3 pr-0 md:px-5 md:pr-0 overflow-hidden">
          <div className="flex border-r border-gray-800 py-2 pr-2 tracking-wide items-center gap-1 text-sm text-gray-300 font-extralight">
            <span className="hidden sm:inline">Badges</span>
            <ToolTip tip="Badges required by the market creator. LP stands for 'Liquidity Provider', TK for 'Taker'">
              <span className="opacity-50 hover:opacity-100 hover:text-chinese-green cursor-pointer transition-all duration-300">
                <IconInfoCircle />
              </span>
            </ToolTip>
          </div>
          <div className="flex-1 overflow-hidden tracking-wider scroll-shadow">
            <ScrollAreaHorizontal type="scroll">
              <div className="flex items-center gap-2 pr-3">
                <BadgePill name="LP:KYC" />
                <BadgePill name="TK:KYC" />
                <BadgePill name="NIGERIAN" />
                <BadgePill name="MERCHANT" />
                <BadgePill name="MERCHANT" />
              </div>
            </ScrollAreaHorizontal>
          </div>
        </div>
        <div className="flex items-center border-l border-gray-800 pl-2">
          <span className="inline-block pb-0 hover:text-chinese-green text-gray-400 transition-all duration-300 hover:scale-110">
            {!ownerMode && <IconHeart />}
            {ownerMode && (
              <DropdownMenu
                onOpenChange={(open) => {
                  setMoreMenuOpen(open);
                }}
              >
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "flex gap-1 h-7 w-7 items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green",
                      { "scale-x-105 text-chinese-green": moreMenuOpen }
                    )}
                  >
                    <DotsVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
                  <DropdownMenuItem
                    className="flex gap-2"
                    onClick={() => {
                      setOpenEditMarketSheet(true);
                    }}
                  >
                    <IconFilterOutline /> Edit Market
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </span>
        </div>
      </div>
      <div className="absolute">
        <EditMarketSheet
          active={openEditMarketSheet}
          onOpen={(open) => {
            setOpenEditMarketSheet(open);
          }}
        />
      </div>
    </div>
  );
}
