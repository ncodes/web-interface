import React, { useEffect, useState } from "react";
import useStore from "../hooks/store/useStore.ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ScrollArea } from "./ui/scroll-area.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card.tsx";
import { useSheetInfo } from "../hooks/useSheetInfo.ts";
import { cn } from "../libs/utils.ts";

function NotificationItem() {
  return (
    <Card className="w-full shrink-0 border border-card-border bg-card-background shadow-gray-900 shadow-lg hover:border-gray-600 transition-all duration-500 cursor-pointer">
      <CardHeader className="p-0 ">
        <CardTitle className="text-gray-300 text-xs tracking-wide p-2 px-3 font-medium border-b border-gray-800 cursor-pointer">
          NEW ORDER
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 px-3 text-white font-extralight text-sm">
        A new swap was created for your liquidity.
      </CardContent>
      <CardFooter className="border-t border-gray-800 p-0  font-light text-sm text-center">
        <a
          href="#"
          className="text-chinese-green block rounded-b-xl w-full py-1 px-3 hover:text-gray-200 hover:bg-gray-800  transition-all duration-500 "
        >
          View Order
        </a>
      </CardFooter>
    </Card>
  );
}

export function NotificationSheet(props: {
  children?: React.ReactNode;
  onOpen?: (open: boolean) => void;
}) {
  const [, sheetSide, styles] = useSheetInfo();
  const [open, setOpen] = useState(false);
  const openState = useStore((state) => state.openState);
  const toggleOpenState = useStore((state) => state.toggleOpenState);

  useEffect(() => {
    setOpen(openState.notifSheet ?? open);
  }, [openState.notifSheet]);

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        props.onOpen && props.onOpen(open);
        toggleOpenState && toggleOpenState("notifSheet");
      }}
    >
      <SheetTrigger>{props.children}</SheetTrigger>
      <SheetContent
        className={cn(
          styles,
          "w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0"
        )}
        side={sheetSide}
      >
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
              Notifications
              <span className="bg-red-600 rounded-full w-5 h-5 text-xs flex items-center justify-center font-light">
                6
              </span>
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="px-3 text-white pt-3 h-full">
          <ScrollArea type="scroll" className="h-full pb-10">
            <div className="flex flex-col gap-3">
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
            </div>
          </ScrollArea>
        </div>
        <div
          className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            toggleOpenState && toggleOpenState("notifSheet");
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
