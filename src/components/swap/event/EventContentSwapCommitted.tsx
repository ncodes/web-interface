export function EventContentSwapCommitted(props: { dispute: Dispute }) {
  return (
    <span className="flex gap-1 flex-wrap">
      Committed their verdict for dispute#
      {props.dispute.disputeId}.
    </span>
  );
}
