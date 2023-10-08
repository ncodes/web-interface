import { useEffect, useRef } from "react";

export function MessageVideo({ data, type }: { data: string; type: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const buf = Buffer.from(data, "base64");
    const blob = new Blob([buf], { type: type });
    ref.current.src = window.URL.createObjectURL(blob);
  }, [ref, data, type]);

  return (
    <div className="overflow-hidden mb-3">
      <video ref={ref} className="w-[300px]" controls></video>
    </div>
  );
}
