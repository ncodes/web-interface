import { ChainInfo } from "../../../types/global";
import { QueryClient } from "@tanstack/react-query";
import { Location } from "react-router-dom";
import { LoadingOrTriggeredState } from "../../../hooks/store/useStore.ts";
import { ReactNode } from "react";
import { Options } from "../../../hooks/toast/toast.tsx";
import { delay, isDev } from "../../../libs/helpers.ts";

/**
 * Mark an order as "Paid" function
 *
 * @param swap The swap object
 * @param markOrderAsPaid The contract function for market an order as 'paid'
 * @param getChainInfo The function for getting the chain info
 * @param queryClient The query client
 * @param location The react router location object
 * @param loading The current loading state
 * @param triggered The current triggered state
 * @param setLoading The function for setting the loading state
 * @param setTriggered The function for setting the triggered state
 * @param humanizeErrors The function for humanizing errors from the contract
 * @param notifySuccess The function for notifying success
 * @param notifyError The function for notifying errors
 */
export async function markOrderAsPaidFunc(
  swap: Swap,
  markOrderAsPaid: (orderId: bigint) => Promise<`0x${string}`>,
  getChainInfo: () => ChainInfo,
  queryClient: QueryClient,
  location: Location,
  loading: LoadingOrTriggeredState,
  triggered: LoadingOrTriggeredState,
  setLoading: (id: string, loading: LoadingOrTriggeredState) => void,
  setTriggered: (id: string, triggered: LoadingOrTriggeredState) => void,
  humanizeErrors: (error: { message: string } | unknown) => string,
  notifySuccess: (msg: ReactNode, options?: Options) => void,
  notifyError: (msg: ReactNode, options?: Options) => void
) {
  try {
    setLoading(swap.orderId.toFixed(), { ...loading, markOrderAsPaid: true });

    const [txHash] = await markOrderAsPaid(BigInt(swap.orderId));
    await delay(5000);

    const explorer = getChainInfo().blockExplorer;
    notifySuccess(`Swap was successfully marked as 'PAID'`, {
      duration: 5000,
      links: [{ label: "View Transaction", href: `${explorer}/tx/${txHash}` }],
    });

    if (location.pathname.includes("swaps/owned")) {
      await queryClient.refetchQueries(["getSwapsAsParticipant"]);
    } else if (location.pathname.includes("swap/")) {
      await queryClient.refetchQueries(["getSwap"]);
    }

    setTriggered(swap.orderId.toFixed(), {
      ...triggered,
      markOrderAsPaid: true,
    });
  } catch (error) {
    const msg = humanizeErrors(error);
    notifyError(msg);
    if (isDev()) console.error(error);
  } finally {
    setLoading(swap.orderId.toFixed(), { ...loading, markOrderAsPaid: false });
  }
}
