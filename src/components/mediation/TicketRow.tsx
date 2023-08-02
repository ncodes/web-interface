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
import { PlusCircle, TicketIcon, XIcon } from "lucide-react";
import { IconExchange } from "../icons/IconExchange.tsx";
import { StatCard } from "../market/StatCard.tsx";
import IconRequestMoney from "../icons/IconRequestMoney.tsx";

interface Ticket {
  index: number;
}

export function TicketRow({
  ticket,
  noFocus,
  className,
}: {
  ticket: Ticket;
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
            <div className="flex md:flex-col w-full md:px-0 md:py-4 pt-2 md:pt-4">
              <div className="flex gap-2">
                <span>
                  <TicketIcon className="text-orange-500" width="20px" />
                </span>
                <span>{ticket.index}</span>
              </div>
              <div className="flex w-full justify-end md:justify-start">
                <span className="flex items-center gap-1 text-xs font-light tracking-wider">
                  <span className="text-gray-300">
                    <IconStatus width="20px" />
                  </span>
                  <span>Maturing</span>
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
                    title={`Bond (P2P)`}
                    tip={`The total amount of security deposit locked in the ticket`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200">5,503</span>
                  </StatCard>
                  <StatCard
                    title={`Pool ID`}
                    tip={`The pool where the ticket is currently staked`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200">1</span>
                  </StatCard>
                  <StatCard
                    title={`Draft Count`}
                    tip={`The number of times this ticket has been drafted`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200">10</span>
                  </StatCard>
                  <StatCard
                    title={`Current Phase`}
                    tip={`The current state of the ticket`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200">Maturation</span>
                  </StatCard>
                  <StatCard
                    title={`Mature By`}
                    tip={`The time the ticket is expected to reach maturity`}
                    width="w-auto"
                  >
                    72:00:00
                  </StatCard>
                  <StatCard
                    title={`Next Phase`}
                    tip={`The next phase of the dispute`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200 ">Join Pool</span>
                  </StatCard>
                  <StatCard
                    title={`Cancel Time`}
                    tip={`The time the ticket can be cancelled`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200 ">00:00.01</span>
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
              <span className="flex py-1 text-xs text-gray-500 gap-1 items-center">
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
                <XIcon width="20px" /> Cancel
              </Button>
            </span>
            <span className="hidden lg:inline border-r border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                <IconRequestMoney width="20px" /> Drain Bond
              </Button>
            </span>
            <span className="hidden lg:inline border-r border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                <PlusCircle width="20px" /> Join Pool
              </Button>
            </span>
            <span className="hidden lg:inline border-r border-gray-800 shrink-0">
              <Button
                variant="link"
                rounded="none"
                className="text-xs px-2 text-gray-400 hover:text-chinese-green flex items-center gap-1"
              >
                <IconExchange width="20px" /> View Swap
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
