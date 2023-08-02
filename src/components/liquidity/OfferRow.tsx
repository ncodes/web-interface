import { BaseSyntheticEvent, useState } from "react";
import { LiqAvatarHoverCard } from "./LiqAvatarHoverCard.tsx";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { StatCard } from "../market/StatCard.tsx";
import { cn } from "../../libs/utils.ts";
import { Button } from "../ui/Button.tsx";
import { TimerIcon } from "@radix-ui/react-icons";

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
  useState(false);

  return (
    <div
      onClick={(e: BaseSyntheticEvent) => {
        const canTrigger = e.target.getAttribute("data-swap-trigger");
        if (canTrigger && canTrigger == "1") {
          // setOpenSwapSheet(!openSwapSheet);
        }
      }}
    >
      <div
        data-swap-trigger="1"
        className={cn(
          "border bg-card-background border-card-border transition-all duration-300 rounded-xl hover:scale-[1.002] hover:border-chinese-green cursor-pointer",
          className
        )}
      >
        <div className="flex flex-col md:flex-row" data-swap-trigger="1">
          <div
            data-swap-trigger="1"
            className="flex gap-2 p-5 px-3 py-0 items-center shrink-0 border-r border-gray-800"
          >
            <div>
              <LiqAvatarHoverCard>
                <EmojiAvatar size={AvatarSize.Small} randomStr="abcen" />
              </LiqAvatarHoverCard>
            </div>
            <div
              className="flex py-3 md:py-0 w-full md:w-auto  md:flex-col justify-start xxs:justify-between md:justify-start z-[6] xxs:items-center md:items-start gap-1"
              data-swap-trigger="1"
            >
              <span data-swap-trigger="1">0xAbc..xYz</span>
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
                  data-swap-trigger="1"
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
                    <span className="text-gray-200">1day 2hrs 30m</span>
                  </StatCard>
                </div>
              </ScrollAreaHorizontal>
            </ScrollGradientIndicator>
          </div>
        </div>
        <div className="flex justify-between border-t border-card-border py-2 px-3">
          <span className="hidden md:flex py-1 text-xs text-gray-500 gap-1 items-center">
            <TimerIcon /> <span className="text-gray-200">3 days ago</span>
          </span>
          <div>
            <Button size="xs" className="px-5">
              Execute
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
