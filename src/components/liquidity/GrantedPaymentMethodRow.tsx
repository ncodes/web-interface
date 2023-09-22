import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/toast/toast.tsx";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import { usePaymentService } from "../../hooks/services/backend/usePaymentService.ts";
import useBadgeMgrContract from "../../hooks/services/contracts/useBadgeMgrContract.ts";
import { deriveLiquidityAddress, isDev } from "../../libs/helpers.ts";
import { Avatar } from "../avatar/Avatar.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";

export function GrantedPaymentMethodRow({
  method,
  liquidity,
}: {
  liquidity: Liquidity;
  method: PaymentMethod;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useToast();
  const { getChainInfo } = useConnectorContext();
  const { getPaymentMethodGrantSignature } = usePaymentService();
  const { grantNewOrUpsetBadgeMetaBySig, humanizeErrors } =
    useBadgeMgrContract();

  const grantSig = useQuery({
    queryKey: [
      "getPaymentMethodGrantSig",
      {
        network: getChainInfo().queryName,
        badge: method.badge,
        address: liquidity.provider,
        liquidityAddress: deriveLiquidityAddress(liquidity),
        disable: true,
      },
    ],
    queryFn: getPaymentMethodGrantSignature,
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchOnReconnect: false,
    cacheTime: 0,
  });

  useEffect(() => {
    (async () => {
      await doRemove();
    })();
  }, [grantSig.data]);

  async function doRemove() {
    if (!grantSig.data) return;
    try {
      setLoading(true);
      const txHash = await grantNewOrUpsetBadgeMetaBySig(grantSig.data);
      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Successfully removed payment method`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });
      await queryClient.refetchQueries(["getPaymentMethods"]);
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function isLoading() {
    return (
      loading || (grantSig.isLoading && grantSig.data) || grantSig.isFetching
    );
  }

  return (
    <div className="flex items-center justify-between h-7">
      <span className="flex items-center gap-2">
        <span className="w-[25px]">
          <Avatar
            className="w-[25px] h-[25px] rounded"
            src={method.logoUrl}
            fallbackClassName="w-[25px] h-[25px] rounded bg-card-background"
            fallback={<IconSpinner className="animate-spin" width="15" />}
          />
        </span>
        <span className="text-xs font-medium tracking-wider">
          {method.name}
        </span>
      </span>
      <span>
        <Button
          variant="link"
          size="sm"
          className="font-normal text-xs"
          disabled={isLoading()}
          onClick={() => {
            grantSig.refetch().catch(console.error);
          }}
        >
          {isLoading() && (
            <IconSpinner
              width="15"
              className="animate-spin"
              fill="fill-gray-100"
            />
          )}
          {!loading && grantSig.fetchStatus == "idle" && "Remove"}
        </Button>
      </span>
    </div>
  );
}
