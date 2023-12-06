import { MediatorPools } from "@jointlabs/chains-info";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import { Address } from "viem";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useMediatorManagerContract from "../../hooks/services/contracts/useMediatorManagerContract.ts";
import useStore from "../../hooks/store/useStore.ts";
import { useSheetInfo } from "../../hooks/useSheetInfo.ts";
import { useToast } from "../../hooks/useToast.tsx";
import { delay, formatToHighDenom, isDev } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import IconSpinner from "../icons/IconSpinner.tsx";
import { InfoCard } from "../market/InfoCard.tsx";
import { Button } from "../ui/Button.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { PoolSelector } from "./PoolSelector.tsx";

export function BuyTicketSheet(props: {
  children?: React.ReactNode;
  onOpen?: (open: boolean) => void;
}) {
  const { getTicketPrice } = useMediatorManagerContract();
  const [, sheetSide, styles] = useSheetInfo();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    getChainInfo,
    address,
    getTokenAllowance,
    approveAllowance,
    getTokenSupply,
    humanizeErc20Errors,
  } = useConnectorContext();
  const { purchaseTicket, humanizeErrors } = useMediatorManagerContract();
  const openState = useStore((state) => state.openState);
  const resetOpenState = useStore((state) => state.resetOpenState);
  const toggleOpenState = useStore((state) => state.toggleOpenState);
  const [ticketPrice, setTicketPrice] = useState(BigInt(0));
  const [approveLoading, setApproveLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  const { notifySuccess, notifyError } = useToast();
  const [loading, setLoading] = useState(false);
  const mediatorPools = MediatorPools[getChainInfo().queryName];
  const [pool, setPool] = useState<MediatorPool>();

  useEffect(() => {
    setOpen(openState.buyTicketSheet ?? open);
  }, [openState.buyTicketSheet]);

  useInterval(async () => {
    const price = await getTicketPrice();
    setTicketPrice(price);
  }, 5000);

  useEffect(() => {
    if (!pool) return;

    const verifyAllowance = async () => {
      const allowance = await getTokenAllowance(
        getChainInfo().contracts?.token?.address as string,
        address,
        getChainInfo().contracts?.mediatorManager?.address as string,
      );
      setApproved(allowance >= BigInt(ticketPrice + BigInt(pool.reqBond)));
    };

    void verifyAllowance();
  }, [pool, approveLoading]);

  // Request and execute token allowance
  async function doRequestAllowance() {
    try {
      setApproveLoading(true);

      await approveAllowance(
        getChainInfo().contracts?.token?.address as Address,
        getChainInfo().contracts?.mediatorManager?.address as Address,
        await getTokenSupply(
          getChainInfo().contracts?.token?.address as Address,
        ),
      );

      await delay(5000);
      notifySuccess("Allowance successfully approved", { duration: 5000 });
    } catch (error) {
      const msg = humanizeErc20Errors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setApproveLoading(false);
    }
  }

  // Function to purchase a ticket
  async function doPurchase() {
    try {
      if (!pool) return;
      setLoading(true);

      const [txHash] = await purchaseTicket(BigInt(pool.id));
      await delay(5000);

      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Ticket purchase was successful`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });

      await queryClient.refetchQueries(["getTicketsOwned"]);
      resetOpenState();
      setPool(undefined);
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        props.onOpen && props.onOpen(open);
        toggleOpenState && toggleOpenState("buyTicketSheet");
      }}
    >
      <SheetTrigger>{props.children}</SheetTrigger>
      <SheetContent
        className={cn(
          styles,
          "flex py-0 flex-col gap-0 justify-between w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0",
        )}
        side={sheetSide}
      >
        <div className="flex-1">
          <SheetHeader className="flex pr-[50px] border-b border-gray-800">
            <div className="text-white">
              <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
                Purchase Ticket
              </SheetTitle>
            </div>
          </SheetHeader>
          <div className="px-3 text-white h-[70vh] md:h-[82vh] xl:h-full pt-3 xl:pt-0 xl:mt-3 overflow-auto">
            <div className="flex gap-2">
              <InfoCard
                title={`Pool ID`}
                tip={`The mediation pool you want the ticket to operate in`}
              >
                {mediatorPools && (
                  <PoolSelector
                    pools={mediatorPools}
                    disabled={approveLoading || loading}
                    onSelect={(pool) => {
                      setPool(pool);
                    }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      rounded="xl"
                      className="p-1 px-2 h-auto text-gray-100 text-sm"
                    >
                      {!pool && (
                        <div className="flex items-center gap-1">
                          <span>Choose Pool</span>
                          <ChevronDown width="15" />
                        </div>
                      )}
                      {pool && (
                        <div className="flex gap-1">
                          <span>{pool.name}</span>
                          <span className="text-gray-500 font-light">
                            (ID: {pool.id})
                          </span>
                        </div>
                      )}
                    </Button>
                  </PoolSelector>
                )}
              </InfoCard>
              <InfoCard
                title={`Ticket Price`}
                tip={`The unique ID of the pool this ticket will belong to.`}
              >
                <span className="mt-1 flex gap-1">
                  <span>{formatToHighDenom(ticketPrice, 18)}</span>
                  <span className="text-gray-300 font-light">P2P</span>
                </span>
              </InfoCard>
            </div>
            <div className="mt-2 p-2 flex flex-col gap-3">
              {pool && (
                <>
                  <div className="flex flex-col gap-1 border-b border-gray-800 pb-4">
                    <span className="text-sm text-gray-200">Bond Amount</span>
                    <span className="font-light text-sm text-gray-400">
                      The security deposit to lock in the ticket.
                    </span>
                    <span className="text-sm text-chinese-green">
                      {formatToHighDenom(pool.reqBond, 18)}{" "}
                      <span className="text-gray-300 font-light">P2P</span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-gray-800 pb-4">
                    <span className="text-sm text-gray-200">
                      Mediators Per Dispute
                    </span>
                    <span className="font-light text-sm text-gray-400">
                      The number of mediators per dispute.
                    </span>
                    <span className="text-sm text-chinese-green">
                      {pool.numDraftees}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-gray-800 pb-4">
                    <span className="text-sm text-gray-200">Draft Reward</span>
                    <span className="font-light text-sm text-gray-400">
                      Amount earned per draft to a dispute.
                    </span>
                    <span className="text-sm text-chinese-green">
                      {formatToHighDenom(pool.draftReward, 18)}{" "}
                      <span className="text-gray-300 font-light">P2P</span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-gray-800 pb-4">
                    <span className="text-sm text-gray-200">Win Reward</span>
                    <span className="font-light text-sm text-gray-400">
                      Amount earned for correctly predicting a dispute's
                      outcome.
                    </span>
                    <span className="text-sm text-chinese-green">
                      {formatToHighDenom(pool.winReward, 18)}{" "}
                      <span className="text-gray-300 font-light">P2P</span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-gray-800 pb-4">
                    <span className="text-sm text-gray-200">
                      Wrong Vote Penalty
                    </span>
                    <span className="font-light text-sm text-gray-400">
                      Percentage slashed from the bond for wrongfully predicting
                      a dispute's outcome.
                    </span>
                    <span className="text-sm text-chinese-green">
                      {pool.loseVoteSlashBP / 100}%
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 pb-4">
                    <span className="text-sm text-gray-200">
                      No Vote Penalty
                    </span>
                    <span className="font-light text-sm text-gray-400">
                      Percentage slashed from the bond for not voting or
                      incomplete vote.
                    </span>
                    <span className="text-sm text-chinese-green">
                      {pool.noVoteSlashBP / 100}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div
            className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            onClick={() => {
              toggleOpenState && toggleOpenState("buyTicketSheet");
            }}
          >
            <Cross2Icon className="h-6 w-6 transition-all duration-300 hover:text-chinese-green hover:scale-110 cursor-pointer" />
            <span className="sr-only">Close</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-white p-2 py-3 border-t border-gray-800">
          {!approved && pool && (
            <Button
              variant="secondary"
              size="full"
              disabled={approveLoading}
              onClick={doRequestAllowance}
            >
              {!approveLoading && "Approve"}
              {approveLoading && (
                <IconSpinner
                  width="20"
                  className="animate-spin"
                  fill="fill-gray-800"
                />
              )}
            </Button>
          )}

          <Button
            size="full"
            disabled={!approved || !pool || loading}
            onClick={doPurchase}
          >
            {!loading && "Purchase"}
            {loading && (
              <IconSpinner
                width="20"
                className="animate-spin"
                fill="fill-gray-800"
              />
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
