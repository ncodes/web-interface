import { getTicketStatus } from "../../libs/api_utils.ts";
import { ToolTip } from "../ToolTip.tsx";
import {
  CheckCircle,
  Circle,
  CircleDashed,
  MinusCircle,
  Users2,
  XCircle,
} from "lucide-react";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";

export function TicketTipDrained() {
  return <>This ticket's security bond has been withdrawn by the owner.</>;
}

export function TicketTipMaturing() {
  return (
    <>
      This ticket is in its maturation phase. It will be ready to join a pool
      after the maturation phase.
    </>
  );
}

export function TicketTipMatured() {
  return (
    <>
      This ticket is now ready to join a pool.
      <br />
      <br />
      Simultaneously, the ticket is expiring. Failure to join a pool will result
      in ticket expiration.
      <br />
      <br />
      Expired tickets can have their security bond withdrawn by their owner.
    </>
  );
}

export function TicketTipJoined() {
  return (
    <>
      This ticket has joined a pool and is available for drafting into new
      disputes.
    </>
  );
}

export function TicketTipExpired() {
  return (
    <>
      This ticket has expired. The owner can cancel it and drain the security
      bond.
    </>
  );
}

export function TicketTipDrafted() {
  return <>This ticket has been drafted into an active dispute.</>;
}

export function TicketTipCancelling() {
  return (
    <>
      This ticket is currently being cancelled. After cancellation, the owner
      can withdraw the security bond.
    </>
  );
}

export function TicketTipCancelled() {
  return (
    <>This ticket has been cancelled. The owner can drain the security bond.</>
  );
}

export function TicketStatusBadge(props: { ticket: Ticket }) {
  return (
    <div className="flex w-full justify-end md:justify-start">
      {getTicketStatus(props.ticket) == "drained" && (
        <span className="flex bg-gray-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-gray-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={<TicketTipDrained />}
          >
            <MinusCircle width="15" />{" "}
            <span className="hidden xs:inline">Drained</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-gray-300"
            />
          </ToolTip>
        </span>
      )}

      {getTicketStatus(props.ticket) == "maturing" && (
        <span className="flex bg-yellow-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-yellow-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={<TicketTipMaturing />}
          >
            <CircleDashed width="15" />{" "}
            <span className="hidden xs:inline">Maturing</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-yellow-300"
            />
          </ToolTip>
        </span>
      )}

      {getTicketStatus(props.ticket) == "matured" && (
        <span className="flex bg-yellow-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-yellow-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={<TicketTipMatured />}
          >
            <Circle width="15" />{" "}
            <span className="hidden xs:inline">Matured</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-yellow-300"
            />
          </ToolTip>
        </span>
      )}

      {getTicketStatus(props.ticket) == "joined" && (
        <span className="flex bg-green-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-green-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={<TicketTipJoined />}
          >
            <CheckCircle width="15" />{" "}
            <span className="hidden xs:inline">Joined</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-green-300"
            />
          </ToolTip>
        </span>
      )}

      {getTicketStatus(props.ticket) == "drafted" && (
        <span className="flex bg-gray-100 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-gray-700">
          <ToolTip
            className="flex items-center gap-1"
            tip={<TicketTipDrafted />}
          >
            <Users2 width="15" />{" "}
            <span className="hidden xs:inline">Drafted</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-gray-700"
            />
          </ToolTip>
        </span>
      )}

      {getTicketStatus(props.ticket) == "expired" && (
        <span className="flex bg-red-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-red-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={<TicketTipExpired />}
          >
            <XCircle width="15" />{" "}
            <span className="hidden xs:inline">Expired</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-red-300"
            />
          </ToolTip>
        </span>
      )}

      {getTicketStatus(props.ticket) == "cancelling" && (
        <span className="flex bg-red-200/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-red-200">
          <ToolTip
            className="flex items-center gap-1"
            tip={<TicketTipCancelling />}
          >
            <XCircle width="15" />{" "}
            <span className="hidden xs:inline">Cancelling</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-red-200"
            />
          </ToolTip>
        </span>
      )}

      {getTicketStatus(props.ticket) == "cancelled" && (
        <span className="flex bg-red-400/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-red-400">
          <ToolTip
            className="flex items-center gap-1"
            tip={<TicketTipCancelled />}
          >
            <XCircle width="15" />{" "}
            <span className="hidden xs:inline">Cancelled</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-red-400"
            />
          </ToolTip>
        </span>
      )}
    </div>
  );
}
