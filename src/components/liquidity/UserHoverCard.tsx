import { ReactNode, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card.tsx";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { StatCard } from "../market/StatCard.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import IconCopyFilled from "../icons/IconCopyFilled.tsx";
import { Button } from "../ui/Button.tsx";
import { VerifiedBadge } from "./VerifiedBadge.tsx";
import { cn } from "../../libs/utils.ts";
import { HoverCardPortal } from "@radix-ui/react-hover-card";
import {
  approxNumber,
  formatToMoney,
  isMerchant,
  shortenAddress,
} from "../../libs/helpers.ts";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";

export function UserHoverCard({
  children,
  className,
  user,
}: {
  children?: ReactNode;
  className?: string;
  user: User;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn(className)}>
      <HoverCard
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <HoverCardTrigger
          className="cursor-pointer"
          onClick={() => {
            setOpen(true);
          }}
        >
          <span className="z-[5]">{children}</span>
        </HoverCardTrigger>
        <HoverCardPortal>
          <HoverCardContent className="rounded-2xl bg-modal-background border-gray-600 text-gray-200 p-0">
            <div className="p-3 py-2 text-sm flex items-center gap-2 border-b border-gray-700">
              <EmojiAvatar size={AvatarSize.Small} randomStr="abcen" />
              <div>
                <div className="flex items-center gap-1">
                  <span>{shortenAddress(user?.address)}</span>
                  <span>
                    <CopyToClipboard text={user?.address}>
                      <IconCopyFilled
                        width="13px"
                        className="text-gray-400 cursor-pointer hover:text-chinese-green transition-all duration-300 active:scale-90"
                      />
                    </CopyToClipboard>
                  </span>
                </div>
                {isMerchant(user?.badges || []) && (
                  <div className="flex gap-1 font-light text-xs text-gray-400">
                    <VerifiedBadge />
                    Merchant
                  </div>
                )}
              </div>
              <div className="flex-1 flex justify-end">
                <Button variant="default" size="sm">
                  Follow
                </Button>
              </div>
            </div>
            <div className="border-b border-gray-700">
              <div className="p-1 px-3 flex justify-between text-gray-400 text-sm [&>div>span]:text-chinese-green">
                <div>
                  Following <span>100</span>
                </div>
                <div>
                  Followers <span>1250</span>
                </div>
              </div>
            </div>
            <ScrollGradientIndicator
              side="bottom"
              className="overflow-hidden rounded-b-xl"
            >
              <div className="p-2 flex flex-col gap-2 h-[200px] overflow-auto scrollbar-hide">
                <StatCard
                  title="Total Swaps"
                  tip={`The total number of swaps completed across all liquidities`}
                  width="w-full"
                  noSwapTrigger
                >
                  <span className="text-gray-200">
                    {formatToMoney(user?.totalSwaps)}
                  </span>
                </StatCard>
                <StatCard
                  title="Completion Rate"
                  tip={`The percentage of non-disputed swaps across all liquidities`}
                  width="w-full"
                  noSwapTrigger
                >
                  <span className="text-gray-200">{user?.completionRate}%</span>
                </StatCard>
                <StatCard
                  title="Volume"
                  tip={`The total volume of swaps across all liquidities`}
                  width="w-full"
                  noSwapTrigger
                >
                  <span className="text-gray-200">
                    ${user?.volumeUsd ? approxNumber(user?.volumeUsd, 3) : ""}
                  </span>
                </StatCard>
                <StatCard
                  title="Last Active"
                  tip={`The last time the user participated in a swap`}
                  width="w-full"
                  noSwapTrigger
                >
                  <span className="text-gray-200">
                    {moment(user?.lastActiveAt).fromNow()}
                  </span>
                </StatCard>
              </div>
            </ScrollGradientIndicator>
          </HoverCardContent>
        </HoverCardPortal>
      </HoverCard>
    </div>
  );
}
