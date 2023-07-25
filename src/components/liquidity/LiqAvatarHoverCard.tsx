import { ReactNode, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card.tsx";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import { IconFlagVerified } from "../icons/IconVerifiedBadge.tsx";
import { StatCard } from "../market/StatCard.tsx";
import ScrollGradientIndicator from "../ScrollGradientIndicator.tsx";
import IconCopyFilled from "../icons/IconCopyFilled.tsx";
import { Button } from "../ui/Button.tsx";

export function LiqAvatarHoverCard({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="z-10">
      <HoverCard
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <HoverCardTrigger
          onClick={() => {
            setOpen(true);
          }}
        >
          {children}
        </HoverCardTrigger>
        <HoverCardContent className="rounded-2xl overflow-hidden bg-modal-background border-gray-600 text-gray-200 p-0">
          <div className="p-3 py-2 text-sm flex items-center gap-2 border-b border-gray-700">
            <EmojiAvatar size={AvatarSize.Small} randomStr="abcen" />
            <div>
              <div className="flex items-center gap-1">
                <span>0xAbc123</span>
                <span>
                  <IconCopyFilled
                    width="13px"
                    className="text-gray-400 cursor-pointer hover:text-chinese-green transition-all duration-300 active:scale-90"
                  />
                </span>
              </div>
              <div className="flex gap-1 font-light text-xs text-gray-400">
                <IconFlagVerified width="15px" />
                Merchant
              </div>
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
          <ScrollGradientIndicator side="bottom">
            <div className="p-2 flex flex-col gap-2 h-[200px] overflow-auto scrollbar-hide">
              <StatCard
                title="Total Swaps"
                tip={`The total number of swaps completed across all liquidities`}
                width="w-full"
              >
                <span className="text-gray-200">1,200</span>
              </StatCard>
              <StatCard
                title="Volume"
                tip={`The total volume of swaps across all liquidities`}
                width="w-full"
              >
                <span className="text-gray-200">$140,000</span>
              </StatCard>
              <StatCard
                title="Completion Rate"
                tip={`The percentage of non-disputed swaps across all liquidities`}
                width="w-full"
              >
                <span className="text-gray-200">89%</span>
              </StatCard>
            </div>
          </ScrollGradientIndicator>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
