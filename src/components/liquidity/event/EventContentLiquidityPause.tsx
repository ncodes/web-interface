export function EventContentLiquidityPause(props: {
  event: Event;
  market: Market;
  className?: string;
  inTimeline?: boolean;
}) {
  return (
    <div className={props.className}>
      <span className="flex gap-1">
        {props.event.paused ? <span>Paused</span> : <span>Unpaused</span>}{" "}
        {!props.inTimeline ? "the" : "their"} liquidity
      </span>
    </div>
  );
}
