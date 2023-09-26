import { useState } from "react";
import { Button } from "../ui/Button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { cn } from "../../libs/utils.ts";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function SwapRowLinks({ swap }: { swap: Swap }) {
  const location = useLocation();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <>
      {location.pathname.includes("/swaps") && (
        <span className="flex border-l border-gray-800 pl-1">
          <NavLink to={`/swap/${swap.orderId}`}>
            <Button
              title="Open Liquidity"
              variant="link"
              rounded="lg"
              scale="sm"
              className="text-sm px-1 text-gray-300 flex items-center gap-1"
            >
              <ChevronRight />
            </Button>
          </NavLink>
        </span>
      )}
      <span className="hidden lg:inline border-r border-gray-800 shrink-0">
        <NavLink
          to={`/liquidity/${swap.marketAddress}/${swap.provider}/${swap.lid}`}
        >
          <Button
            variant="link"
            rounded="none"
            className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
          >
            View Liquidity
          </Button>
        </NavLink>
      </span>
      <span className="hidden lg:inline border-gray-800 shrink-0">
        <NavLink to={`/market/${swap.marketAddress}`}>
          <Button
            variant="link"
            rounded="none"
            className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
          >
            View Market
          </Button>
        </NavLink>
      </span>
      <span className=" lg:hidden border-l border-gray-800">
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
            <NavLink
              to={`/liquidity/${swap.marketAddress}/${swap.provider}/${swap.lid}`}
            >
              <DropdownMenuItem className="flex gap-2">
                View Liquidity
              </DropdownMenuItem>
            </NavLink>
            <NavLink to={`/market/${swap.marketAddress}`}>
              <DropdownMenuItem className="flex gap-2">
                View Market
              </DropdownMenuItem>
            </NavLink>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    </>
  );
}
