export function EventContentSwapReleased(props: { inTimeline?: boolean }) {
  return (
    <span className="flex gap-1 flex-wrap">
      {!props.inTimeline && (
        <>
          <b className="text-chinese-green">Released</b> the swap
        </>
      )}
      {props.inTimeline && (
        <>
          <b className="text-chinese-green">Released</b> a swap
        </>
      )}
    </span>
  );
}
