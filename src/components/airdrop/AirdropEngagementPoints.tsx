import { InfoCircledIcon } from "@radix-ui/react-icons";
import { AlertTriangle } from "lucide-react";
import useStore from "../../hooks/store/useStore.ts";
import { ToolTip } from "../ToolTip.tsx";
import { Button } from "../ui/Button.tsx";

export function AirdropEngagementPoints() {
  const user = useStore((store) => store.user);

  return (
    <div className=" border rounded-xl border-gray-800 min-h-[100px]">
      <div className="flex flex rounded-b-2xl  justify-between tracking-wider p-2 gap-3 px-4 border-b border-gray-800">
        <div className="flex items-center gap-2 font-bold">
          <img src="/images/airdrop-icons/megaphone.svg" className="w-5" />
          <span>Engagement Points</span>
          <ToolTip
            tip="Your total points"
            className="text-gray-500 relative -left-1 mt-[2px]"
          >
            <InfoCircledIcon width="20px" />
          </ToolTip>
        </div>
      </div>

      <p className="p-5 font-extralight text-md text-gray-300">
        Earn points when you create X posts mentioning <b>@OxJoint</b> or{" "}
        <b>$P2P</b>. The more people engaging with your post, the more points
        you earn. Also, engaging with similar posts to earn you more points.{" "}
      </p>

      <div className="px-5 mb-3">
        {user?.twitterUsername ? (
          <>
            <a href="https://twitter.com/intent/tweet?text=@0xJoint&hashtags=P2P">
              <Button
                size="full"
                className="hover:scale-105 transition-all duration-500"
              >
                Create Post
              </Button>
            </a>
            {/* <div className="my-2">
              <AirdropQuestVerificationRequest
                quest={{ type: "tweet", engageBond: 100, id: "" } as any}
              >
                <Button
                  size="full"
                  variant="outline"
                  className="hover:scale-105 hover:bg-transparent hover:text-gray-100 hover:border-gray-300 transition-all duration-500"
                >
                  I've posted. Verify Me
                </Button>
              </AirdropQuestVerificationRequest>
            </div> */}
          </>
        ) : (
          <div className="flex gap-2 items-center justify-center font-light text-gray-500">
            <AlertTriangle size="15" />
            <span>X account not connected</span>
          </div>
        )}
      </div>
    </div>
  );
}
