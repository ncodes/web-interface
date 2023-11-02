import { Cross2Icon } from "@radix-ui/react-icons";
import { ReactNode, useState } from "react";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { cn } from "../../libs/utils.ts";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { Badge } from "../ui/badge.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";

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
  const [, sheetSide, styles] = useSheetInfo();
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
              className
            )}
            variant="secondary"
          >
            <span
              className={cn(
                "text-gray-500 block px-2 py-[2px] rounded-full",
                prefixClassName
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
          "w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0"
        )}
        side={sheetSide}
      >
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
              Badge: {name.split(":")[1] || name}
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className=" text-white h-full">
          <ScrollArea type="scroll" className="h-full pb-10">
            <BadgeSheetContent />
          </ScrollArea>
        </div>
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
} // eslint-disable-next-line no-empty-pattern
function BadgeSheetContent({}: { badge?: string }) {
  return (
    <div className="flex flex-col">
      <div className="w-full h-[150px] bg-gray-900 cover"></div>
      <div className="p-5 flex flex-col gap-1 tracking-wide border-b border-gray-800">
        <h1 className="text-gray-200 flex items-center gap-2">
          Description{" "}
          <ToolTip tip="Brief information about this badge">
            <IconInfoCircle
              width="15px"
              className="text-gray-400 hover:text-gray-200 cursor-pointer"
            />
          </ToolTip>
        </h1>
        <p className="text-gray-400 font-light text-sm">
          This badge indicates that a user has completed Tier 1 Know Your
          Customer (KYC) registration.
        </p>
        <div className="flex gap-5">
          <div>
            <h1 className="text-gray-200 flex items-center gap-2 mt-4">
              Target{" "}
              <ToolTip tip="The user that is required to have this badge">
                <IconInfoCircle
                  width="15px"
                  className="text-gray-400 hover:text-gray-200 cursor-pointer"
                />
              </ToolTip>
            </h1>
            <p className="text-gray-400 font-light text-sm">
              Liquidity Provider
            </p>
          </div>
          <div>
            <h1 className="text-gray-200 flex items-center gap-2 mt-4">
              Issuer{" "}
              <ToolTip tip="The website of the badge issuer">
                <IconInfoCircle
                  width="15px"
                  className="text-gray-400 hover:text-gray-200 cursor-pointer"
                />
              </ToolTip>
            </h1>
            <p className="text-gray-400 font-light text-sm">
              <a
                href="http://google.com"
                className="hover:text-gray-200 transition-all"
              >
                https://google.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <iframe
          className="w-full h-[400px]"
          src="https://nairaland.com"
        ></iframe>
      </div>
    </div>
  );
}
