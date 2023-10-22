import { DotsVerticalIcon, TimerIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  Circle,
  CircleDashed,
  HashIcon,
  MinusCircle,
  Users2,
  XCircle,
} from "lucide-react";
import moment from "moment";
import { BaseSyntheticEvent, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useMediatorManagerContract from "../../hooks/services/contracts/useMediatorManagerContract.ts";
import { useToast } from "../../hooks/toast/toast.tsx";
import { getTicketStatus } from "../../libs/api_utils.ts";
import { delay, formatToHighDenom, isDev } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { CountDown } from "../Countdown.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { USDAmountToolTip } from "../USDAmountToolTip.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { InfoCard } from "../market/InfoCard.tsx";
import { Button } from "../ui/Button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import {
  TicketStatusBadge,
  TicketTipCancelled,
  TicketTipCancelling,
  TicketTipDrafted,
  TicketTipDrained,
  TicketTipExpired,
  TicketTipJoined,
  TicketTipMatured,
  TicketTipMaturing,
} from "./TicketStatusBadge.tsx";

export function TicketRow({
  ticket,
  noFocus,
  className,
}: {
  ticket: Ticket;
  noFocus?: boolean;
  className?: string;
}) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const { getChainInfo } = useConnectorContext();
  const { notifySuccess, notifyError } = useToast();
  const { join, cancelTicket, drainTicket, humanizeErrors } =
    useMediatorManagerContract();
  const [joining, setJoining] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [draining, setDraining] = useState(false);

  async function doJoinPool() {
    try {
      setJoining(true);

      const [txHash] = await join(BigInt(ticket.index));
      await delay(5000);

      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Ticket has joined the pool successfully`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });

      await queryClient.refetchQueries(["getTicketsOwned"]);
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setJoining(false);
    }
  }

  async function doCancelTicket() {
    try {
      setCancelling(true);

      const [txHash] = await cancelTicket(BigInt(ticket.index));
      await delay(5000);

      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Ticket was cancelled successfully`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });

      await queryClient.refetchQueries(["getTicketsOwned"]);
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setCancelling(false);
    }
  }

  async function doDrainTicket() {
    try {
      setDraining(true);

      const [txHash] = await drainTicket(BigInt(ticket.index));
      await delay(5000);

      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Ticket was drained successfully`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });

      await queryClient.refetchQueries(["getTicketsOwned"]);
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setDraining(false);
    }
  }

  return (
    <div
      onClick={(e: BaseSyntheticEvent) => {
        const canTrigger = e.target.getAttribute("data-click-trigger");
        if (canTrigger && canTrigger == "1" && !noFocus) {
          // do something
        }
      }}
    >
      <div
        data-click-trigger="1"
        className={cn(
          "border bg-card-background border-card-border transition-all duration-300 rounded-xl border-b-gray-600",
          {
            "hover:border-chinese-green cursor-pointer": !noFocus,
          },
          className
        )}
      >
        <div className="flex flex-col md:flex-row" data-click-trigger="1">
          <div
            data-click-trigger="1"
            className="flex gap-2 p-5 px-3 py-0 items-center shrink-0 md:border-r border-gray-800"
          >
            <div className="flex md:flex-col gap-1 w-full md:px-0 md:py-4 pt-2 md:pt-1 relative md:top-1">
              <div className="flex gap-1">
                <span>
                  <HashIcon className="text-gray-400" width="20px" />
                </span>
                <span>{ticket.index}</span>
              </div>
              <TicketStatusBadge ticket={ticket} />
            </div>
          </div>

          <div className="flex-1 overflow-hidden shrink-0">
            <ScrollOverflowIndicator>
              <ScrollAreaHorizontal className="flex mr-[1px]">
                <div
                  className="flex-1 flex py-2 px-2 gap-2"
                  data-click-trigger="1"
                >
                  <InfoCard
                    title={`Bond (P2P)`}
                    tip={`The total amount of security deposit locked in the ticket`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200 flex gap-1">
                      <span>{formatToHighDenom(ticket.bond, 18)}</span>
                      <USDAmountToolTip v={ticket.bondUsd} />
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`Pool ID`}
                    tip={`The pool where the ticket is currently staked`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200">
                      {ticket.poolId != undefined ? ticket.poolId : "-"}
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`Draft Count`}
                    tip={`The number of times this ticket has been drafted`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200">
                      {ticket.drafts.length}
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`Current Phase`}
                    tip={`The current phase of the ticket`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200">
                      {getTicketStatus(ticket) == "maturing" && <>Maturing</>}
                      {getTicketStatus(ticket) == "matured" && <>Matured</>}
                      {getTicketStatus(ticket) == "joined" && <>Joined</>}
                      {getTicketStatus(ticket) == "drafted" && <>Drafted</>}
                      {getTicketStatus(ticket) == "expired" && <>Expired</>}
                      {getTicketStatus(ticket) == "cancelling" && (
                        <>Cancelling</>
                      )}
                      {getTicketStatus(ticket) == "cancelled" && <>Cancelled</>}
                      {getTicketStatus(ticket) == "drained" && <>Drained</>}
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`Next Phase`}
                    tip={`The next phase of the ticket`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200 ">
                      {getTicketStatus(ticket) == "maturing" && <>Maturation</>}
                      {getTicketStatus(ticket) == "matured" && <>Join Pool</>}
                      {getTicketStatus(ticket) == "joined" && (
                        <>Awaiting Draft</>
                      )}
                      {getTicketStatus(ticket) == "drafted" && <>Mediate</>}
                      {getTicketStatus(ticket) == "expired" && (
                        <>Cancellation</>
                      )}
                    </span>
                  </InfoCard>
                </div>
              </ScrollAreaHorizontal>
            </ScrollOverflowIndicator>
          </div>
        </div>

        {/* Layer 2 */}
        <div className="border-t border-gray-800 text-gray-400 px-3 py-1 flex flex-col md:flex-row md:justify-between">
          {getTicketStatus(ticket) == "drained" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <MinusCircle width="15" className="" />{" "}
              <ToolTip
                tip={<TicketTipDrained />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span>This ticket has been drained of its security bond.</span>
                <IconInfoCircle width="15" className="hidden xs:inline" />
              </ToolTip>
            </span>
          )}

          {getTicketStatus(ticket) == "maturing" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <CircleDashed width="15" className="" />{" "}
              <ToolTip
                tip={<TicketTipMaturing />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span className="flex gap-1">
                  <span>This ticket will mature in:</span>
                  <span className="font-medium">
                    <CountDown
                      isoDate={ticket.matureAt}
                      className="[&>span.time]:text-chinese-green"
                      onDone={async () => {
                        await queryClient.refetchQueries(["getTicketsOwned"]);
                      }}
                      full
                    />
                  </span>
                </span>
                <IconInfoCircle width="15" className="hidden xs:inline" />
              </ToolTip>
            </span>
          )}

          {getTicketStatus(ticket) == "matured" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <Circle width="15" className="" />{" "}
              <ToolTip
                tip={<TicketTipMatured />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span className="flex gap-1">
                  <span>This ticket has matured. Join a pool</span>
                  <CountDown
                    prefix=" before "
                    isoDate={ticket.joinBy}
                    className="[&>span.time]:text-chinese-green [&>span.time]:font-medium"
                    onDone={async () => {
                      await queryClient.refetchQueries(["getTicketsOwned"]);
                    }}
                    full
                  />
                </span>
                <IconInfoCircle width="15" className="hidden xs:inline" />
              </ToolTip>
            </span>
          )}

          {getTicketStatus(ticket) == "joined" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <CheckCircle width="15" className="" />{" "}
              <ToolTip
                tip={<TicketTipJoined />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span>This ticket has joined a pool.</span>
                <IconInfoCircle width="15" className="hidden xs:inline" />
              </ToolTip>
            </span>
          )}

          {getTicketStatus(ticket) == "drafted" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <Users2 width="15" className="" />{" "}
              <ToolTip
                tip={<TicketTipDrafted />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span>This ticket has been drafted.</span>
                <IconInfoCircle width="15" className="hidden xs:inline" />
              </ToolTip>
            </span>
          )}

          {getTicketStatus(ticket) == "expired" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <XCircle width="15" className="" />{" "}
              <ToolTip
                tip={<TicketTipExpired />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span>This ticket has expired.</span>
                <IconInfoCircle width="15" className="hidden xs:inline" />
              </ToolTip>
            </span>
          )}

          {getTicketStatus(ticket) == "cancelling" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <XCircle width="15" className="" />{" "}
              <ToolTip
                tip={<TicketTipCancelling />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span className="flex gap-1">
                  <span>Bond can be drained in: </span>
                  <span className="font-medium">
                    <CountDown
                      isoDate={ticket.cancelAt}
                      className="[&>span.time]:text-chinese-green"
                      onDone={async () => {
                        await queryClient.refetchQueries(["getTicketsOwned"]);
                      }}
                      full
                    />
                  </span>
                </span>
                <IconInfoCircle width="15" className="hidden xs:inline" />
              </ToolTip>
            </span>
          )}

          {getTicketStatus(ticket) == "cancelled" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <XCircle width="15" className="" />{" "}
              <ToolTip
                tip={<TicketTipCancelled />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span>This ticket has been cancelled.</span>
                <IconInfoCircle width="15" className="hidden xs:inline" />
              </ToolTip>
            </span>
          )}

          <span
            data-click-trigger="1"
            className="flex py-1 text-[12px] text-gray-400 gap-1 items-center tracking-wide font-light"
          >
            <span className="text-gray-500">
              <ToolTip
                tip={moment(ticket.createdAt).fromNow()}
                className="flex gap-1 items-center"
              >
                <span>
                  <TimerIcon />
                </span>
                <span>
                  {moment(ticket.createdAt)
                    .format("DD MMM YYYY, h:mm:ss a")
                    .toUpperCase()}
                </span>
              </ToolTip>
            </span>
          </span>
        </div>

        {/* Layer 3 */}
        <div
          className={cn("flex justify-between border-t border-card-border", {
            hidden: ["drained", "maturing", "cancelling"].includes(
              getTicketStatus(ticket) || ""
            ),
          })}
        >
          <div
            data-click-trigger="1"
            className="flex items-center w-full gap-2 px-3 pr-0 md:px-1 md:pr-0 overflow-hidden py-1"
          >
            {["matured"].includes(getTicketStatus(ticket) || "") && (
              <Button
                variant="default"
                size="sm"
                rounded="lg"
                className="w-[100px] text-xs md:text-sm"
                scale="sm"
                disabled={joining}
                onClick={doJoinPool}
              >
                {!joining && <>Join Pool</>}
                {joining && (
                  <IconSpinner
                    width="20"
                    className="animate-spin"
                    fill="fill-gray-800"
                  />
                )}
              </Button>
            )}

            {["matured", "expired", "joined"].includes(
              getTicketStatus(ticket) || ""
            ) && (
              <Button
                variant="outline"
                size="sm"
                rounded="lg"
                className="w-[100px] text-xs md:text-sm"
                scale="sm"
                disabled={cancelling}
                onClick={doCancelTicket}
              >
                {!cancelling && <>Cancel</>}
                {cancelling && (
                  <IconSpinner
                    width="20"
                    className="animate-spin"
                    fill="fill-gray-200"
                  />
                )}
              </Button>
            )}

            {["cancelled"].includes(getTicketStatus(ticket) || "") && (
              <Button
                variant="outline"
                size="sm"
                rounded="lg"
                className="w-[100px] text-xs md:text-sm"
                scale="sm"
                disabled={draining}
                onClick={doDrainTicket}
              >
                {!draining && <>Drain</>}
                {draining && (
                  <IconSpinner
                    width="20"
                    className="animate-spin"
                    fill="fill-gray-200"
                  />
                )}
              </Button>
            )}
          </div>
          <div
            data-click-trigger="1"
            className={cn(
              "flex items-center border-l border-gray-800 shrink-0 px-2"
            )}
          >
            {getTicketStatus(ticket) == "drafted" && (
              <>
                <span className=" lg:inline border-r border-gray-800 shrink-0">
                  <Button
                    variant="link"
                    rounded="none"
                    className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
                  >
                    View Swap
                  </Button>
                </span>

                <span className=" lg:inline border-gray-800 shrink-0">
                  <Button
                    variant="link"
                    rounded="none"
                    className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
                  >
                    View Dispute
                  </Button>
                </span>
              </>
            )}

            <span className="hidden ">
              <DropdownMenu
                onOpenChange={(open) => {
                  setMoreMenuOpen(open);
                }}
              >
                <DropdownMenuTrigger className="outline-0 ring-0">
                  <span
                    className={cn(
                      "px-2 py-3 outline-0 ring-0 flex gap-1  items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green",
                      { "scale-x-105 text-chinese-green": moreMenuOpen }
                    )}
                  >
                    <DotsVerticalIcon />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
                  {getTicketStatus(ticket) == "drafted" && (
                    <>
                      <DropdownMenuItem className="flex gap-2">
                        View Swap
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2">
                        View Dispute
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
