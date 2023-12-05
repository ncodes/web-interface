import { ThumbsDown, ThumbsUp } from "lucide-react";
import EmojiAvatar from "./avatar/EmojiAvatar.tsx";
import { AvatarSize } from "./avatar/useAvatar.tsx";

export function ReviewViewerSheetItem({
  address,
  msg,
  isHappy,
}: {
  address: string;
  msg: string;
  isHappy?: boolean;
}) {
  return (
    <div className="px-5 flex items-center gap-2 border-gray-800 py-2">
      <EmojiAvatar size={AvatarSize.Small} randomStr={address} />
      <div className="flex-1 text-sm text-white font-light p-1 px-3 rounded-xl rounded-tl-none">
        {msg || <span className="text-gray-500">[No comment]</span>}
      </div>
      <div className="shrink-0">
        {isHappy && <ThumbsUp width="20px" className="text-green-400" />}
        {!isHappy && <ThumbsDown width="20px" className="text-red-400" />}
      </div>
    </div>
  );
}
