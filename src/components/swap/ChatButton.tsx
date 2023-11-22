import { MessageSquare } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import useStore from "../../hooks/store/useStore.ts";
import {
  isOfferCounterparty,
  isSwapParticipant,
} from "../../libs/api_utils.ts";
import { cn } from "../../libs/helpers.ts";
import { NotificationType } from "../../types/enums.ts";
import { UnreadMessageCount } from "../messenger/UnreadMessageCount.tsx";
import { Button } from "../ui/Button.tsx";

export function ChatButton({
  address,
  swap,
  offer,
  disableUnmark,
  hideLabel,
  className,
}: {
  address: string;
  swap?: Swap;
  offer?: Offer;
  disableUnmark?: boolean;
  hideLabel?: boolean;
  className?: string;
}) {
  const isXl = useMediaQuery("(min-width: 1280px)");
  const toggleOpenState = useStore((state) => state.toggleOpenState);
  return (
    <div>
      {address &&
      ((swap && isSwapParticipant(swap, address)) ||
        (offer && isOfferCounterparty(offer, address))) ? (
        <Button
          variant="ghost"
          className={cn(
            "flex font-semibold items-center gap-1 text-gray-300",
            className,
          )}
          onClick={() => {
            if (isXl) return;
            toggleOpenState && toggleOpenState("messengerSheet");
          }}
        >
          <MessageSquare width="20px" /> {!hideLabel && "Chat"}
          {(swap?.orderId || !!offer?.offerId) && (
            <UnreadMessageCount
              orderId={swap?.orderId}
              offerId={offer?.offerId}
              type={NotificationType.TypeChatNotification}
              disableUnmark={disableUnmark}
            />
          )}
        </Button>
      ) : (
        <>&nbsp;</>
      )}
    </div>
  );
}
