import { Cross2Icon } from "@radix-ui/react-icons";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ReactNode, useState } from "react";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { cn } from "../../libs/utils.ts";
import { ToolTip } from "../ToolTip.tsx";
import { Badge } from "../ui/badge.tsx";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet.tsx";
import { BadgeSheetContent } from "./BadgeSheetContent.tsx";

export function BadgePill({
  name,
  prefix,
  tip,
  className,
  prefixClassName,
  noOpen,
}: {
  name: string;
  prefix?: string;
  tip?: ReactNode;
  className?: string;
  prefixClassName?: string;
  noOpen?: boolean;
}) {
  const [sheetHeight, sheetSide, styles] = useSheetInfo("h-[80vh]");
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      open={noOpen ? false : open}
      notHidden={true}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <SheetTrigger>
        <ToolTip tip={tip} allowPropagation>
          <Badge
            className={cn(
              "pl-[1px] py-0 w-auto font-normal tracking-wider whitespace-nowrap  cursor-pointer rounded-full bg-gray-800  text-gray-300 hover:bg-chinese-green hover:text-gray-900 flex items-center gap-2",
              className,
            )}
            variant="secondary"
          >
            <span
              className={cn(
                "text-gray-500 block px-2 py-[2px] rounded-full",
                prefixClassName,
              )}
            >
              {prefix ? prefix : ""}
            </span>
            <span className="font-semibold tracking-widest">{name}</span>
          </Badge>
        </ToolTip>
      </SheetTrigger>
      <SheetContent
        className={cn(
          styles,
          "w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0 p-0 m-0",
        )}
        side={sheetSide}
      >
        <ScrollArea
          type="scroll"
          className={cn("", sheetHeight, "xl:h-screen")}
        >
          <BadgeSheetContent badge={name.toLowerCase()} />
        </ScrollArea>
        <div
          className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            setOpen(false);
          }}
        >
          <Cross2Icon className="h-6 w-6 transition-all duration-300 hover:text-chinese-green hover:scale-110 cursor-pointer" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
