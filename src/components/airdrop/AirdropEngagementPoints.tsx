import { AlertTriangle } from "lucide-react";
import useStore from "../../hooks/store/useStore.ts";
import { Button } from "../ui/Button.tsx";

export function AirdropEngagementPoints() {
  const user = useStore((store) => store.user);

  return (
    <div className=" border rounded-xl border-gray-800 min-h-[100px]">
      <div className="flex flex rounded-b-2xl  justify-between tracking-wider p-2 gap-3 px-4 border-b border-gray-800">
        <div className="flex items-center gap-2 font-bold text-xl font-jersey25 tracking-wider">
          <img src="/images/airdrop-icons/megaphone.svg" className="w-5" />
          <span>Engagement Points</span>
        </div>
      </div>

      <p className="p-5 font-extralight text-md text-gray-300">
        Earn points when you create X posts mentioning <b>@OxJoint</b> or{" "}
        <b>$JOIN</b>. The more people engaging with your post, the more points
        you earn. Also, engaging with similar posts to earn you more points.{" "}
      </p>

      <div className="px-5 mb-3">
        {user?.twitterUsername ? (
          <>
            <a href="https://twitter.com/intent/tweet?text=%400xJoint%20$JOIN">
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
