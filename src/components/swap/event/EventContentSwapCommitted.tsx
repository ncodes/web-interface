export function EventContentSwapCommitted(props: { dispute: Dispute }) {
  return (
    <span className="flex gap-1">
      Committed their verdict for dispute#
      {props.dispute.disputeId}.
    </span>
  );
}
