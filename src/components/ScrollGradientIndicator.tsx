import React, { ReactElement } from "react";
import { cn } from "../libs/utils.ts";

export default function ScrollGradientIndicator({
  children,
  side = "right",
}: {
  children: ReactElement;
  side?: "bottom" | "right";
}) {
  const [progress, setProgress] = React.useState(0);

  const onScrollX = (e: React.UIEvent<HTMLDivElement>) => {
    const containerWidth = e.currentTarget.clientWidth;
    const scrollWidth = e.currentTarget.scrollWidth;
    const scrollLeft = e.currentTarget.scrollLeft;
    setProgress(((scrollLeft + containerWidth) / scrollWidth) * 100);
  };

  const onScrollY = (e: React.UIEvent<HTMLDivElement>) => {
    const containerHeight = e.currentTarget.clientHeight;
    const scrollHeight = e.currentTarget.scrollHeight;
    const scrollTop = e.currentTarget.scrollTop;
    setProgress(((scrollTop + containerHeight) / scrollHeight) * 100);
  };

  return (
    <div
      className={cn({
        "scroll-gradient-right": side == "right" && progress < 100,
        "scroll-gradient-down": side == "bottom" && progress < 100,
      })}
    >
      {side == "bottom" && <span className="grad-indicator"></span>}
      {React.cloneElement(children, {
        onScroll: side == "right" ? onScrollX : onScrollY,
      })}
    </div>
  );
}
