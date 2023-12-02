import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { usePaymentService } from "../../hooks/services/backend/usePaymentService.ts";
import useBadgeMgrContract from "../../hooks/services/contracts/useBadgeMgrContract.ts";
import { useToast } from "../../hooks/useToast.tsx";
import { delay, deriveLiquidityAddress, isDev } from "../../libs/helpers.ts";
import { InputWrapper } from "../InputWrapper.tsx";
import { ToolTip } from "../ToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";
import { Label } from "../ui/label.tsx";
import { GrantedPaymentMethodRow } from "./GrantedPaymentMethodRow.tsx";
import { PaymentMethodSelector } from "./PaymentMethodSelector.tsx";

export function ManageLiquiditySetPaymentMethods({
  liquidity,
}: {
  liquidity: Liquidity;
}) {
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useToast();
  const [open, setOpen] = useState(false);
  const { getChainInfo, address } = useConnectorContext();
  const [selected, setSelected] = useState<PaymentMethod>();
  const [grantedPaymentMethods, setGrantedPaymentMethods] = useState<
    PaymentMethod[]
  >([]);
  const { getPaymentMethods, getPaymentMethodGrantSignature } =
    usePaymentService();
  const {
    grantNewOrUpsetBadgeMetaBySig,
    hasBadge,
    getGranteeMetaValue,
    humanizeErrors,
  } = useBadgeMgrContract();

  const payMethods = useQuery({
    queryKey: ["getPaymentMethods", { network: getChainInfo().queryName }],
    queryFn: getPaymentMethods,
  });

  const grantSig = useQuery({
    queryKey: [
      "getPaymentMethodGrantSig",
      {
        network: getChainInfo().queryName,
        badge: selected?.badge as string,
        address: liquidity.provider,
        liquidityAddress: deriveLiquidityAddress(liquidity),
      },
    ],
    queryFn: getPaymentMethodGrantSignature,
    enabled: !!selected && selected.badge != undefined,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    cacheTime: 0,
  });

  useEffect(() => {
    (async () => {
      if (!payMethods.data || loading) return;
      const methods = await filterGrantedPaymentMethod(payMethods.data);
      setGrantedPaymentMethods(methods);
    })();
  }, [
    payMethods.data,
    payMethods.isRefetching,
    payMethods.isFetching,
    loading,
  ]);

  function isLoading(): boolean {
    if (loading) return true;
    if (payMethods.isLoading && !payMethods.isFetched) return true;
    if (payMethods.isSuccess && !grantSig.isFetching) return false;
    if (grantSig.isLoading && !grantSig.data) return true;
    if (grantSig.isSuccess) return false;
    if (grantSig.data) return false;
    return false;
  }

  async function doWrite() {
    if (!grantSig.data) return;
    try {
      setLoading(true);
      const txHash = await grantNewOrUpsetBadgeMetaBySig(grantSig.data);
      await delay(5000);
      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Successfully added payment method`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });
      setSelected(undefined);
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function filterGrantedPaymentMethod(
    methods: PaymentMethod[],
  ): Promise<PaymentMethod[]> {
    const enabled: PaymentMethod[] = [];
    for (const method of methods) {
      const badgeParts = method.badge.split("/");
      if (await hasBadge(liquidity.provider, badgeParts[0], badgeParts[1])) {
        if (
          (await getGranteeMetaValue(
            address,
            badgeParts[0],
            badgeParts[1],
            deriveLiquidityAddress(liquidity),
          )) == "1"
        ) {
          enabled.push(method);
        }
      }
    }
    return enabled;
  }

  return (
    <Accordion type="single" defaultValue="payment">
      <AccordionItem value="payment">
        <AccordionTrigger className="text-lg pb-2 tracking-wide mt-2 px-5">
          Payment Method
        </AccordionTrigger>
        <AccordionContent className="tracking-wide px-5 text-gray-200">
          <div className="font-light text-gray-100 text-sm">
            Assign a payment method badge to let takers know your preferred
            payment method.
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <InputWrapper
              focused={open}
              afterInput={
                <div className="mr-1">
                  <Button
                    size="sm"
                    rounded="xl"
                    disabled={isLoading() || !selected}
                    onClick={doWrite}
                  >
                    {isLoading() && (
                      <IconSpinner
                        width="15"
                        className="animate-spin"
                        fill="fill-gray-900"
                      />
                    )}
                    {!isLoading() && "Add"}
                  </Button>
                </div>
              }
            >
              <PaymentMethodSelector
                open={open}
                setOpen={setOpen}
                isLoading={isLoading()}
                selected={selected}
                payMethods={payMethods.data}
                setSelected={setSelected}
                onSelected={(method) => {
                  setSelected(method);
                  setOpen(false);
                  if (payMethods) grantSig.refetch().catch(console.error);
                }}
                filterMethods={(method) => {
                  return !grantedPaymentMethods.find(
                    (enabledMethod) => enabledMethod.badge === method.badge,
                  );
                }}
              />
            </InputWrapper>
          </div>
          {!!grantedPaymentMethods.length && (
            <div className="mt-5 flex flex-col ">
              <Label className="text-xs font-light tracking-wider text-gray-400">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Current Payment Methods
                    <ToolTip tip="Current payment methods added to this liquidity">
                      <IconInfoCircle width="15" />
                    </ToolTip>
                  </span>
                  <span>{grantedPaymentMethods.length}</span>
                </div>
              </Label>
              <div className="mt-3 flex flex-col gap-1">
                {grantedPaymentMethods.map((method) => (
                  <GrantedPaymentMethodRow
                    key={method.badge + method.name}
                    method={method}
                    liquidity={liquidity}
                  />
                ))}
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
