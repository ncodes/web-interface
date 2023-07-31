import { Label } from "../ui/label.tsx";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { IconPlus } from "../icons/IconPlus.tsx";
import { Input } from "../ui/Input.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import { cn } from "../../libs/utils.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { Upload } from "lucide-react";

function Message({
  mine,
  msg,
  sender,
  title,
}: {
  mine?: boolean;
  msg?: string;
  sender: string;
  title?: string;
}) {
  return (
    <>
      {!mine && (
        <div className="flex gap-2">
          <EmojiAvatar size={AvatarSize.Small} randomStr={sender} />
          <div className="flex flex-col bg-gray-800 border border-gray-900 flex-1 rounded-xl rounded-tl-none px-2 pb-2">
            <span className="flex justify-between text-xs pt-1 pb-1 text-chinese-green font-normal tracking-wide">
              <span className="select-none">
                {sender} {title && `(${title})`}
              </span>
              <span className="text-gray-500 tracking-wider font-light">
                2 days ago
              </span>
            </span>
            <span className="font-light text-sm text-gray-200 tracking-wide">
              {msg}
            </span>
          </div>
        </div>
      )}

      {mine && (
        <div className="flex gap-2">
          <div className="flex flex-col bg-gray-800 border border-gray-900 flex-1 rounded-xl rounded-tr-none px-2 pb-2">
            <span className="flex justify-between text-xs pt-1 pb-1 text-chinese-green font-normal tracking-wide">
              <span className="text-gray-500 font-light">2 days ago</span>
              <span className="select-none">
                {sender} {title && `(${title})`}
              </span>
            </span>
            <span className="font-light text-sm text-gray-200 tracking-wide">
              {msg}
            </span>
          </div>
          <EmojiAvatar size={AvatarSize.Small} randomStr={sender} />
        </div>
      )}
    </>
  );
}

export function Messenger({ sheetMode }: { sheetMode: boolean }) {
  return (
    <div className="relative h-full">
      <div
        className={cn(
          "absolute overflow-hidden flex flex-col text-gray-200 w-full h-full bg-card-background",
          { "rounded-xl border-card-border border": !sheetMode }
        )}
      >
        <Label
          className={cn(
            "flex gap-2 items-center select-none p-3 py-3 bg-gray-800 border-gray-700 text-xl drop-shadow-3xl",
            { "justify-between gap-0": !sheetMode }
          )}
        >
          <span className="tracking-wider">Chat</span>
          <span>
            <span className="rounded-full h-[20px] min-w-[20px] px-[5px] leading-[20px] flex justify-center items-center  bg-red-600 text-[10px]">
              60
            </span>
          </span>
        </Label>
        <div className="flex max-h-full  justify-between flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ScrollGradientIndicator side="bottom" className="h-full">
              <ScrollArea type="scroll" className="h-full">
                <div className="px-3 py-3 flex flex-col gap-4">
                  <Message
                    sender="0x1234..345"
                    msg="This is the evidence of payment. How can I release the coins?"
                  />
                  <Message
                    sender="0x8394..345"
                    msg="You don't need to do anything. I will release it when i verify payment"
                    mine
                    title="Mediator"
                  />
                  <Message
                    sender="0x8394..345"
                    msg="You don't need to do anything. I will release it when i verify payment"
                    title="You"
                    mine
                  />
                  <Message
                    sender="0x1234..345"
                    msg="This is the evidence of payment. How can I release the coins?"
                    title="Counterparty"
                  />
                  <Message
                    sender="0x1234..345"
                    msg="This is the evidence of payment. How can I release the coins?"
                    title="Counterparty"
                  />
                  <Message
                    sender="0x8394..345"
                    msg="You don't need to do anything. I will release it when i verify payment"
                    title="You"
                    mine
                  />
                  <Message
                    sender="0x8394..345"
                    msg="You don't need to do anything. I will release it when i verify payment"
                    title="You"
                    mine
                  />
                  <Message
                    sender="0x8394..345"
                    msg="You don't need to do anything. I will release it when i verify payment"
                    title="You"
                    mine
                  />
                  <Message
                    sender="0x8394..345"
                    msg="You don't need to do anything. I will release it when i verify payment"
                    title="You"
                    mine
                  />
                  <Message
                    sender="0x8394..345"
                    msg="You don't need to do anything. I will release it when i verify payment"
                    title="You"
                    mine
                  />
                  <Message
                    sender="0x8394..345"
                    msg="You don't need to do anything. I will release it when i verify payment"
                    title="You"
                    mine
                  />
                </div>
              </ScrollArea>
            </ScrollGradientIndicator>
          </div>
          <div
            className={cn(
              "flex shrink-0 p-2 gap-2 items-center border-t border-gray-700 bg-gray-800",
              { "rounded-b-xl": !sheetMode }
            )}
          >
            <div className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="rounded-full p-[2px] cursor-pointer hover:bg-chinese-green hover:text-black transition-all duration-300">
                    <IconPlus width="20" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card-background border-card-border text-gray-300 p-0">
                  <DropdownMenuItem className="flex gap-2">
                    <Upload width="15" />
                    <span>Upload File</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-1">
              <Input
                type="text"
                variant="default"
                rounded="full"
                className="px-3"
                placeholder="Type a message"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
