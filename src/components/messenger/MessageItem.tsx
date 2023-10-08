import { useQuery } from "@tanstack/react-query";
import { File } from "buffer";
import { Clock } from "lucide-react";
import moment from "moment";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import {
  FileMeta,
  isRelayedRemoteAttachmentType,
  isRemoteAttachmentType,
  isTextType,
} from "../../hooks/messenger/codecs/common.ts";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import {
  getDrafteeIndex,
  isProvider,
  isSwapCounterparty,
  isSwapDraftee,
} from "../../libs/api_utils.ts";
import { isEqlStr } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { UserHoverCard } from "../UserHoverCard.tsx";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { useRandomColor } from "../avatar/useRandomColor.ts";
import { MessageFile } from "./MessageFile.tsx";
import { MessageImage } from "./MessageImage.tsx";
import { MessageSendStatus } from "./MessageSendStatus.tsx";
import { MessageVideo } from "./MessageVideo.tsx";
import { ContentType, Message } from "./db.ts";

export function MessageItem({
  swap,
  onResend,
  id,
  from,
  sentAt,
  content,
  contentType,
  msgId,
  readers,
  status,
}: {
  id: number;
  from: string;
  swap: Swap;
  sentAt: number;
  content: unknown;
  contentType: ContentType;
  msgId: string;
  readers: string[];
  status: Message["status"];
  onResend?: (id: number, content: unknown) => void;
}) {
  const { getUser } = useUserService();
  const { getBgColor } = useRandomColor();
  const { address } = useConnectorContext();
  const mine = isEqlStr(from, address);
  const title = getTitle(swap, from);
  const user = useQuery({
    queryKey: ["getUser", { address: from, noAuth: true }],
    queryFn: getUser,
    enabled: !!from,
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
            <EmojiAvatar size={AvatarSize.Small} randomStr={from} />
          </UserHoverCard>
          <div className="flex flex-col bg-gray-800/60 border border-gray-700/50 flex-1 rounded-xl rounded-tl-none px-2 pb-1">
            <span className="flex justify-between text-xs pt-1 pb-1 font-normal tracking-wide">
              <span className="select-none flex gap-2">
                <span
                  className={cn(
                    `px-[5px] text-[10px] rounded-xl rounded-tl-none rounded-bl-md text-gray-100`
                  )}
                  style={{ background: getBgColor(from) }}
                >
                  {title}
                </span>
              </span>
              <span className="flex gap-1 h-[16px] items-center text-gray-500 tracking-wider font-light">
                <Clock width="10" className="text-gray-400" />
                <span>{moment.unix(sentAt).fromNow()}</span>
              </span>
            </span>
            <span className="font-light mt-1 text-sm text-gray-200 tracking-wide">
              <div className="flex leading-5 whitespace-pre-line w-[300px] break-words">
                {(isRemoteAttachmentType(contentType as ContentType) ||
                  isRelayedRemoteAttachmentType({
                    contentType: contentType,
                    data: (content as FileMeta).data,
                    type: (content as FileMeta).type,
                  })) && (
                  <>
                    {(content as File).type.startsWith("image") && (
                      <MessageImage
                        data={(content as FileMeta).data}
                        type={(content as FileMeta).type}
                        key={msgId}
                      />
                    )}

                    {(content as File).type.startsWith("video") && (
                      <MessageVideo
                        key={msgId}
                        data={(content as FileMeta).data}
                        type={(content as FileMeta).type}
                      />
                    )}

                    {(content as File).type.startsWith("application") && (
                      <MessageFile
                        key={msgId}
                        data={(content as FileMeta).data}
                        type={(content as FileMeta).type}
                        filename={(content as FileMeta).filename}
                      />
                    )}
                  </>
                )}

                {isTextType(contentType) && <>{content}</>}
              </div>
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
                <span>{moment.unix(sentAt).fromNow()}</span>
              </span>
              <span className="select-none flex gap-1">
                <span
                  className={cn(
                    `px-[5px] text-[10px] rounded-xl rounded-tr-none rounded-br-md`
                  )}
                  style={{ background: getBgColor(from) }}
                >
                  You
                </span>
              </span>
            </span>
            <div className="relative mt-1 font-light text-sm text-gray-200 tracking-wide">
              <div className="flex leading-5 whitespace-pre-line w-[300px] break-words">
                {(isRemoteAttachmentType(contentType as ContentType) ||
                  isRelayedRemoteAttachmentType({
                    contentType: contentType,
                    data: (content as FileMeta).data,
                    type: (content as FileMeta).type,
                  })) && (
                  <>
                    {(content as File).type.startsWith("image") && (
                      <MessageImage
                        data={(content as FileMeta).data}
                        type={(content as FileMeta).type}
                        key={msgId}
                      />
                    )}

                    {(content as File).type.startsWith("video") && (
                      <MessageVideo
                        key={msgId}
                        data={(content as FileMeta).data}
                        type={(content as FileMeta).type}
                      />
                    )}

                    {(content as File).type.startsWith("application") && (
                      <MessageFile
                        key={msgId}
                        data={(content as FileMeta).data}
                        type={(content as FileMeta).type}
                        filename={(content as FileMeta).filename}
                      />
                    )}
                  </>
                )}

                {isTextType(contentType) && <>{content}</>}
              </div>
            </div>
            <MessageSendStatus
              readers={readers}
              status={status}
              swap={swap}
              onResend={() => {
                if (onResend) onResend(id, content);
              }}
            />
          </div>
          <UserHoverCard user={user?.data as User}>
            <EmojiAvatar size={AvatarSize.Small} randomStr={from} />
          </UserHoverCard>
        </div>
      )}
    </>
  );
}
