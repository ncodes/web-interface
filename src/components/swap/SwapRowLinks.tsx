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

export function SwapRowLinks({ swap }: { swap: Swap }) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <>
      <span className="hidden lg:inline border-r border-gray-800 shrink-0">
        <Button
          variant="link"
          rounded="none"
          className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
        >
          View Liquidity
        </Button>
      </span>
      <span className="hidden lg:inline border-gray-800 shrink-0">
        <Button
          variant="link"
          rounded="none"
          className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
        >
          View Market
        </Button>
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
            <DropdownMenuItem className="flex gap-2">
              View Liquidity
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2">
              View Market
            </DropdownMenuItem>
            {swap && !!swap.orderId && (
              <DropdownMenuItem
                disabled={true}
                className="flex gap-2 border-t rounded-none border-gray-800"
              >
                <span className="text-xs font-light text-gray-400 flex gap-1">
                  <span className="text-gray-500">ID:</span>
                  <span>{swap.orderId}</span>
                </span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
      {swap && !!swap.orderId && (
        <span className="hidden lg:block h-full border-l border-gray-800 shrink-0 cursor-default">
          <span className="text-xs px-2 font-light text-gray-400 flex h-full items-center gap-1">
            <span className="text-gray-500">ID:</span>
            <span>{swap.orderId}</span>
          </span>
        </span>
      )}
    </>
  );
}
