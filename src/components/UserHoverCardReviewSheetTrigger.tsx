import { Client } from "@xmtp/xmtp-js";
import { useEffect, useRef, useState } from "react";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import {
  ContentTypeSwapRating,
  SwapRatingPayload,
  verifyReview,
} from "../hooks/messenger/codecs/SwapRatingCodec.ts";
import useMessenger from "../hooks/messenger/useMessenger.ts";
import useStore from "../hooks/store/useStore.ts";
import useForceUpdate from "../hooks/useForceUpdate.ts";
import { isEqlStr } from "../libs/helpers.ts";
import { ToolTip } from "./ToolTip.tsx";
import IconReview from "./icons/IconReview.tsx";
import { Button } from "./ui/Button.tsx";

export function UserHoverCardReviewSheetTrigger({ user }: { user: User }) {
  const client = useRef<Client | undefined>();
  const forceUpdate = useForceUpdate();
  const { wallet, address, chain } = useConnectorContext();
  const [loading, setLoading] = useState(false);
  const toggleOpenState = useStore((state) => state.toggleOpenState);
  const { loadKeys, initClient, readMailbox, getEnv } = useMessenger();
  const [count, setCount] = useState({ ok: 0, notOk: 0 });

  // Auto-initialize client if keys are present.
  useEffect(() => {
    if (!wallet) return;
    const hasKey = !!loadKeys(getEnv(), address);
    if (!hasKey) return;
    initClient(getEnv(), wallet).then((cl) => {
      client.current = cl;
      forceUpdate.forceUpdate();
    });
  }, [wallet, open]);

  // Count reviews.
  useEffect(() => {
    const countReviews = async () => {
      if (!client.current) return;

      let ok = 0;
      let notOk = 0;

      setLoading(true);
      await readMailbox(chain, user.address, {
        type: ContentTypeSwapRating,
        reverse: true,
        cb: async (msg) => {
          const content = msg.content as SwapRatingPayload;
          if (!client.current) return true;
          if (!isEqlStr(content.rated, user.address)) return false;

          // Verify review
          const valid = await verifyReview(client.current, content);
          if (!valid) return false;

          ok += content.isOk ? 1 : 0;
          notOk += !content.isOk ? 1 : 0;
          return false;
        },
      });

      setCount({ ok, notOk });
      setLoading(false);
    };

    void countReviews();
  }, [forceUpdate.forceValue]);

  return (
    <ToolTip tip="Rating & Reviews">
      <Button
        variant="link"
        className="flex h-auto items-center gap-1 font-medium hover:bg-chinese-green hover:text-gray-800 px-1 rounded transition-all duration-300 py-0"
        onClick={() => {
          toggleOpenState("reviewSheet", undefined, user.address);
        }}
      >
        <IconReview width="14" className="mt-1" />
        <span>Reviews</span>
        {!loading && (
          <span className="text-sm">({count.ok + count.notOk})</span>
        )}
      </Button>
    </ToolTip>
  );
}
