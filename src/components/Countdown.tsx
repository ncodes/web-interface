import { useEffect, useState } from "react";
import moment from "moment";

export function CountDown({
  isoDate,
  onDone,
  prefix,
}: {
  isoDate: string;
  onDone?: () => void;
  prefix?: string;
}) {
  const [timeLeft, setTimeLeft] = useState<number>();

  useEffect(() => {
    const m = moment(isoDate);
    const sec = m.diff(moment(), "seconds");
    if (sec <= 0) onDone && onDone();
    setTimeLeft(sec > 0 ? sec : 0);
  }, [isoDate, onDone]);

  useEffect(() => {
    if (timeLeft != undefined && timeLeft <= 0) {
      setTimeLeft(0);
      return;
    }

    const intervalId = setInterval(() => {
      if (timeLeft == undefined) return;
      const cur = timeLeft - 1;
      setTimeLeft(cur);
      if (cur == 0) {
        onDone && onDone();
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [onDone, timeLeft]);

  return (
    <>
      {timeLeft != undefined && timeLeft > 0 && `(${prefix || ""}${timeLeft}s)`}
    </>
  );
}
