import { ChainInfo } from "../../../types/global";
import { QueryClient } from "@tanstack/react-query";
import { Location } from "react-router-dom";
import { ReactNode } from "react";
import { Options } from "../../../hooks/toast/toast.tsx";
import { delay, isDev } from "../../../libs/helpers.ts";
import { decodeEventLog, TransactionReceipt } from "viem";

/**
 * Appeal an order
 *
 * @param swap The swap object
 * @param appealOrder The contract function for market an order as 'paid'
 * @param wantRelease Indicate whether to release the order
 * @param getChainInfo The function for getting the chain info
 * @param queryClient The query client
 * @param location The react router location object
 * @param loading The current loading state
 * @param setDisputeId The function for setting the dispute ID
 * @param setLoading The function for setting the loading state
 * @param humanizeErrors The function for humanizing errors from the contract
 * @param notifySuccess The function for notifying success
 * @param notifyError The function for notifying errors
 */
export async function appealOrderFunc(
  swap: Swap,
  appealOrder: (
    orderId: bigint,
    wantRelease: boolean
  ) => Promise<[`0x${string}`, TransactionReceipt]>,
  wantRelease: boolean,
  getChainInfo: () => ChainInfo,
  queryClient: QueryClient,
  location: Location,
  loading: LoadingState,
  setDisputeId: (disputeId: number) => void,
  setLoading: (id: string, loading: LoadingState) => void,
  humanizeErrors: (error: { message: string } | unknown) => string,
  notifySuccess: (msg: ReactNode, options?: Options) => void,
  notifyError: (msg: ReactNode, options?: Options) => void
) {
  try {
    setLoading(swap.orderId.toFixed(), { ...loading, appealOrder: true });

    const [txHash, txReceipt] = await appealOrder(
      BigInt(swap.orderId),
      wantRelease
    );

    const event = decodeEventLog({
      abi: getChainInfo().contracts?.disputeManager.abi,
      data: txReceipt.logs[0].data,
      topics: txReceipt.logs[0].topics,
    });
    const args = event.args as { index: bigint };
    setDisputeId && setDisputeId(Number(args.index));

    await delay(5000);

    const explorer = getChainInfo().blockExplorer;
    notifySuccess(`Appeal successfully started`, {
      duration: 5000,
      links: [{ label: "View Transaction", href: `${explorer}/tx/${txHash}` }],
    });

    if (location.pathname.includes("swaps/owned")) {
      await queryClient.refetchQueries(["getSwapsAsParticipant"]);
    } else if (location.pathname.includes("swap/")) {
      await queryClient.refetchQueries(["getSwap"]);
    }
  } catch (error) {
    const msg = humanizeErrors(error);
    notifyError(msg);
    if (isDev()) console.error(error);
  } finally {
    setLoading(swap.orderId.toFixed(), { ...loading, appealOrder: false });
  }
}
