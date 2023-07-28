import React, { useEffect, useState } from "react";
import { cn } from "../libs/utils.ts";
import { AnimatePresence, motion } from "framer-motion";
import { PairAvatar } from "./avatar/PairAvatar.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { ScrollArea } from "./ui/scroll-area.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet.tsx";
import { Input } from "./ui/Input.tsx";
import { IconSearch } from "./icons/IconSearch.tsx";
import { useMediaQuery } from "usehooks-ts";
import useStore from "../hooks/store/useStore.ts";
import { Cross2Icon } from "@radix-ui/react-icons";
import ScrollGradientIndicator from "./ScrollGradientIndicator.tsx";

function SearchBoxItem() {
  return (
    <div className="flex py-2 px-3 gap-2 items-center hover:bg-gray-950 cursor-pointer">
      <PairAvatar
        base="BTC"
        quote="UNI"
        baseSrc="/images/icons/asset-icons/btc.svg"
        quoteSrc="/images/icons/asset-icons/uni.svg"
        className="[&>span>img]:w-[32px]"
        className2="[&>span>img]:w-[32px] !-ml-3"
      />
      <div>
        <div className="text-sm">BTC - UNI</div>
        <div className="text-xs font-extralight tracking-wider text-gray-400 ">
          Market
        </div>
      </div>
      <div className="flex-1 flex gap-2 justify-end">
        <Card className="w-[130px] text-right shrink-0 border border-card-border bg-card-background shadow-gray-900  shadow-lg">
          <CardHeader className="px-3 py-2 pb-0">
            <CardTitle className="text-xs tracking-wide font-light text-gray-400 flex justify-end gap-2">
              <span>Price</span>
              <span className="text-green-400">(+10%)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-0 pb-2 tracking-wide text-chinese-green">
            $1,234
          </CardContent>
        </Card>
        <Card className="hidden md:inline w-[83px] shrink-0 text-right border border-card-border bg-card-background shadow-gray-900  shadow-lg">
          <CardHeader className="px-3 py-2 pb-0">
            <CardTitle className="text-xs tracking-wider font-light text-gray-400">
              <span>24hr Vol.</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white px-3 py-0 pb-2 tracking-wide">
            $23m
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SearchContent({ renderInput }: { renderInput?: boolean }) {
  const [focus, setFocus] = useState(false);

  return (
    <>
      {renderInput && (
        <div className="flex lg:hidden p-2 border-b border-gray-800 ">
          <SearchInput
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            focus={focus}
            autoFocus={true}
          />
        </div>
      )}
      <ScrollGradientIndicator side="bottom">
        <ScrollArea className="pb-[40px] md:pb-0 md:h-[400px]" type="scroll">
          <div className="flex justify-between items-center p-3 py-3 pb-1 ">
            <span className="font-medium text-gray-100 tracking-wider text-sm rounded-full">
              Recent Search
            </span>
            <span className="font-light text-xs text-gray-300 tracking-wider">
              12 Results
            </span>
          </div>
          <div className="divide-y divide-gray-900">
            <SearchBoxItem />
            <SearchBoxItem />
          </div>

          <div className="flex justify-between items-center p-3 py-3 ">
            <span className="font-medium text-gray-100 tracking-wider text-sm rounded-full">
              Top Markets
            </span>
            <span className="font-light text-xs text-gray-300 tracking-wider">
              4 Results
            </span>
          </div>
          <div className="divide-y divide-gray-900 [&>div:last-child]:rounded-b-2xl">
            <SearchBoxItem />
            <SearchBoxItem />
            <SearchBoxItem />
            <SearchBoxItem />
            <SearchBoxItem />
            <SearchBoxItem />
            <SearchBoxItem />
            <SearchBoxItem />
            <SearchBoxItem />
            <SearchBoxItem />
            <SearchBoxItem />
            <SearchBoxItem />
            <SearchBoxItem />
            <SearchBoxItem />
          </div>
        </ScrollArea>
      </ScrollGradientIndicator>
    </>
  );
}

export default function SearchBox(props: {
  children: React.ReactNode;
  open?: boolean;
  onOpen?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <div className="hidden md:block z-[5] ">
      {open && (
        <div
          className="fixed w-full h-full top-0 left-0 right-0"
          onClick={() => {
            setOpen(!open);
            props.onOpen && props.onOpen(!open);
          }}
        />
      )}
      <div className="md:relative">
        <div>{props.children}</div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 1.05, opacity: 0, display: "hidden" }}
              animate={{
                opacity: 1,
                display: "block",
                scale: 1.05,
                transition: { delay: 0.1, ease: "easeInOut" },
              }}
              exit={{
                opacity: 0,
                display: "block",
                scale: 1,
                transition: { delay: 0, ease: "easeInOut" },
              }}
              className={cn(
                "overflow-hidden absolute bg-card-background md:w-[500px] xl:w-full min-h-[100px] border border-gray-700 ring-chinese-green rounded-xl mt-5  "
              )}
            >
              <SearchContent renderInput={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SearchInput(props: {
  onFocus: () => void;
  onBlur: () => void;
  focus: boolean;
  autoFocus?: boolean;
}) {
  return (
    <>
      <Input
        placeholder="Search tokens, pairs or addresses"
        rounded="full"
        autoFocus={props.autoFocus}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        className={cn(
          " delay-75  ease-in-out focus-visible:ring-chinese-green text-[16px] placeholder:font-light rounded-full p-5  pr-11 cursor-pointer  hover:border-chinese-green transition-all duration-500 text-gray-100 tracking-wider ",
          {
            "ring-chinese-green !border-chinese-green !ring-0 outline-none":
              props.focus,
          }
        )}
      />
      <IconSearch
        height="24px"
        width="24px"
        className="relative -ml-9 top-2 cursor-pointer"
      />
    </>
  );
}

export function SearchSheetBox(props: {
  children?: React.ReactNode;
  onOpen?: (open: boolean) => void;
}) {
  const isTablet = useMediaQuery("(min-width: 768px)");
  const [focus, setFocus] = useState(false);
  const [open, setOpen] = useState(false);
  const searchSheetOpen = useStore((state) => state.searchSheetOpen);
  const toggleSearchSheetOpen = useStore((s) => s.toggleSearchSheetOpen);

  useEffect(() => {
    setOpen(searchSheetOpen ?? open);
  }, [searchSheetOpen]);

  useEffect(() => {
    if (isTablet) setOpen(false);
  }, [isTablet]);

  return (
    <Sheet
      open={open}
      modal={false}
      onOpenChange={(open) => {
        setOpen(open);
        props.onOpen && props.onOpen(open);
      }}
    >
      <SheetTrigger>{props.children}</SheetTrigger>
      <SheetContent
        className="md:hidden w-full border-r-0 pt-0 px-0"
        side="left"
      >
        <SheetHeader className="flex pl-3 pt-2 pr-[50px]">
          <div className="text-white">
            <SheetTitle className="flex text-gray-100">
              <SearchInput
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                focus={focus}
                autoFocus={true}
              />
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="px-1 text-white pt-2 h-full">
          <SearchContent />
        </div>
        <div
          className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            toggleSearchSheetOpen && toggleSearchSheetOpen();
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function InputActivatedSearchBox() {
  const [focus, setFocus] = useState(false);

  return (
    <SearchBox open={focus}>
      <div
        className={cn(
          "hidden lg:flex lg:w-[230px] xl:w-[500px] mt-1 transition-all duration-500 hover:scale-x-105",
          { "scale-x-105": focus }
        )}
      >
        <SearchInput
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          focus={focus}
        />
      </div>
    </SearchBox>
  );
}
