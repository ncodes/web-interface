export function EventContentSwapExecuted(props: { dispute: Dispute }) {
  return (
    <span className="flex gap-1">
      Dispute#{props.dispute.disputeId} has been executed.
    </span>
  );
}
