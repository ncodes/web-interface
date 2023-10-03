import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import { useQuery } from "@tanstack/react-query";
import { UserHoverCard } from "../UserHoverCard.tsx";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { isEqlStr } from "../../libs/helpers.ts";
import { useRandomColor } from "../avatar/useRandomColor.ts";
import { cn } from "../../libs/utils.ts";
import moment from "moment";
import { Message } from "./db.ts";
import {
  getDrafteeIndex,
  isProvider,
  isSwapCounterparty,
  isSwapDraftee,
} from "../../libs/api_utils.ts";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { MessageItemStatus } from "./MessageItemStatus.tsx";
import { Clock } from "lucide-react";

export function MessageItem({
  msg,
  swap,
  onResend,
}: {
  msg: Message;
  swap: Swap;
  onResend?: (msg: Message) => void;
}) {
  const { getUser } = useUserService();
  const { getBgColor } = useRandomColor();
  const { address } = useConnectorContext();
  const mine = isEqlStr(msg.from, address);
  const title = getTitle(swap, msg.from);
  const user = useQuery({
    queryKey: ["getUser", { address: msg.from, noAuth: true }],
    queryFn: getUser,
    enabled: !!msg.from,
  });

  function getTitle(swap: Swap, sender: string) {
    if (isEqlStr(sender, address)) return "You";
    if (isSwapCounterparty(swap, sender)) {
      if (isProvider(swap, sender)) return "Liquidity Provider";
      return "Taker";
    }
    if (isSwapDraftee(swap, sender))
      return `Mediator#${getDrafteeIndex(swap, sender)}`;
    return "";
  }

  return (
    <>
      {!mine && (
        <div className="flex gap-2 animate-in slide-in-from-left-56">
          <UserHoverCard user={user?.data as User}>
            <EmojiAvatar size={AvatarSize.Small} randomStr={msg.from} />
          </UserHoverCard>
          <div className="flex flex-col bg-gray-800/60 border border-gray-700/50 flex-1 rounded-xl rounded-tl-none px-2 pb-1">
            <span className="flex justify-between text-xs pt-1 pb-1 font-normal tracking-wide">
              <span className="select-none flex gap-2">
                <span
                  className={cn(
                    `px-[5px] text-[10px] rounded-xl rounded-tl-none rounded-bl-md text-gray-100`
                  )}
                  style={{ background: getBgColor(msg.from) }}
                >
                  {title}
                </span>
              </span>
              <span className="flex gap-1 h-[16px] items-center text-gray-500 tracking-wider font-light">
                <Clock width="10" className="text-gray-400" />
                <span>{moment.unix(msg.sentAt).fromNow()}</span>
              </span>
            </span>
            <span className="font-light text-sm text-gray-200 tracking-wide break-words">
              {msg.content as string}
            </span>
          </div>
        </div>
      )}

      {mine && (
        <div className="flex gap-2 animate-in slide-in-from-right-56">
          <div className="flex flex-col bg-gray-800/60 border border-gray-700/50 flex-1 rounded-xl rounded-tr-none px-2 pb-2">
            <span className="flex justify-between text-xs pt-1 pb-1 font-normal tracking-wide">
              <span className="text-gray-500 h-[16px] font-light gap-1 flex items-center">
                <Clock width="10" className="text-gray-400" />
                <span>{moment.unix(msg.sentAt).fromNow()}</span>
              </span>
              <span className="select-none flex gap-1">
                <span
                  className={cn(
                    `px-[5px] text-[10px] rounded-xl rounded-tr-none rounded-br-md`
                  )}
                  style={{ background: getBgColor(msg.from) }}
                >
                  You
                </span>
              </span>
            </span>
            <span className="font-light text-sm text-gray-200 tracking-wide break-words">
              {msg.content as string}
            </span>
            <MessageItemStatus msg={msg} onResend={onResend} swap={swap} />
          </div>
          <UserHoverCard user={user?.data as User}>
            <EmojiAvatar size={AvatarSize.Small} randomStr={msg.from} />
          </UserHoverCard>
        </div>
      )}
    </>
  );
}
