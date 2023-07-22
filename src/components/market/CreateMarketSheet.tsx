import { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { Avatar } from "../avatar/Avatar.tsx";
import { Input } from "../ui/Input.tsx";
import { Switch } from "../ui/switch.tsx";
import { Button } from "../ui/Button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.tsx";
import { cn } from "../../libs/utils.ts";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { ToolTip } from "../ToolTip.tsx";

function AssetSelectorItem({
  avatarUrl,
  symbol,
  name,
  type,
  tip,
}: {
  avatarUrl: string;
  symbol: string;
  name: string;
  type: string;
  tip?: ReactNode;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      className={cn(
        "asset-item flex py-2 gap-3 px-3 transition-all duration-150 border-gray-900 items-center cursor-pointer",
        { "bg-chinese-green scale-x-[1.03]": hover }
      )}
    >
      <div>
        <Avatar src={avatarUrl} fallback={symbol} className="w-[35px]" />
      </div>
      <div className="flex flex-col select-none">
        <span className={cn("text-[16px]", { "text-gray-800": hover })}>
          {name} ({symbol})
        </span>
        <span
          className={cn("subtitle text-xs text-gray-400", {
            "text-gray-600": hover,
          })}
        >
          {type}
        </span>
      </div>
      <div
        className={cn(
          "flex-1 flex justify-end text-gray-500 cursor-pointer transition-all duration-300",
          { "text-gray-800": hover }
        )}
      >
        <ToolTip tip={tip} side="left">
          <IconInfoCircle />
        </ToolTip>
      </div>
    </div>
  );
}

function AssetSelector({
  side,
  symbol,
  image,
}: {
  side: string;
  symbol: string;
  image: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      modal={true}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <PopoverTrigger>
        <div className="flex gap-2 flex-col">
          <div className="flex items-center gap-2">
            <span className="tracking-wide text-sm xxs:text-[16px]">
              {side}
            </span>
            <IconInfoCircle
              width="15px"
              className="opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer"
            />
          </div>
          <Button
            variant="ghost"
            className="p-0 h-auto hover:text-gray-100 transition-all hover:border-gray-500 duration-300"
            asChild
          >
            <div
              className={cn(
                "flex items-center min-w-[120px] max-w-[170px] pl-3 pr-2 justify-between rounded-full bg-gray-700 border border-gray-600 cursor-pointer hover:bg-gray-600 hover:scale-105",
                { "bg-gray-600 scale-105 border-gray-500": open }
              )}
            >
              <div className="text-xl font-medium overflow-auto scrollbar-hide tracking-wide">
                {symbol}
              </div>
              <div className="shrink-0">
                <Avatar src={image} fallback={symbol} />
              </div>
            </div>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 rounded-3xl bg-modal-background border-modal-border drop-shadow shadow-xl overflow-hidden">
        <div className="h-[400px] relative flex flex-col overflow-auto scroll-auto">
          <div className="px-3 py-3">
            <Input
              type="text"
              className="py-5 px-3 text-gray-200"
              placeholder="Search token (ex: WETH, 0xAbC)"
            />
          </div>
          <ScrollArea
            type="scroll"
            className="text-gray-200 border-t border-gray-700"
          >
            <div className="divide-y">
              <AssetSelectorItem
                name="Bitcoin"
                symbol="BTC"
                type="ERC20"
                avatarUrl="/images/icons/asset-icons/btc.svg"
                tip="An ERC20 asset"
              />
              <AssetSelectorItem
                name="Uniswap"
                symbol="UNI"
                type="SYNTHETIC"
                avatarUrl="/images/icons/asset-icons/uni.svg"
              />
              <AssetSelectorItem
                name="Bitcoin"
                symbol="BTC"
                type="ERC20"
                avatarUrl="/images/icons/asset-icons/btc.svg"
              />
              <AssetSelectorItem
                name="Bitcoin"
                symbol="BTC"
                type="ERC20"
                avatarUrl="/images/icons/asset-icons/btc.svg"
              />
              <AssetSelectorItem
                name="Bitcoin"
                symbol="BTC"
                type="ERC20"
                avatarUrl="/images/icons/asset-icons/btc.svg"
              />
              <AssetSelectorItem
                name="Bitcoin"
                symbol="BTC"
                type="ERC20"
                avatarUrl="/images/icons/asset-icons/btc.svg"
              />
              <AssetSelectorItem
                name="Bitcoin"
                symbol="BTC"
                type="ERC20"
                avatarUrl="/images/icons/asset-icons/btc.svg"
              />
              <AssetSelectorItem
                name="Bitcoin"
                symbol="BTC"
                type="ERC20"
                avatarUrl="/images/icons/asset-icons/btc.svg"
              />
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function CreateMarketSheet({
  children,
  active,
  onOpen,
}: {
  children?: ReactNode;
  active: boolean;
  onOpen: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(active);
    onOpen && onOpen(active);
  }, [active, onOpen]);

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        onOpen && onOpen(open);
      }}
    >
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        className="w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0"
        side="right"
      >
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
              Create Market
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="flex gap-2 flex-col text-white h-full">
          <div className="flex">
            <div className="p-5 pb-0 flex-1">
              <AssetSelector
                side="Base Asset"
                symbol="BTC"
                image="/images/icons/asset-icons/btc.svg"
              />
            </div>

            <div className="p-5 pb-0 flex-1">
              <AssetSelector
                side="Quote Asset"
                symbol="UNI"
                image="/images/icons/asset-icons/uni.svg"
              />
            </div>
          </div>

          <div>
            <div className="flex gap-2 flex-col p-5 pb-0">
              <div className="flex items-center gap-2">
                <span className="tracking-wide">Commission</span>
                <IconInfoCircle
                  width="15px"
                  className="opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer"
                />
              </div>
              <div>
                <Input
                  type="number"
                  className="px-3 p-5 !w-[150px]"
                  placeholder="0.1"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex gap-2 flex-col p-5 pb-0">
              <div className="flex items-center gap-2">
                <span className="tracking-wide">Permissions</span>
                <IconInfoCircle
                  width="15px"
                  className="opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex font-light text-sm text-gray-400 justify-between">
                  <span>Anyone can add liquidity</span>
                  <span>
                    <Switch checked={true} />
                  </span>
                </div>
                <div className="flex font-light text-sm text-gray-400 justify-between">
                  <span>Anyone can swap</span>
                  <span>
                    <Switch checked={true} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-3 mb-4 pt-4 border-t border-gray-800 absolute w-full bottom-0">
            <Button size="full">Create</Button>
          </div>
        </div>
        <div
          className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            setOpen(false);
            onOpen && onOpen(false);
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
