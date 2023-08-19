import { ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownArrow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";
import { cn } from "../libs/utils.ts";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { getChain, getChains } from "../hooks/connectors/networks.ts";
import useConnector from "../hooks/connectors/useConnector.tsx";
import { ChainInfo } from "../types/global";

function DropdownMenuItemCustom({
  children,
  className,
  onSelect,
}: {
  children: ReactNode;
  className?: string;
  onSelect: (event: Event) => void;
}) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      className={cn(
        "flex items-center gap-2 font-normal text-[13px] px-2 py-2 transition-all duration-300 focus:scale-x-105 focus:bg-chinese-green cursor-pointer rounded-none",
        className
      )}
    >
      {children}
    </DropdownMenuItem>
  );
}

export function NetworkSelector() {
  const [open, setOpen] = useState(false);
  const { switchNetwork, chainId, defaultNetwork } = useConnector();
  const [curChain, setCurChain] = useState<ChainInfo | undefined>(
    getChain(defaultNetwork)
  );

  useEffect(() => {
    if (!chainId) return;
    setCurChain(getChain(chainId));
  }, [chainId]);

  const changeNetwork = useCallback(
    async (chainId: number) => {
      await switchNetwork(chainId);
    },
    [switchNetwork]
  );

  return (
    <div>
      <DropdownMenu onOpenChange={setOpen}>
        <DropdownMenuTrigger className="outline-0 ring-0">
          <div
            className={cn(
              "md:w-[152px] flex gap-2 justify-between border items-center transition-all duration-500 hover:cursor-pointer hover:bg-gray-800 hover:scale-x-105 hover:border-chinese-green p-2 px-2 pr-1 rounded-full border-gray-600",
              {
                "scale-105 border-chinese-green": open,
              }
            )}
          >
            {curChain?.logoPath({
              width: 25,
              height: 25,
            })}
            <span className="hidden md:inline">
              {curChain?.altDisplayName || curChain?.displayName}
            </span>
            <span className="relative -left-1 top-[0px]">
              {open ? <ChevronUp /> : <ChevronDown />}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[152px] tracking-wide shadow-xl drop-shadow-2xl rounded-2xl bg-modal-background border-gray-600 text-gray-200 px-0 py-0">
          {getChains(
            false,
            true,
            curChain?.chainId ? [curChain?.chainId] : []
          ).map((chainId) => (
            <DropdownMenuItemCustom
              key={chainId}
              onSelect={async () => {
                await changeNetwork(chainId);
              }}
            >
              {getChain(chainId)?.logoPath({
                width: 25,
                height: 25,
              })}
              {getChain(chainId)?.displayName}
            </DropdownMenuItemCustom>
          ))}
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuLabel className="font-extralight tracking-wider text-gray-300 text-xs">
            Testnets
          </DropdownMenuLabel>
          {getChains(
            true,
            false,
            curChain?.chainId ? [curChain?.chainId] : []
          ).map((chainId) => (
            <DropdownMenuItemCustom
              key={chainId}
              onSelect={async () => {
                await changeNetwork(chainId);
              }}
            >
              {getChain(chainId)?.logoPath({
                width: 25,
                height: 25,
              })}
              {getChain(chainId)?.displayName}
            </DropdownMenuItemCustom>
          ))}
          <DropdownArrow className="fill-white" />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
