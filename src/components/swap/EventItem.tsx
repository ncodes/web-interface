import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { shortenAddress } from "../../libs/helpers.ts";

type EventType = "mark-paid";

export function EventItem({
  initiator,
  type,
}: {
  initiator: string;
  type: EventType;
}) {
  return (
    <div className="flex gap-2 tracking-wider items-center px-3 py-3 text-gray-200 font-light text-sm">
      <span className="shrink-0">
        <EmojiAvatar size={AvatarSize.Small} randomStr={initiator} />
      </span>
      <div className="w-full">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            {type === "mark-paid" && (
              <div>
                <span className="text-white font-normal">
                  {shortenAddress(initiator)}
                </span>{" "}
                has marked the swap as paid
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400">2 days ago</span>
        </div>
      </div>
    </div>
  );
}
