import { MessageSquare } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import useStore from "../../hooks/store/useStore.ts";
import {
  isOfferCounterparty,
  isSwapParticipant,
} from "../../libs/api_utils.ts";
import { NotificationType } from "../../types/enums.ts";
import { UnreadMessageCount } from "../messenger/UnreadMessageCount.tsx";
import { Button } from "../ui/Button.tsx";

export function ChatButton({
  address,
  swap,
  offer,
  disableUnmark,
  hideLabel,
}: {
  address: string;
  swap?: Swap;
  offer?: Offer;
  disableUnmark?: boolean;
  hideLabel?: boolean;
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
          className="flex font-semibold items-center gap-1 text-gray-300"
          onClick={() => {
            if (isXl) return;
            toggleOpenState && toggleOpenState("messengerSheet");
          }}
        >
          <MessageSquare width="20px" /> {!hideLabel && "Chat"}
          {(swap?.orderId || offer?.offerId) && (
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
