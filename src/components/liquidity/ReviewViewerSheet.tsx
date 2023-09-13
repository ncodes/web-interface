import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { IconStarSmile } from "../icons/IconStarSmile.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { cn } from "../../libs/utils.ts";

function ReviewItem({
  address,
  msg,
  isHappy,
}: {
  address: string;
  msg: string;
  isHappy?: boolean;
}) {
  return (
    <div className="px-5 flex items-center gap-2 border-b border-gray-800 pb-3">
      <EmojiAvatar size={AvatarSize.Small} randomStr={address} />
      <div className="flex-1 text-sm text-gray-100 font-light p-1 px-3 rounded-xl rounded-tl-none">
        {msg}
      </div>
      <div className="shrink-0">
        {isHappy && <ThumbsUp width="20px" className="text-green-400" />}
        {!isHappy && <ThumbsDown width="20px" className="text-red-400" />}
      </div>
    </div>
  );
}

export function ReviewViewerSheet(props: {
  open: boolean;
  onOpenChange: (open) => void;
}) {
  const [open, setOpen] = React.useState(props.open);
  const [, sheetSide, styles] = useSheetInfo();

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <Sheet open={open} onOpenChange={props.onOpenChange}>
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
              Reviews for 0x123...a73b
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="flex flex-col text-white h-full select-none">
          <div className="flex justify-between py-4 px-5 border-b border-gray-800">
            <div className="flex gap-3">
              <div className="flex items-center gap-1 text-green-400">
                <ThumbsUp width="20px" />
                <span className="ml-1">120</span>
              </div>
              <div className="flex items-center gap-1 text-red-400">
                <ThumbsDown width="20px" />
                <span className="ml-1">120</span>
              </div>
            </div>
            <ToolTip tip="Happy Rate: Indicates the percentage of people who are happy with this account.">
              <div className="flex items-center gap-1 text-yellow-300 cursor-pointer">
                <span>
                  <IconStarSmile width="20px" />
                </span>
                <span>80%</span>
              </div>
            </ToolTip>
          </div>
          <div className="relative overflow-hidden pb-10 h-full">
            <ScrollOverflowIndicator side="bottom" className="h-full">
              <ScrollArea type="scroll" className="w-full h-full">
                <div className="pt-5 flex flex-col gap-3 h-full">
                  <ReviewItem
                    address="abcdefg"
                    msg="I am happy with the trade. I am happy with the trade. It was fast."
                    isHappy
                  />
                  <ReviewItem
                    address="0x1223"
                    msg="This user defrauded me. I am not happy"
                  />
                  <ReviewItem
                    address="0x1323"
                    msg="This user defrauded me. I am not happy"
                    isHappy
                  />
                  <ReviewItem
                    address="0x12323"
                    msg="This user defrauded me. I am not happy"
                  />
                  <ReviewItem
                    address="0x13423"
                    msg="This user defrauded me. I am not happy"
                  />
                  <ReviewItem
                    address="0x1r3423"
                    msg="This user defrauded me. I am not happy"
                    isHappy
                  />
                  <ReviewItem
                    address="0x134s23"
                    msg="This user defrauded me. I am not happy"
                  />
                  <ReviewItem
                    address="0x134a23"
                    msg="This user defrauded me. I am not happy"
                  />
                  <ReviewItem
                    address="0x133423"
                    msg="This user defrauded me. I am not happy"
                    isHappy
                  />
                  <ReviewItem
                    address="0x1783423"
                    msg="This user defrauded me. I am not happy"
                    isHappy
                  />
                  <ReviewItem
                    address="0x1343423"
                    msg="This user defrauded me. I am not happy"
                  />
                  <ReviewItem
                    address="0x1345323"
                    msg="This user defrauded me. I am not happy"
                    isHappy
                  />
                  <ReviewItem
                    address="0x4213423"
                    msg="This user defrauded me. I am not happy"
                  />
                  <ReviewItem
                    address="0x4213423"
                    msg="A user defrauded me. I am not happy"
                  />{" "}
                  <ReviewItem
                    address="0x4213423"
                    msg="A user defrauded me. I am not happy"
                  />{" "}
                  <ReviewItem
                    address="0x4213423"
                    msg="A user defrauded me. I am not happy"
                  />{" "}
                  <ReviewItem
                    address="0x4213423"
                    msg="A user defrauded me. I am not happy. I am not happy. I am not happy. I am not happy. I am not happy"
                  />
                </div>
              </ScrollArea>
            </ScrollOverflowIndicator>
          </div>
        </div>
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
