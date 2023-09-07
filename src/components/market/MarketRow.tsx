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
import { BaseSyntheticEvent, useState } from "react";
import { cn } from "../../libs/utils.ts";
import { EditMarketSheet } from "./EditMarketSheet.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import {
  approxNumber,
  formatToHighDenom,
  shortenAddress,
} from "../../libs/helpers.ts";
import CopyToClipboard from "react-copy-to-clipboard";
import { USDAmountToolTip } from "../USDAmountToolTip.tsx";
import { useNavigate } from "react-router-dom";
import { IconSettingsOutline } from "../icons/IconSettingsOutline.tsx";
import { PriceChange } from "./PriceChange.tsx";

export function MarketRow({
  market,
  ownerMode,
  noFocus,
  className,
}: {
  market: Market;
  className?: string;
  ownerMode?: boolean;
  noFocus?: boolean;
}) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [openEditMarketSheet, setOpenEditMarketSheet] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "border select-none bg-card-background border-card-border transition-all duration-300 rounded-xl ",
        {
          "hover:scale-[1.002] hover:border-chinese-green cursor-pointer":
            !noFocus,
        },
        className
      )}
      onClick={(e: BaseSyntheticEvent) => {
        const canTrigger = e.target.getAttribute("data-click-trigger");
        if (canTrigger && canTrigger == "1" && !noFocus) {
          navigate(`/market/${market.address}`);
        }
      }}
    >
      <div className="flex flex-col md:flex-row h-auto">
        <div className="h-full border-r select-none border-gray-800 shrink-0">
          <div
            data-click-trigger="1"
            className="flex items-center gap-2 md:gap-3 px-3 md:px-3 md:py-4 pt-2 md:pt-4"
          >
            <PairAvatar
              base={market.base}
              quote={market.quote}
              baseSrc={market.baseLogo}
              quoteSrc={market.quoteLogo}
              dataClickTrigger={"1"}
            />
            <div className="flex md:flex-col w-full justify-between md:justify-start">
              <span className="flex" data-click-trigger="1">
                {market.base}
                <span className="text-gray-500 inline-block mx-1">/</span>
                {market.quote}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-light text-blue-200">
                <span data-click-trigger="1">
                  ID: &nbsp;
                  <span data-click-trigger="1">
                    {shortenAddress(market.address)}
                  </span>
                </span>
                <CopyToClipboard text={market.address}>
                  <IconCopyFilled
                    width="13px"
                    height="13px"
                    className="opacity-70 hover:opacity-100 hover:text-chinese-green cursor-pointer transition-all duration-300 active:text-white active:scale-50"
                  />
                </CopyToClipboard>
              </span>
            </div>
          </div>
        </div>
        <div className="w-full overflow-hidden mr-[2px]" data-click-trigger="1">
          <ScrollGradientIndicator className="[&::before]:rounded-r-none md:[&::before]:rounded-tr-2xl">
            <ScrollAreaHorizontal type="scroll" className="mx-2 md:mx-0">
              <div
                data-click-trigger="1"
                className="py-[8px] flex gap-2 md:px-2"
              >
                <StatCard
                  title={`Price (${market.base})`}
                  width="w-auto"
                  tip={`The price of 1 ${market.base} in USD`}
                  title2={<PriceChange priceChange={market.priceChange} />}
                >
                  <span className="flex gap-1" data-click-trigger="1">
                    <span data-click-trigger="1">
                      {formatToHighDenom(
                        market.lowestPrice,
                        market.quoteDecimals
                      )}
                    </span>
                    <USDAmountToolTip v={parseFloat(market.lowestPriceUsd)} />
                  </span>
                </StatCard>

                <StatCard
                  title="Total Liquidity"
                  title2=""
                  tip={`The total amount of ${market.base} in the market`}
                >
                  <span className="flex gap-1" data-click-trigger="1">
                    <span className="text-gray-200" data-click-trigger="1">
                      {formatToHighDenom(
                        market.totalLiquidity,
                        market.baseDecimals
                      )}
                    </span>
                    <USDAmountToolTip
                      v={parseFloat(market.totalLiquidityUsd)}
                    />
                  </span>
                </StatCard>
                <StatCard
                  title="24hrs Volume"
                  title2=""
                  tip={`The total volume of ${market.base} traded in the last 24hrs`}
                >
                  <span className="text-gray-200" data-click-trigger="1">
                    ${approxNumber(parseFloat(market.volume24h), 3)}
                  </span>
                </StatCard>
                <StatCard
                  title="Commission"
                  title2="(%)"
                  tip={`The commission reserved for the market owner`}
                >
                  <span className="text-gray-200" data-click-trigger="1">
                    {market.commission / 100}
                  </span>
                </StatCard>
                <StatCard
                  title="Offer Only"
                  title2=""
                  width="w-[125px]"
                  tip={`Only offers can be made on this market. No direct swap.`}
                >
                  <span className="text-gray-200" data-click-trigger="1">
                    {market.offerOnly ? "YES" : "NO"}
                  </span>
                </StatCard>
                <StatCard
                  title="PUT Open"
                  title2=""
                  width="w-[125px]"
                  tip={`Is the market open to the public for adding liquidity?`}
                >
                  <span className="text-gray-200" data-click-trigger="1">
                    {market.permPut ? "NO" : "YES"}
                  </span>
                </StatCard>
                <StatCard
                  title="SWAP Open"
                  title2=""
                  tip={`Is the market open to the public for swapping liquidity?`}
                >
                  <span className="text-gray-200" data-click-trigger="1">
                    {market.permSwap ? "NO" : "YES"}
                  </span>
                </StatCard>
              </div>
            </ScrollAreaHorizontal>
          </ScrollGradientIndicator>
        </div>
      </div>
      <div className="flex justify-between border-t border-gray-800">
        <div className="flex w-full px-3 pr-0 md:px-3 md:pr-0 overflow-hidden">
          <div className="flex border-r border-gray-800 py-2 pr-2 tracking-wide items-center gap-1 text-sm text-gray-300 font-extralight">
            {/*<span className="hidden sm:inline">Badges</span>*/}
            <ToolTip tip="Badges required by the market creator. LP stands for 'Liquidity Provider', TK for 'Taker'">
              <span className="text-gray-400 hover:text-chinese-green cursor-pointer transition-all duration-300">
                <IconInfoCircle width="22px" />
              </span>
            </ToolTip>
          </div>
          <div className="flex-1 overflow-hidden items-center tracking-wider">
            <ScrollGradientIndicator className="[&::before]:rounded-none h-full flex items-center -mt-[1px]">
              <ScrollAreaHorizontal type="scroll">
                <div className="flex items-center gap-2 px-2">
                  {market.requiredPutBadges.map((badge) => (
                    <BadgePill
                      key={badge}
                      name={badge.toUpperCase()}
                      prefix="LP"
                      tip={`Liquidity providers must have "${badge}" badge to be allowed to add liquidity`}
                    />
                  ))}
                  {market.requiredSwapBadges.map((badge) => (
                    <BadgePill
                      key={badge}
                      name={badge.toUpperCase()}
                      prefix="TK"
                      tip={`Takers must have "${badge}" badge to be allowed to swap this liquidity`}
                    />
                  ))}
                  {market.requiredPutBadges.length == 0 &&
                    market.requiredSwapBadges.length == 0 && (
                      <span className="text-xs text-gray-500 font-light">
                        No badge required
                      </span>
                    )}
                </div>
              </ScrollAreaHorizontal>
            </ScrollGradientIndicator>
          </div>
        </div>
        <div
          className="flex items-center border-l border-gray-800"
          data-click-trigger="1"
        >
          {ownerMode && (
            <span className="hidden lg:inline border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                onClick={() => {
                  setOpenEditMarketSheet(true);
                }}
                className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                <IconSettingsOutline width="15px" /> Manage
              </Button>
            </span>
          )}
          {!ownerMode && (
            <span className="flex cursor-pointer items-center px-2 pb-0 hover:text-chinese-green text-gray-400 transition-all duration-300 hover:scale-110">
              <IconHeart />
            </span>
          )}
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
                    <IconSettingsOutline width="15px" /> Manage Market
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
