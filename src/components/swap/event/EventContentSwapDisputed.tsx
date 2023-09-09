export function EventContentSwapDisputed(props: { dispute: Dispute }) {
  return (
    <span className="flex gap-1 flex-wrap">
      Started a new dispute#{props.dispute.disputeId}.
    </span>
  );
}
