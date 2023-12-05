import { getDisputeStatus, isDisputeDraftee } from "../../libs/api_utils.ts";
import { ToolTip } from "../ToolTip.tsx";
import {
  CheckCircle,
  FileLock,
  FilePlus,
  FileQuestion,
  Gavel,
  UserPlus2,
  XCircle,
} from "lucide-react";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { LockOpen1Icon } from "@radix-ui/react-icons";

export function DisputeTipAbandoned(props: {
  dispute: Dispute;
  address: string;
}) {
  return (
    <>
      This dispute was released before the mediation process finished.{" "}
      {isDisputeDraftee(props.dispute, props.address)
        ? "Mediators will be compensated for their time."
        : ""}
    </>
  );
}

export function DisputeTipReleased() {
  return (
    <>
      Mediators voted to <b className="text-chinese-green">release</b> the
      disputed swap.
    </>
  );
}

export function DisputeTipCancelled() {
  return (
    <>
      Mediators voted to <b className="text-chinese-green">cancel</b> the
      disputed swap. The counterpart with locked asset has been refunded.
    </>
  );
}

export function DisputeTipStalled(props: {
  dispute: Dispute;
  address: string;
}) {
  return (
    <>
      Mediators could not reach a consensus on this dispute. A new dispute must
      be created.{" "}
      {isDisputeDraftee(props.dispute, props.address)
        ? "Mediators will be compensated for their time."
        : ""}
    </>
  );
}

export function DisputeTipDraft(props: { dispute: Dispute }) {
  return (
    <>
      Mediators are being drafted to this dispute (
      {props.dispute.numMediatorsDrafted} of {props.dispute.numMediators}{" "}
      drafted).
    </>
  );
}

export function DisputeTipEvidence(props: {
  dispute: Dispute;
  address: string;
}) {
  return (
    <>
      In evidence phase, the mediators review evidence provided by swap
      counterparts. <br />
      <br />
      {isDisputeDraftee(props.dispute, props.address) ? (
        <>
          Please use the chat platform to request the involved parties to
          provide supporting materials (videos, images, etc.) to back their
          claim.
          <br />
          <br />
          <b className="text-red-400">
            Note: Your ticket will incur a penalty if you neglect to gather and
            assess evidence, and subsequently issue a verdict that does not
            align with the majority's decision.
          </b>
        </>
      ) : (
        "Please utilize the chat system to provide supporting documentation (videos, images, etc.) to back your claim."
      )}
    </>
  );
}

export function DisputeTipCommit(props: { dispute: Dispute; address: string }) {
  return (
    <>
      {isDisputeDraftee(props.dispute, props.address) ? (
        <>
          In commit phase, you must commit a verdict/vote based on the evidence
          received.
          <br />
          <br />
          <b className="text-red-400">
            Note: Your ticket will incur a penalty if you fail to issue a
            verdict.
          </b>
        </>
      ) : (
        "In commit phase, the mediators individually decide and commit to a verdict based on the evidence received. The majority decision will be the final verdict."
      )}
    </>
  );
}

export function DisputeTipReveal(props: { dispute: Dispute; address: string }) {
  return (
    <>
      {isDisputeDraftee(props.dispute, props.address) ? (
        <>
          In reveal phase, you must reveal the exact verdict/vote you committed
          in the commit phase.
          <br />
          <br />
          <b className="text-red-400">
            Note: Your ticket will incur a penalty if you fail to reveal your
            verdict.
          </b>
        </>
      ) : (
        "In reveal phase, the mediators reveal the verdict they previously committed. The majority decision will be the final verdict."
      )}
    </>
  );
}

export function DisputeTipAwaitExec(props: {
  dispute: Dispute;
  address: string;
}) {
  return (
    <>
      In execute phase, the miners are expected to execute the verdict. The
      majority decision will be final verdict. The outcome can be either:
      <br />
      <br />
      <ul className="[&>li>b]:text-chinese-green">
        <li>
          <b>released</b>: locked asset is released.
        </li>
        <li>
          <b>cancelled</b>: swap is cancelled and locked asset is returned.
        </li>
        <li>
          <b>stalled</b>: mediators failed to reach consensus. A new dispute
          must be created.
        </li>
      </ul>
      <br></br>
      {isDisputeDraftee(props.dispute, props.address) && (
        <>
          Mediators who predicted the majority outcome will receive protocol
          reward. The minority will be penalized.
        </>
      )}
    </>
  );
}

