import { useEffect, useState } from "react";
import moment from "moment";

export function CountDown({
  isoDate,
  onDone,
  prefix,
  wrapL,
  wrapR,
  full,
  className,
  headless,
}: {
  isoDate: string;
  onDone?: () => void;
  prefix?: string;
  full?: boolean;
  className?: string;
  wrapL?: string;
  wrapR?: string;
  headless?: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState<number>();

  useEffect(() => {
    const m = moment(isoDate);
    const sec = m.diff(moment(), "seconds");
    if (sec <= 0) callDone();
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
        callDone();
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [onDone, timeLeft]);

  function callDone() {
    if (!onDone) return;
    setTimeout(() => {
      onDone && onDone();
    }, 300);
  }

  function renderTimeLeft() {
    if (!timeLeft) return "";
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    return (
      <span className={className}>
        {wrapL || `(`}
        <span className="prefix">{`${prefix || ""}`}</span>
        <span className="time">{`${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`}</span>
        {wrapR || `)`}
      </span>
    );
  }

  // render for hours, minutes, seconds
  function renderFullTimeLeft() {
    if (!timeLeft) return "";
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft - hours * 3600) / 60);
    const seconds = timeLeft - hours * 3600 - minutes * 60;
    return (
      <span className={className}>
        <span className="prefix">{prefix || ""}</span>
        <span className="time">{`${hours < 10 ? "0" : ""}${hours}:${
          minutes < 10 ? "0" : ""
        }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</span>
      </span>
    );
  }

  if (headless) return null;

  if (full)
    return <>{timeLeft != undefined && timeLeft > 0 && renderFullTimeLeft()}</>;

  return <>{timeLeft != undefined && timeLeft > 0 && renderTimeLeft()}</>;
}
