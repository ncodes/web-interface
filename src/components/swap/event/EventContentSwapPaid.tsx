export function EventContentSwapPaid(props: { inTimeline?: boolean }) {
  return (
    <span className="flex gap-1">
      {!props.inTimeline && (
        <>
          Marked swap as <b className="text-chinese-green">paid</b>
        </>
      )}
      {props.inTimeline && (
        <>
          Marked a swap as <b className="text-chinese-green">paid</b>
        </>
      )}
    </span>
  );
}
