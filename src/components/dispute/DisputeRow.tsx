import { BaseSyntheticEvent, useState } from "react";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import { Button } from "../ui/Button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { cn } from "../../libs/utils.ts";
import { DotsVerticalIcon, TimerIcon } from "@radix-ui/react-icons";
import IconStatus from "../icons/IconStatus.tsx";
import IconCoinStack from "../icons/IconCoinStack.tsx";
import { IconMarket } from "../icons/IconMarket.tsx";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { TicketIcon } from "lucide-react";
import { IconExchange } from "../icons/IconExchange.tsx";
import { StatCard } from "../market/StatCard.tsx";

interface Dispute {
  creator: string;
  defendant: string;
}

export function DisputeRow({
  dispute,
  noFocus,
  className,
}: {
  dispute: Dispute;
  noFocus?: boolean;
  className?: string;
}) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <div
      onClick={(e: BaseSyntheticEvent) => {
        const canTrigger = e.target.getAttribute("data-swap-trigger");
        if (canTrigger && canTrigger == "1" && !noFocus) {
          // do something
        }
      }}
    >
      <div
        data-swap-trigger="1"
        className={cn(
          "border bg-card-background border-card-border transition-all duration-300 rounded-xl",
          {
            "hover:scale-[1.002] hover:border-chinese-green cursor-pointer":
              !noFocus,
          },
          className
        )}
      >
        <div className="flex flex-col md:flex-row" data-swap-trigger="1">
          <div
            data-swap-trigger="1"
            className="flex gap-2 p-5 px-3 md:px-5 py-0 items-center shrink-0 md:border-r border-gray-800"
          >
            <div className="flex w-full items-center gap-2 md:gap-1 md:px-0 md:py-4 pt-2 md:pt-4">
              <div className="flex ">
                <EmojiAvatar
                  size={AvatarSize.Small}
                  randomStr={dispute.creator}
                />
                <span className="-ml-1">
                  <EmojiAvatar
                    size={AvatarSize.Small}
                    randomStr={dispute.defendant}
                  />
                </span>
              </div>
              <div className="flex md:flex-col w-full justify-between md:justify-start">
                <span>
                  {dispute.creator.substring(0, 6)} vs{" "}
                  {dispute.defendant.substring(0, 6)}
                </span>
                <span className="flex items-center gap-1 text-xs font-light tracking-wider">
                  <span className="text-gray-300">
                    <IconStatus width="12px" />
                  </span>
                  <span>Drafting</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden shrink-0">
            <ScrollGradientIndicator>
              <ScrollAreaHorizontal className="flex mr-[1px]">
                <div
                  className="flex-1 flex py-2 px-2 gap-2"
                  data-swap-trigger="1"
                >
                  <StatCard
                    title={`No. of Mediators`}
                    tip={`The total number of mediators required for this dispute`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200">3</span>
                  </StatCard>
                  <StatCard
                    title={`No. Drafted`}
                    tip={`The number of mediators that have drafted the dispute`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200">2</span>
                  </StatCard>
                  <StatCard
                    title={`Prayer`}
                    tip={`The outcome the dispute creator is seeking (release or cancel)`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200">Release</span>
                  </StatCard>
                  <StatCard
                    title={`Current Phase`}
                    tip={`The current phase of the dispute`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200">Drafting</span>
                  </StatCard>
                  <StatCard
                    title={`Next Phase`}
                    tip={`The next phase of the dispute`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200 ">Evidence Phase</span>
                  </StatCard>
                  <StatCard
                    title={`Evidence Phase`}
                    tip={`The outcome the dispute creator is seeking (release or cancel)`}
                    width="w-auto"
                  >
                    <span className="text-gray-200">Starts in:</span> 72:00:00
                  </StatCard>
                </div>
              </ScrollAreaHorizontal>
            </ScrollGradientIndicator>
          </div>
        </div>
        <div className="flex justify-between border-t border-card-border">
          <div
            data-swap-trigger="1"
            className="flex items-center w-full gap-2 px-3 pr-0 md:px-3 md:pr-0 overflow-hidden"
          >
            <div className="text-xs text-gray-500 tracking-wide font-light">
              <span className="hidden md:flex py-1 text-xs text-gray-500 gap-1 items-center">
                <TimerIcon /> <span className="text-gray-200">3 days ago</span>
              </span>
            </div>
          </div>
          <div
            data-swap-trigger="1"
            className="flex items-center border-l border-gray-800 shrink-0 px-2"
          >
            <span className="hidden lg:inline border-r border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                <IconExchange width="20px" /> View Swap
              </Button>
            </span>
            <span className="hidden lg:inline border-r border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                <TicketIcon width="20px" /> View Ticket
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
                    <IconCoinStack width="20px" /> View Swap
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-2">
                    <IconMarket width="20px" /> View Ticket
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
