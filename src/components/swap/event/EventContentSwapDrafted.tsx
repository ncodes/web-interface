export function EventContentSwapDrafted(props: { dispute: Dispute }) {
  return (
    <span className="flex gap-1">
      Drafted as a mediator to dispute#{props.dispute.disputeId}.
    </span>
  );
}
