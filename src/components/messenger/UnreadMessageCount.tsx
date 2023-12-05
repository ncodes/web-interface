import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext";
import { useNotificationService } from "../../hooks/services/backend/useNotificationService";
import useStore from "../../hooks/store/useStore";
import useWindowFocus from "../../hooks/useWindowFocus";

export function UnreadMessageCount({
  orderId,
  offerId,
  disableUnmark,
  type,
}: {
  orderId?: number;
  offerId?: number;
  disableUnmark?: boolean;
  type?: string;
}) {
  const { address, getChainInfo } = useConnectorContext();
  const user = useStore((state) => state.user);
  const { countNotifications, markNotificationsAsRead } =
    useNotificationService();
  const isWindowFocus = useWindowFocus();

  const countQuery = useQuery({
    queryKey: [
      "countNotifications",
      {
        net: getChainInfo().queryName,
        offerId,
        read: false,
        orderId,
        type,
      },
    ],
    queryFn: countNotifications,
    enabled: !!address && !!user,
    refetchInterval: 10000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationsAsRead,
  });

  useEffect(() => {
    const { isSuccess, data } = countQuery;
    if (!disableUnmark && isWindowFocus && isSuccess && data > 0) {
      setTimeout(() => {
        markAsReadMutation.mutate({
          net: getChainInfo().queryName,
          offerId,
          orderId,
          type,
        });
      }, 3000);
    }
  }, [isWindowFocus, countQuery.data]);

  return (
    <>
      {countQuery.isSuccess && countQuery.data > 0 && (
        <span className="rounded-full h-[20px] min-w-[20px] px-[5px] leading-[20px] flex justify-center items-center  bg-red-600 text-[10px]">
          {countQuery.data}
        </span>
      )}
    </>
  );
}
