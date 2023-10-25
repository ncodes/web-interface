import { Cross2Icon } from "@radix-ui/react-icons";
import { Client } from "@xmtp/xmtp-js";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import {
  ContentTypeSwapRating,
  SwapRatingPayload,
  verifyReview,
} from "../hooks/messenger/codecs/SwapRatingCodec.ts";
import useMessenger from "../hooks/messenger/useMessenger.ts";
import useCoreContract from "../hooks/services/contracts/useCoreContract.ts";
import useStore from "../hooks/store/useStore.ts";
import useForceUpdate from "../hooks/useForceUpdate.ts";
import { useSheetInfo } from "../hooks/useSheetInfo.ts";
import { isSwapCounterparty } from "../libs/api_utils.ts";
import { isDev, isEqlStr, shortenAddress } from "../libs/helpers.ts";
import { cn } from "../libs/utils.ts";
import { ReviewViewerSheetItem } from "./ReviewViewerSheetItem.tsx";
import ScrollOverflowIndicator from "./ScrollOverflowIndicator.tsx";
import { ToolTip } from "./ToolTip.tsx";
import IconSpinner from "./icons/IconSpinner.tsx";
import { IconStarSmile } from "./icons/IconStarSmile.tsx";
import { Button } from "./ui/Button.tsx";
import { Label } from "./ui/label.tsx";
import { ScrollArea } from "./ui/scroll-area.tsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet.tsx";

export function ReviewViewerSheet() {
  const [, sheetSide, styles] = useSheetInfo();
  const client = useRef<Client | undefined>();
  const [loading, setLoading] = useState(false);
  const env = isDev() ? "dev" : "production";
  const { getOrder } = useCoreContract();
  const forceUpdate = useForceUpdate();
  const openState = useStore((state) => state.openState);
  const toggleOpenState = useStore((state) => state.toggleOpenState);
  const { wallet, address, chain } = useConnectorContext();
  const { loadKeys, initClient, readMailbox } = useMessenger();
  const openStateContext = useStore((state) => state.openStateContext);
  const targetAddress = openStateContext.reviewSheet as string;
  const [initializing, setInitializing] = useState(false);
  const [reviews, setReviews] = useState<SwapRatingPayload[]>([]);
  const [count, setCount] = useState({ ok: 0, notOk: 0 });

  // Auto-initialize client if keys are present.
  useEffect(() => {
    if (!wallet) return;
    const hasKey = !!loadKeys(env, address);
    if (!hasKey) {
      setLoading(false);
      return;
    }
    initClient(env, wallet).then((cl) => {
      client.current = cl;
      forceUpdate.forceUpdate();
    });
  }, [wallet, open]);

  // Read reviews for the target address.
  useEffect(() => {
    const getReviews = async () => {
      if (!client.current) return;
      if (!targetAddress) return;

      setLoading(true);
      const reviews: SwapRatingPayload[] = [];
      let ok = 0;
      let notOk = 0;

      await readMailbox(chain, targetAddress, {
        type: ContentTypeSwapRating,
        reverse: true,
        cb: async (msg) => {
          const content = msg.content as SwapRatingPayload;
          if (!client.current) return true;
          if (!isEqlStr(content.rated, targetAddress)) return false;

          // Make sure rater is a counterparty of the order
          const order = await getOrder(BigInt(content.orderId));
          if (!order) return false;
          if (!isSwapCounterparty(order, content.rater)) return false;

          // Verify review
          const valid = await verifyReview(client.current, content);
          if (!valid) return false;

          reviews.push(content);
          ok += content.isOk ? 1 : 0;
          notOk += !content.isOk ? 1 : 0;
          return false;
        },
      });

      setCount({ ok, notOk });
      setReviews(reviews);
      setLoading(false);
    };

    void getReviews();
  }, [forceUpdate.forceValue, targetAddress]);

  // Initialize the client for messaging.
  async function initialize() {
    try {
      setInitializing(true);
      client.current = await initClient(env, wallet);
      forceUpdate.forceUpdate();
    } catch (error) {
      console.error("Failed to initialize wallet", error);
    } finally {
      setInitializing(false);
    }
  }

  if (!targetAddress) return null;

  return (
    <Sheet
      open={openState.reviewSheet}
      onOpenChange={() => {
        toggleOpenState && toggleOpenState("reviewSheet");
      }}
    >
      <SheetContent
        className={cn(
          styles,
          "w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0 h-[90vh] md:h-[100vh]"
        )}
        side={sheetSide}
      >
        {client.current && !loading && reviews.length > 0 && (
          <>
            <SheetHeader className="flex pr-[50px] border-b border-gray-800">
              <div className="text-white">
                <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
                  Reviews for {shortenAddress(targetAddress)}
                </SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex flex-col text-white h-full select-none">
              <div className="flex justify-between py-4 px-5 border-b border-gray-800">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 text-green-400">
                    <ThumbsUp width="20px" />
                    <span className="ml-1">{count.ok}</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-400">
                    <ThumbsDown width="20px" />
                    <span className="ml-1">{count.notOk}</span>
                  </div>
                </div>
                <ToolTip tip="Happy Rate: Indicates the percentage of people who are happy with this account.">
                  <div className="flex items-center gap-1 text-gray-100 cursor-pointer">
                    <span>
                      <IconStarSmile width="20px" />
                    </span>
                    <span>
                      {(count.ok / (count.ok + count.notOk)) * 100 || 0}%
                    </span>
                  </div>
                </ToolTip>
              </div>
              <div className="relative overflow-hidden xl:pb-10 h-full">
                <ScrollOverflowIndicator side="bottom" className="h-full">
                  <ScrollArea type="scroll" className="w-full h-full">
                    <div className="flex flex-col gap-3 h-full divide-y">
                      {reviews.map((review) => (
                        <ReviewViewerSheetItem
                          key={`${review.orderId}-${review.rater}`}
                          address={review.rater}
                          msg={review.comment}
                          isHappy={review.isOk}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </ScrollOverflowIndicator>
              </div>
            </div>
          </>
        )}

        {!client.current && (
          <div className="p-3 h-screen flex justify-center items-center">
            <div className="text-center w-9/12 mx-auto flex flex-col justify-center items-center">
              <Label className="text-white tracking-wider px-3 pt-2 text-sm">
                Initialize Chat
              </Label>
              <div className="text-gray-300 text-[13px] px-3 py-3 font-light tracking-wide">
                Review relies on the chat system. You need to initialize your
                wallet for chat before you can see user reviews.
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

        {!loading && reviews.length == 0 && (
          <div className="p-3 h-screen flex justify-center items-center">
            <div className="flex gap-2 items-center text-gray-400 font-light">
              <span>No reviews found</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="p-3 h-screen flex justify-center items-center">
            <div className="text-center w-9/12 mx-auto flex flex-col justify-center items-center">
              <IconSpinner
                width="20"
                className="animate-spin"
                fill="fill-gray-400"
              />
            </div>
          </div>
        )}

        <div
          className="absolute cursor-pointer text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            toggleOpenState && toggleOpenState("reviewSheet");
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
