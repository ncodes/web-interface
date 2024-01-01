import { Client, PrivateKey } from "@xmtp/xmtp-js";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import SwapRatingCodec, {
  ContentTypeSwapRating,
  SwapRatingPayload,
} from "../../hooks/messenger/codecs/SwapRatingCodec.ts";
import useMessenger from "../../hooks/messenger/useMessenger.ts";
import useForceUpdate from "../../hooks/useForceUpdate.ts";
import { useToast } from "../../hooks/useToast.tsx";
import { getSwapCounterpart } from "../../libs/api_utils.ts";
import { logError, shortenAddress } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import IconSpinner from "../icons/IconSpinner.tsx";
import { IconStarSmile } from "../icons/IconStarSmile.tsx";
import { Button } from "../ui/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog.tsx";
import { Label } from "../ui/label.tsx";
import { Textarea } from "../ui/textarea.tsx";

export function SwapRateCallout({ swap }: { swap: Swap }) {
  const maxChars = 240;
  const [loading, setLoading] = useState(false);
  const [isOkay, setIsOkay] = useState(false);
  const client = useRef<Client | undefined>();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [initializing, setInitializing] = useState(false);
  const { wallet, address, chain, getChainInfo } = useConnectorContext();
  const { loadKeys, initClient, getMailbox, readMailbox, getEnv } =
    useMessenger();
  const forceUpdate = useForceUpdate();
  const { notifyError, notifySuccess } = useToast();
  const [canRender, setCanRender] = useState(false);
  const [isRated, setIsRated] = useState(false);

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

  // Check if the current user has already rated the swap.
  useEffect(() => {
    const isSwapRated = async () => {
      if (!client.current) return;

      const swapCounterpart = getSwapCounterpart(swap, address);
      if (!(await client.current.canMessage(swapCounterpart))) {
        return;
      }

      let rated = false;
      await readMailbox(chain, swapCounterpart, {
        type: ContentTypeSwapRating,
        reverse: true,
        cb: async (msg: { content: SwapRatingPayload }) => {
          if (msg && msg.content.orderId === swap.orderId.toString()) {
            rated = true;
            return true;
          }
          return false;
        },
      });

      setIsRated(rated);
      setCanRender(true);
    };

    void isSwapRated();
  }, [forceUpdate.forceValue, loading]);

  // Initialize the client for messaging.
  async function initialize() {
    try {
      setInitializing(true);
      client.current = await initClient(getEnv(), wallet);
      forceUpdate.forceUpdate();
    } catch (error) {
      logError("Failed to initialize wallet", error);
    } finally {
      setInitializing(false);
    }
  }

  async function doPost(isOkay: boolean) {
    if (!client.current) return;
    setLoading(true);
    setIsOkay(isOkay);

    // Return error message if the counterparty cannot be messaged.
    const swapCounterpart = getSwapCounterpart(swap, address);
    if (!(await client.current.canMessage(swapCounterpart))) {
      notifyError("Failed: Counterparty cannot be messaged");
      return;
    }

    const payload = {
      network: getChainInfo().queryName,
      orderId: swap.orderId.toString(),
      rater: address,
      rated: swapCounterpart,
      isOk: isOkay,
      comment: value,
      createdAt: moment().unix(),
    } as SwapRatingPayload;
    const encoded = new SwapRatingCodec().encode(payload);

    // Sign payload
    const { keystore } = client.current;
    const key = (await keystore.getPrivateKeyBundle())
      .identityKey as PrivateKey;
    const sig = await key.sign(encoded.content);
    payload.signature = Buffer.from(sig.toBytes()).toString("hex");

    try {
      const { convo: mailbox } = await getMailbox(chain, swapCounterpart);
      await mailbox.send(payload, {
        contentType: ContentTypeSwapRating,
      });
      setLoading(false);
      notifySuccess("Thanks for your feedback!");
      setOpen(false);
    } catch (error) {
      setLoading(false);
      notifyError("Failed to post rating");
      logError(error);
    }
  }

  if (!canRender) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger
        onClick={(e) => {
          if (isRated) e.preventDefault();
        }}
        asChild
      >
        <div className="flex flex-col gap-2 px-5 mt-5">
          <div className="flex justify-between items-center">
            <div className="text-sm font-light  text-gray-400">
              Are you satisfied?
            </div>
            <span className="text-gray-600 font-light text-xs">
              No gas required
            </span>
          </div>
          <Button
            variant="outline"
            size="full"
            disabled={isRated}
            className={cn(
              "flex duration-[5000ms] gap-1 text-gray-800 bg-gradient-to-tl from-red-400 to-chinese-green hover:bg-transparent text-sm border border-chinese-green hover:border-gray-100 hover:text-gray-800 rounded-xl font-medium",
              { "animate-pulse": !isRated },
            )}
          >
            <IconStarSmile
              width="20px"
              className={cn("transition-all duration-300")}
            />
            <span>
              {!isRated && <span>Rate </span>}
              {isRated && <span>Rating received</span>}
              {!isRated && (
                <span>{shortenAddress(getSwapCounterpart(swap, address))}</span>
              )}
            </span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[310px] xxs:w-[360px] xs:w-[400px] sm:w-[450px] min-h-[200px] mt-[20%] border-gray-700 bg-card-background p-0">
        <DialogHeader className="space-y-0 ">
          <DialogTitle className="flex p-2 pb-1 px-3 border-b border-gray-800 text-lg gap-2 items-center text-gray-200 font-medium tracking-wide">
            <IconStarSmile className="text-chinese-green" width="18px" />
            <span className="flex items-center gap-1">
              <span>Rate</span>{" "}
              <span>{shortenAddress(getSwapCounterpart(swap, address))}</span>
            </span>
          </DialogTitle>
          {client.current && (
            <DialogDescription className="flex items-center justify-between text-left p-3 px-5 text-gray-400 font-light text-sm">
              <span>How was your experience?</span>
              <span className="text-gray-500 text-xs">
                <span>{maxChars - value.length} chars </span>
                <span className="hidden xxs:inline">left</span>
              </span>
            </DialogDescription>
          )}
        </DialogHeader>

        {client.current && (
          <>
            <div className="px-5">
              <Textarea
                className="text-gray-200 min-h-[80px] max-h-[180px] font-light"
                placeholder="Enter text"
                value={value}
                disabled={loading}
                onChange={(e) => {
                  let v = e.target.value;
                  if (maxChars - v.length <= 0) {
                    v = v.slice(0, maxChars);
                  }
                  setValue(v);
                }}
              />
            </div>
            <DialogFooter className="p-3 py-5 flex-row gap-2 justify-center sm:justify-center sm:space-x-0">
              <Button
                variant="ghost"
                size="full"
                disabled={loading}
                className="px-5 bg-green-400 hover:bg-green-500 hover:text-gray-800 text-gray-800"
                onClick={() => {
                  doPost(true);
                }}
              >
                {(!loading || (loading && !isOkay)) && (
                  <ThumbsUp width="30px" />
                )}
                {loading && isOkay && (
                  <IconSpinner
                    width="20"
                    className="animate-spin"
                    fill="fill-gray-800"
                  />
                )}
              </Button>
              <Button
                size="full"
                disabled={loading}
                variant="ghost"
                className="px-5  bg-red-400 hover:bg-red-500 hover:text-gray-800 text-gray-800"
                onClick={() => {
                  doPost(false);
                }}
              >
                {(!loading || (loading && isOkay)) && (
                  <ThumbsDown width="30px" />
                )}
                {loading && !isOkay && (
                  <IconSpinner
                    width="20"
                    className="animate-spin"
                    fill="fill-gray-800"
                  />
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {!client.current && (
          <div className="p-3 pb-10">
            <div className="text-center w-9/12 mx-auto flex flex-col justify-center items-center">
              <Label className="text-white tracking-wider px-3 pt-2 text-sm">
                Initialize Chat
              </Label>
              <div className="text-gray-300 text-[13px] px-3 py-3 font-light tracking-wide">
                Swap rating relies on the chat system. You need to initialize
                your wallet for chat before you can rate this swap.
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
      </DialogContent>
    </Dialog>
  );
}
