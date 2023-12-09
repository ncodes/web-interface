import { Cross2Icon } from "@radix-ui/react-icons";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { cn } from "../../libs/utils.ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { DisputeFilterContent } from "./DisputeFilterContent.tsx";

export function DisputeFilterSheet({
  active,
  onOpen,
  children,
}: {
  active?: boolean;
  onOpen?: (open: boolean) => void;
  children?: ReactNode;
}) {
  const [sheetHeight, sheetSide, styles] = useSheetInfo("h-[70svh]");
  const [open, setOpen] = useState(active);
  const loc = useLocation();

  useEffect(() => {
    setOpen(active);
    onOpen && onOpen(active || false);
  }, [active, onOpen]);

  useEffect(() => {
    setOpen(false);
    onOpen && onOpen(false);
  }, [loc]);

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
        className={cn(
          styles,
          "flex flex-col gap-0 w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0 pb-0",
          sheetHeight,
        )}
        side={sheetSide}
      >
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
              Filter Disputes
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="flex-1 text-white h-full">
          <DisputeFilterContent />
        </div>
        <div
          className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            setOpen(false);
            onOpen && onOpen(false);
          }}
        >
          <Cross2Icon className="h-6 w-6 transition-all duration-300 hover:text-chinese-green hover:scale-110 cursor-pointer" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
