export function EventContentSwapExecuted(props: { dispute: Dispute }) {
  return (
    <span className="flex gap-1 flex-wrap">
      Dispute#{props.dispute?.disputeId} has been executed.
    </span>
  );
}
