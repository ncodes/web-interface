import { QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Location } from "react-router-dom";
import { Options } from "../../../hooks/toast/toast.tsx";
import { delay, isDev } from "../../../libs/helpers.ts";
import { ChainInfo } from "../../../types/global";

/**
 * Order cancelling function
 *
 * @param swap The swap object
 * @param cancelOrder The contract function for cancelling an order
 * @param getChainInfo The function for getting the chain info
 * @param queryClient The query client
 * @param location The react router location object
 * @param loading The current loading state
 * @param setLoading The function for setting the loading state
 * @param humanizeErrors The function for humanizing errors from the contract
 * @param notifySuccess The function for notifying success
 * @param notifyError The function for notifying errors
 */
export async function cancelOrderFunc(
  swap: Swap,
  cancelOrder: (orderId: bigint) => Promise<`0x${string}`>,
  getChainInfo: () => ChainInfo,
  queryClient: QueryClient,
  location: Location,
  loading: LoadingState,
  setLoading: (id: string, loading: LoadingState) => void,
  humanizeErrors: (error: { message: string } | unknown) => string,
  notifySuccess: (msg: ReactNode, options?: Options) => void,
  notifyError: (msg: ReactNode, options?: Options) => void
) {
  try {
    setLoading(swap.orderId.toFixed(), { ...loading, cancelOrder: true });

    const [txHash] = await cancelOrder(BigInt(swap.orderId));
    await delay(5000);

    const explorer = getChainInfo().blockExplorer;
    notifySuccess(`Swap was successfully cancelled`, {
      duration: 5000,
      links: [{ label: "View Transaction", href: `${explorer}/tx/${txHash}` }],
    });

    if (location.pathname.includes("my/swaps")) {
      await queryClient.refetchQueries(["getSwapsAsParticipant"]);
    } else if (location.pathname.includes("swap/")) {
      await queryClient.refetchQueries(["getSwap"]);
    }
  } catch (error) {
    const msg = humanizeErrors(error);
    notifyError(msg);
    if (isDev()) console.error(error);
  } finally {
    setLoading(swap.orderId.toFixed(), { ...loading, cancelOrder: false });
  }
}
