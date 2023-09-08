import useStore from "../../hooks/store/useStore.ts";
import { ToolTip } from "../ToolTip.tsx";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/Button.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { ReviewItem } from "./ReviewItem.tsx";

export function RecentReviews() {
  const { toggleOpenState } = useStore((state) => ({
    toggleOpenState: state.toggleOpenState,
  }));

  return (
    <div className="lg:px-5 flex-1 flex flex-col">
      <span className="px-3 text-xl flex items-center gap-1 justify-between font-medium">
        <div className="flex items-center gap-2">
          <span>Recent Reviews</span>{" "}
          <ToolTip tip="Recent reviews posted by takers of this liquidity">
            <InfoCircledIcon width="20px" className="relative top-[1px]" />
          </ToolTip>
        </div>
        <div>
          <Button
            variant="link"
            size="sm"
            className="px-0"
            onClick={() => {
              toggleOpenState && toggleOpenState("reviewSheet");
            }}
          >
            View All
          </Button>
        </div>
      </span>
      <div className="flex-1 bg-card-background divide-y divide-gray-800 border rounded-2xl mt-4 border-card-border w-full">
        <ScrollOverflowIndicator side="bottom">
          <ScrollArea type="scroll" className="h-[400px]">
            <ReviewItem
              good={true}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="This person is fast and a good communicator"
            />
            <ReviewItem
              good={false}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="I wish i never selected you"
            />
            <ReviewItem
              good={false}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="He held my money for 2 days"
            />
            <ReviewItem
              good={true}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="Best price ever. I will be coming back."
            />
            <ReviewItem
              good={true}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="Patient seller. Could be more quicker though"
            />
            <ReviewItem
              good={false}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="He yelled at me for no reason. I will never come back"
            />
            <ReviewItem
              good={true}
              initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              msg="hi"
            />
          </ScrollArea>
        </ScrollOverflowIndicator>
      </div>
    </div>
  );
}