export function DisputeStatusBadge(props: {
  address: string;
  dispute: Dispute;
}) {
  return (
    <span className="flex items-center gap-1 text-xs font-light tracking-wider">
      {/* Abandoned dispute */}
      {props.address && getDisputeStatus(props.dispute) == "abandoned" && (
        <span className="flex bg-green-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-green-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={
              <DisputeTipAbandoned
                dispute={props.dispute}
                address={props.address}
              />
            }
          >
            <CheckCircle width="15" />{" "}
            <span className="hidden xs:inline">Released</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-green-300"
            />
          </ToolTip>
        </span>
      )}

      {getDisputeStatus(props.dispute) == "released" && (
        <span className="flex bg-green-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-green-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={<DisputeTipReleased />}
          >
            <CheckCircle width="15" />{" "}
            <span className="hidden xs:inline">Released</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-green-300"
            />
          </ToolTip>
        </span>
      )}

      {getDisputeStatus(props.dispute) == "cancelled" && (
        <span className="flex bg-red-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-red-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={<DisputeTipCancelled />}
          >
            <XCircle width="15" />{" "}
            <span className="hidden xs:inline">Cancelled</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-red-300"
            />
          </ToolTip>
        </span>
      )}

      {getDisputeStatus(props.dispute) == "stalled" && (
        <span className="flex bg-slate-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-slate-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={
              <DisputeTipStalled
                dispute={props.dispute}
                address={props.address}
              />
            }
          >
            <FileQuestion width="15" />{" "}
            <span className="hidden xs:inline">Stalled</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-slate-300"
            />
          </ToolTip>
        </span>
      )}

      {getDisputeStatus(props.dispute) == "draft" && (
        <span className="flex bg-slate-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-slate-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={<DisputeTipDraft dispute={props.dispute} />}
          >
            <UserPlus2 width="15" />{" "}
            <span className="hidden xs:inline">Drafting</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-slate-300"
            />
          </ToolTip>
        </span>
      )}

      {getDisputeStatus(props.dispute) == "evidence" && (
        <span className="flex bg-blue-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-blue-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={
              <DisputeTipEvidence
                dispute={props.dispute}
                address={props.address}
              />
            }
          >
            <FilePlus width="15" />{" "}
            <span className="hidden xs:inline">Evidence</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-blue-300"
            />
          </ToolTip>
        </span>
      )}

      {getDisputeStatus(props.dispute) == "commit" && (
        <span className="flex bg-blue-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-blue-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={
              <DisputeTipCommit
                dispute={props.dispute}
                address={props.address}
              />
            }
          >
            <FileLock width="15" />{" "}
            <span className="hidden xs:inline">Commit</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-blue-300"
            />
          </ToolTip>
        </span>
      )}

      {getDisputeStatus(props.dispute) == "reveal" && (
        <span className="flex bg-cyan-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-cyan-300">
          <ToolTip
            className="flex items-center gap-1 py-[3px]"
            tip={
              <DisputeTipReveal
                dispute={props.dispute}
                address={props.address}
              />
            }
          >
            <LockOpen1Icon width="15" />{" "}
            <span className="hidden xs:inline">Reveal</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-cyan-300"
            />
          </ToolTip>
        </span>
      )}

      {getDisputeStatus(props.dispute) == "awaiting_exec" && (
        <span className="flex bg-orange-300/30 rounded-full px-[6px] text-xs items-center gap-1 font-medium tracking-wider text-orange-300">
          <ToolTip
            className="flex items-center gap-1"
            tip={
              <DisputeTipAwaitExec
                dispute={props.dispute}
                address={props.address}
              />
            }
          >
            <Gavel width="15" />{" "}
            <span className="hidden xs:inline">Execution</span>
            <IconInfoCircle
              width="15"
              className="hidden xs:inline text-orange-300"
            />
          </ToolTip>
        </span>
      )}
    </span>
  );
}
