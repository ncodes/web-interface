import { Sheet, SheetContent } from "../ui/sheet.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { Messenger } from "./Messenger.tsx";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { cn } from "../../libs/utils.ts";

export function MessengerSheet(props: {
  open: boolean;
  swap: Swap;
  onOpenChange?: (open) => void;
}) {
  const [height, sheetSide, styles] = useSheetInfo();
  const [open, setOpen] = React.useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <Sheet open={open} onOpenChange={props.onOpenChange}>
      <SheetContent
        className={cn(
          styles,
          "w-full border-l focus-visible:outline-0 overflow-hidden border-gray-800 pt-0 px-0 pb-0",
          height
        )}
        side={sheetSide}
      >
        <Messenger swap={props.swap} sheetMode />
        <div
          className="absolute cursor-pointer text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            setOpen(false);
            props.onOpenChange && props.onOpenChange(false);
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
