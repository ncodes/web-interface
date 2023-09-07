import React, { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import useStore from "../../hooks/store/useStore.ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { SearchInput } from "./SearchInput.tsx";
import { SearchContent } from "./SearchContent.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";

export function SearchSheetBox(props: {
  children?: React.ReactNode;
  onOpen?: (open: boolean) => void;
}) {
  const isTablet = useMediaQuery("(min-width: 768px)");
  const [focus, setFocus] = useState(false);
  const [open, setOpen] = useState(false);
  const openState = useStore((state) => state.openState);
  const toggleOpenState = useStore((s) => s.toggleOpenState);

  useEffect(() => {
    setOpen(openState.searchSheet ?? open);
  }, [openState]);

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
            toggleOpenState && toggleOpenState("searchSheet");
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
