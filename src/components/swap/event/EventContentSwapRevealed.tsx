export function EventContentSwapRevealed(props: { dispute: Dispute }) {
  return (
    <span className="flex gap-1 flex-wrap">
      Revealed their verdict for dispute#
      {props.dispute.disputeId}.
    </span>
  );
}
