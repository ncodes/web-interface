import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Client } from "@xmtp/xmtp-js";
import { useEffect, useRef, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import {
  ContentTypeSwapRating,
  SwapRatingPayload,
  verifyReview,
} from "../../hooks/messenger/codecs/SwapRatingCodec.ts";
import useMessenger from "../../hooks/messenger/useMessenger.ts";
import useCoreContract from "../../hooks/services/contracts/useCoreContract.ts";
import useStore from "../../hooks/store/useStore.ts";
import useForceUpdate from "../../hooks/useForceUpdate.ts";
import { isSwapCounterparty } from "../../libs/api_utils.ts";
import { cn, isEqlStr } from "../../libs/helpers.ts";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ToolTip } from "../ToolTip.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";
import { Label } from "../ui/label.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { ActivityLogSkeleton } from "./LiquidityEventLog.tsx";
import { ReviewItem } from "./ReviewItem.tsx";

export function LiquidityProviderReviewViewer({
  liquidity,
}: {
  liquidity: Liquidity;
}) {
  const toggleOpenState = useStore((state) => state.toggleOpenState);
  const client = useRef<Client | undefined>();
  const [loading, setLoading] = useState(false);
  const { getOrder } = useCoreContract();
  const forceUpdate = useForceUpdate();
  const { wallet, address, chain } = useConnectorContext();
  const { loadKeys, initClient, readMailbox, getEnv } = useMessenger();
  const [initializing, setInitializing] = useState(false);
  const [reviews, setReviews] = useState<SwapRatingPayload[]>([]);

  // Auto-initialize client if keys are present.
  useEffect(() => {
    if (!wallet) return;
    const hasKey = !!loadKeys(getEnv(), address);
    if (!hasKey) {
      setLoading(false);
      return;
    }
    initClient(getEnv(), wallet).then((cl) => {
      client.current = cl;
      forceUpdate.forceUpdate();
    });
  }, [wallet, open]);

  // Read reviews for the target address.
  useEffect(() => {
    const getReviews = async () => {
      if (!client.current) return;

      setLoading(true);
      const reviews: SwapRatingPayload[] = [];

      await readMailbox(chain, liquidity.provider, {
        type: ContentTypeSwapRating,
        reverse: true,
        limit: 25,
        cb: async (msg) => {
          const content = msg.content as SwapRatingPayload;
          if (!client.current) return true;
          if (!isEqlStr(content.rated, liquidity.provider)) return false;

          // Make sure rater is a counterparty of the order
          const order = await getOrder(BigInt(content.orderId));
          if (!order) return false;
          if (!isSwapCounterparty(order, content.rater)) return false;

          // Verify signature
          const valid = await verifyReview(client.current, content);
          if (!valid) return false;

          reviews.push(content);
          return false;
        },
      });

      setReviews(reviews);
      setLoading(false);
    };

    void getReviews();
  }, [forceUpdate.forceValue]);

  // Initialize the client for messaging.
  async function initialize() {
    try {
      setInitializing(true);
      client.current = await initClient(getEnv(), wallet);
      forceUpdate.forceUpdate();
    } catch (error) {
      console.error("Failed to initialize wallet", error);
    } finally {
      setInitializing(false);
    }
  }

  return (
    <div className="lg:pl-5 flex-1 flex flex-col">
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
              toggleOpenState &&
                toggleOpenState("reviewSheet", undefined, liquidity.provider);
            }}
          >
            View All
          </Button>
        </div>
      </span>

      <div
        className={cn(
          "relative flex-1 bg-card-background  border rounded-2xl mt-4 border-card-border w-full",
          {
            "flex justify-center items-center":
              client.current && !loading && reviews.length == 0,
          },
        )}
      >
        {client.current && !loading && reviews.length > 0 && (
          <ScrollOverflowIndicator side="bottom">
            <ScrollArea type="scroll" className="h-[300px] lg:h-[400px]">
              <div className="divide-y divide-gray-800">
                {reviews.map((review) => (
                  <ReviewItem
                    key={`${review.orderId}-${review.rater}`}
                    good={review.isOk}
                    initiator={review.rater}
                    msg={review.comment || "[No comment]"}
                    createdAt={review.createdAt}
                  />
                ))}
              </div>
            </ScrollArea>
          </ScrollOverflowIndicator>
        )}

        {!client.current && (
          <div className="h-full flex justify-center items-center py-5 lg:py-0">
            <div className="text-center w-9/12 mx-auto flex flex-col justify-center items-center">
              <Label className="text-white tracking-wider px-3 pt-2 text-sm">
                Initialize Chat
              </Label>
              <div className="text-gray-300 text-[13px] px-3 py-3 font-light tracking-wide">
                Review feature relies on the chat system. You need to initialize
                your wallet for chat before you can view reviews for this
                liquidity.
              </div>
              <Button
                variant="outline"
                className="w-[200px] tracking-wider text-gray-200"
                disabled={initializing}
                onClick={() => {
                  initialize();
                }}
              >
                {!initializing && <>Initialize</>}
                {initializing && (
                  <>
                    <IconSpinner
                      width="20"
                      className="animate-spin"
                      fill="fill-gray-100"
                    />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {client.current && !loading && reviews.length == 0 && (
          <div className="h-[100px] xl:h-[400px] w-full flex items-center gap-2 text-gray-400 justify-center font-light">
            No reviews found
          </div>
        )}

        {loading && (
          <div className="h-[100px] xl:h-[400px]">
            <ActivityLogSkeleton />
            <span className="hidden lg:block">
              <ActivityLogSkeleton />
              <ActivityLogSkeleton />
              <ActivityLogSkeleton />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
