export function EventContentSwapCancelled(props: { inTimeline?: boolean }) {
  return (
    <span className="flex gap-1">
      {!props.inTimeline && (
        <>
          <b className="text-chinese-green">Cancelled</b> the swap
        </>
      )}
      {props.inTimeline && (
        <>
          <b className="text-chinese-green">Cancelled</b> a swap
        </>
      )}
    </span>
  );
}
