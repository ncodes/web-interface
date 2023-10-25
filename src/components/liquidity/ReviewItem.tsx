import { ThumbsDown, ThumbsUp } from "lucide-react";
import moment from "moment";
import { shortenAddress } from "../../libs/helpers";
import { FetchedUserHoverCard } from "../FetchedUserHoverCard";

export function ReviewItem({
  initiator,
  good,
  msg,
  createdAt,
}: {
  initiator: string;
  good: boolean;
  msg: string;
  createdAt: number;
}) {
  return (
    <div className="flex  gap-2 tracking-wider px-3 py-3 text-gray-200 font-light text-sm">
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
                <span className="text-gray-400 text-xs font-light">
                  <FetchedUserHoverCard
                    address={initiator}
                    className="cursor-pointer"
                  >
                    {shortenAddress(initiator)}
                  </FetchedUserHoverCard>
                </span>
                <span>
                  <span className="text-xs text-gray-400">
                    {moment.unix(createdAt).fromNow(true)}
                  </span>
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
