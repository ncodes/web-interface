import { PairAvatar } from "../avatar/PairAvatar.tsx";
import IconCopyFilled from "../icons/IconCopyFilled.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import IconHeart from "../icons/IconHeart.tsx";
import { StatCard } from "./StatCard.tsx";
import { BadgePill } from "./BadgePill.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { Button } from "../ui/Button.tsx";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { cn } from "../../libs/utils.ts";
import { EditMarketSheet } from "./EditMarketSheet.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import IconEdit from "../icons/IconEdit.tsx";

export function MarketRow({
  base,
  quote,
  ownerMode,
  noFocus,
}: {
  base: string;
  quote: string;
  ownerMode?: boolean;
  noFocus?: boolean;
}) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [openEditMarketSheet, setOpenEditMarketSheet] = useState(false);

  return (
    <div
      className={cn(
        "bg-card-background border border-gray-800 transition-all duration-300 rounded-xl overflow-hidden",
        {
          "hover:scale-[1.002] hover:border-chinese-green cursor-pointer":
            !noFocus,
        }
      )}
    >
      <div className="flex h-auto">
        <div className="h-full border-r select-none border-gray-800 shrink-0">
          <div className="flex items-center gap-3 px-3 md:px-3 py-4">
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
              <span className="flex items-center gap-1 text-xs font-extralight text-blue-200">
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
        <div className="w-full overflow-hidden mr-[2px]">
          <ScrollGradientIndicator>
            <ScrollAreaHorizontal type="scroll">
              <div className="py-[8px] flex gap-2 px-2">
                <StatCard
                  title="Price ($)"
                  tip={`The price of 1 ${base} in USD`}
                  title2={
                    <span className="text-green-400 hidden xxs:inline">
                      (+10%)
                    </span>
                  }
                >
                  $1,234
                </StatCard>
                <StatCard
                  title="Price"
                  title2="(UNI)"
                  tip={`The price of 1 ${base} in ${quote}`}
                >
                  50,640
                </StatCard>
                <StatCard
                  title="24hrs Volume"
                  title2=""
                  tip={`The total volume of ${base} traded in the last 24hrs`}
                >
                  <span className="text-gray-200">$45m</span>
                </StatCard>
                <StatCard
                  title="Total Liquidity"
                  title2=""
                  tip={`The total amount of ${base} in the market`}
                >
                  <span className="text-gray-200">$125m</span>
                </StatCard>
                <StatCard
                  title="Commission"
                  title2="(%)"
                  tip={`The commission reserved for the market owner`}
                >
                  <span className="text-gray-200"> 0.5</span>
                </StatCard>
                <StatCard
                  title="Offer Only"
                  title2=""
                  width="w-[125px]"
                  tip={`Only offers can be made on this market. No direct swap.`}
                >
                  <span className="text-gray-200">YES</span>
                </StatCard>
                <StatCard
                  title="PUT Open"
                  title2=""
                  width="w-[125px]"
                  tip={`Liquidity providers must be allow-listed to provider liquidity to this market`}
                >
                  <span className="text-gray-200">YES</span>
                </StatCard>
                <StatCard
                  title="SWAP Open"
                  title2=""
                  tip={`Takers must be allow-listed to swap liquidity from this market`}
                >
                  <span className="text-gray-200">NO</span>
                </StatCard>
              </div>
            </ScrollAreaHorizontal>
          </ScrollGradientIndicator>
        </div>
      </div>
      <div className="flex justify-between border-t border-gray-800">
        <div className="flex w-full gap-2 px-3 pr-0 md:px-3 md:pr-0 overflow-hidden">
          <div className="flex border-r border-gray-800 py-2 pr-2 tracking-wide items-center gap-1 text-sm text-gray-300 font-extralight">
            {/*<span className="hidden sm:inline">Badges</span>*/}
            <ToolTip tip="Badges required by the market creator. LP stands for 'Liquidity Provider', TK for 'Taker'">
              <span className="text-gray-400 hover:text-chinese-green cursor-pointer transition-all duration-300">
                <IconInfoCircle width="22px" />
              </span>
            </ToolTip>
          </div>
          <div className="flex-1 overflow-hidden items-center tracking-wider">
            <ScrollGradientIndicator className="[&::before]:rounded-none h-full flex items-center">
              <ScrollAreaHorizontal type="scroll">
                <div className="flex items-center gap-2 pr-3">
                  <BadgePill name="LP:KYC" />
                  <BadgePill name="TK:KYC" />
                  <BadgePill name="NIGERIAN" />
                  <BadgePill name="MERCHANT" />
                  <BadgePill name="MERCHANT" />
                </div>
              </ScrollAreaHorizontal>
            </ScrollGradientIndicator>
          </div>
        </div>
        <div className="flex items-center border-l border-gray-800">
          {ownerMode && (
            <span className="hidden lg:inline border-r border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                onClick={() => {
                  setOpenEditMarketSheet(true);
                }}
                className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                <IconEdit width="15px" /> Manage
              </Button>
            </span>
          )}
          <span className="flex items-center px-2 pb-0 hover:text-chinese-green text-gray-400 transition-all duration-300 hover:scale-110">
            {!ownerMode && <IconHeart />}
          </span>
          {ownerMode && (
            <span className="lg:hidden border-l border-gray-800">
              <DropdownMenu
                onOpenChange={(open) => {
                  setMoreMenuOpen(open);
                }}
              >
                <DropdownMenuTrigger className="outline-0 ring-0">
                  <span
                    className={cn(
                      "outline-0 px-2 py-3 ring-0 flex gap-1  items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green",
                      { "scale-x-105 text-chinese-green": moreMenuOpen }
                    )}
                  >
                    <DotsVerticalIcon />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
                  <DropdownMenuItem
                    className="flex gap-2"
                    onClick={() => {
                      setOpenEditMarketSheet(true);
                    }}
                  >
                    <IconEdit width="15px" /> Manage Market
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          )}
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
