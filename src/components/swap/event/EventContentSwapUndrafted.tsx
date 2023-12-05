export function EventContentSwapUndrafted(props: { dispute: Dispute }) {
  return (
    <span className="flex gap-1 flex-wrap">
      Undrafted a mediator from dispute#{props.dispute?.disputeId}.
    </span>
  );
}
