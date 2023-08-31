import { ThumbsDown, ThumbsUp } from "lucide-react";

export function ReviewItem({
  initiator,
  good,
  msg,
}: {
  initiator: string;
  good?: boolean;
  msg?: string;
}) {
  return (
    <div className="flex items-center gap-2 tracking-wider px-3 py-3 text-gray-200 font-light text-sm">
      <span className="shrink-0">
        {!good && (
          <span className="bg-red-600 block rounded-full p-[5px]">
            <ThumbsDown size={20} className="text-red-200" />
          </span>
        )}
        {good && (
          <span className="bg-green-600 block rounded-full p-[5px]">
            <ThumbsUp size={20} className="text-green-200" />
          </span>
        )}
      </span>
      <div className="w-full">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            <div className="flex flex-col w-full">
              <div className="flex gap-2 items-center">
                <span className="text-gray-500 text-xs font-medium">
                  {/*<UserHoverCard>@{shortenAddress(initiator)}:</UserHoverCard>*/}
                </span>
                <span>
                  <span className="text-xs text-gray-400">2 days ago</span>
                </span>
              </div>
              <span>{msg}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
