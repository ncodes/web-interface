export function EventContentSwapRevealed(props: { dispute: Dispute }) {
  return (
    <span className="flex gap-1">
      Revealed their verdict for dispute#
      {props.dispute.disputeId}.
    </span>
  );
}
