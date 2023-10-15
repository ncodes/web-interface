import { Client, PrivateKey, Signature } from "@xmtp/xmtp-js";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext";
import FollowCodec, {
  ContentTypeFollow,
  FollowPayload,
} from "../../hooks/messenger/codecs/FollowCodec";
import useMessenger from "../../hooks/messenger/useMessenger";
import { useToast } from "../../hooks/toast/toast";
import useForceUpdate from "../../hooks/useForceUpdate";
import { isDev } from "../../libs/helpers";
import { cn } from "../../libs/utils";
import IconHeart from "../icons/IconHeart";
import IconSpinner from "../icons/IconSpinner";
import { Button } from "../ui/Button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Skeleton } from "../ui/skeleton";

export function FollowMarket({
  marketAddress,
  onFollowUpdate,
}: {
  marketAddress: string;
  onFollowUpdate?: () => void;
}) {
  const { wallet, address, chain, getChainInfo } = useConnectorContext();
  const env = isDev() ? "dev" : "production";
  const [open, setOpen] = useState(false);
  const { loadKeys, initClient, getMailbox, readMailbox } = useMessenger();
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const client = useRef<Client | undefined>();
  const { notifySuccess, notifyError } = useToast();
  const [following, setFollowing] = useState(false);
  const forceUpdate = useForceUpdate();

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

  // Check if the user is following or has unfollowed the market.
  useEffect(() => {
    const isWatching = async () => {
      if (!client.current) return;
      setLoading(true);

      const { keystore } = client.current;
      const key = (await keystore.getPrivateKeyBundle())
        .identityKey as PrivateKey;

      try {
        let follow = false;
        await readMailbox(chain, address, ContentTypeFollow, async (msg) => {
          const content = msg.content as FollowPayload;
          if (content.type == "market" && content.market == marketAddress) {
            const sigBytes = Buffer.from(content.signature, "hex");
            const sig = Signature.fromBytes(sigBytes);
            delete msg.content.signature;
            const digest = new FollowCodec().encode(msg.content);
            const valid = key.publicKey.verify(sig, digest.content);
            if (!valid) return;
            follow = true;
            if (content.unfollow) follow = false;
            setFollowing(true);
          }
        });
        setFollowing(follow);
        setLoading(false);
      } catch (error) {
        console.error("failed to read mailbox", error);
      }
    };

    isWatching && isWatching();
  }, [wallet, forceUpdate.forceValue]);

  // Ensure that the client is initialized for messaging.
  async function ensureInitialized() {
    const hasKey = !!loadKeys(env, address);
    if (!hasKey) return false;
    if (hasKey && !client.current) {
      await initialize();
      return true;
    }
    return true;
  }

  // Initialize the client for messaging.
  async function initialize() {
    try {
      setInitializing(true);
      client.current = await initClient(env, wallet);
      forceUpdate.forceUpdate();
      setOpen(false);
    } catch (error) {
      console.error("Failed to initialize wallet", error);
    } finally {
      setInitializing(false);
    }
  }

  // Follow the specified market
  async function followMarket() {
    if (!client.current) return;
    setLoading(true);
    const { convo: myMailbox } = await getMailbox(chain, address);

    const payload = {
      type: "market",
      market: marketAddress,
      network: getChainInfo().queryName,
      follower: address,
      createdAt: moment().unix(),
      unfollow: false,
    } as FollowPayload;
    const encoded = new FollowCodec().encode(payload);

    // Sign payload
    const { keystore } = client.current;
    const key = (await keystore.getPrivateKeyBundle())
      .identityKey as PrivateKey;
    const sig = await key.sign(encoded.content);
    payload.signature = Buffer.from(sig.toBytes()).toString("hex");

    try {
      await myMailbox.send(payload, { contentType: ContentTypeFollow });
      setLoading(false);
      setFollowing(true);
      notifySuccess("Added market to watchlist");
      onFollowUpdate?.();
    } catch (error) {
      setLoading(false);
      notifyError("Failed to watch market");
      console.error(error);
    }
  }

  // Unfollow the specified market
  async function unfollowMarket() {
    if (!client.current) return;
    setLoading(true);
    const { convo: myMailbox } = await getMailbox(chain, address);

    const payload = {
      type: "market",
      market: marketAddress,
      network: getChainInfo().queryName,
      follower: address,
      createdAt: moment().unix(),
      unfollow: true,
    } as FollowPayload;
    const encoded = new FollowCodec().encode(payload);

    // Sign payload
    const { keystore } = client.current;
    const key = (await keystore.getPrivateKeyBundle())
      .identityKey as PrivateKey;
    const sig = await key.sign(encoded.content);
    payload.signature = Buffer.from(sig.toBytes()).toString("hex");

    try {
      await myMailbox.send(payload, { contentType: ContentTypeFollow });
      setLoading(false);
      setFollowing(false);
      notifySuccess("Removed market from watchlist");
      onFollowUpdate?.();
    } catch (error) {
      setLoading(false);
      notifyError("Failed to unwatch market");
      console.error(error);
    }
  }

  return (
    <div className="flex h-full">
      <Popover
        modal={true}
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex h-full cursor-pointer border-l border-gray-800 items-center px-2 pb-0 hover:text-chinese-green text-gray-400 transition-all duration-300 hover:scale-110",
              {
                "text-chinese-green": open,
              }
            )}
            onClick={(e) => {
              e.preventDefault();
              if (loading || initializing) return;
              ensureInitialized().then((initialized) => {
                if (!initialized) {
                  setOpen(true);
                } else {
                  if (!following) followMarket();
                  else unfollowMarket();
                }
              });
            }}
          >
            {!loading && (
              <IconHeart className={cn({ "text-chinese-green": following })} />
            )}
            {loading && <Skeleton className="bg-gray-700 w-[20px] h-[20px]" />}
          </div>
        </PopoverTrigger>
        <PopoverContent className="border bg-modal-background border-modal-border rounded-xl p-2">
          <div className="flex flex-col">
            <Label className="text-white tracking-wider px-3 pt-2 text-sm">
              Watch Market
            </Label>
            <div className="text-gray-300 text-[13px] px-3 py-3 font-light tracking-wide">
              Watching relies on the chat feature. You need to initialize your
              wallet for chat before you can watch a market.
            </div>
            <div>
              <div className="p-2 tracking-wide text-xs font-extralight text-gray-400">
                You will be prompted to sign one or two messages. Signing does
                not create a blockchain transaction.
              </div>
              <Button
                variant="outline"
                className="w-full tracking-wider text-gray-200"
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
