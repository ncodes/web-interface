import React, { createRef, ReactElement, useEffect } from "react";
import { cn } from "../libs/utils.ts";

export default function ScrollGradientIndicator({
  children,
  side = "right",
  className,
}: {
  children: ReactElement;
  side?: "bottom" | "right";
  className?: string;
}) {
  const [progress, setProgress] = React.useState(0);
  const ref = createRef<HTMLDivElement>();

  const onScrollX = (e: {
    currentTarget: {
      clientWidth: number;
      scrollWidth: number;
      scrollLeft: number;
    };
  }) => {
    const containerWidth = e.currentTarget.clientWidth;
    const scrollWidth = e.currentTarget.scrollWidth;
    const scrollLeft = e.currentTarget.scrollLeft;
    if (scrollLeft > 0)
      setProgress(((scrollLeft + containerWidth) / scrollWidth) * 100);
  };

  const onScrollY = (e: {
    currentTarget: {
      clientHeight: number;
      scrollHeight: number;
      scrollTop: number;
    };
  }) => {
    const containerHeight = e.currentTarget.clientHeight;
    const scrollHeight = e.currentTarget.scrollHeight;
    const scrollTop = e.currentTarget.scrollTop;
    console.log(e.currentTarget);
    if (containerHeight != scrollHeight)
      setProgress(((scrollTop + containerHeight) / scrollHeight) * 100);
    else setProgress(100);
  };

  useEffect(() => {
    if (!ref || !ref.current) return;
    if (side == "right") {
      onScrollX({ currentTarget: ref.current });
    } else {
      const viewPort = ref.current.querySelector(
        "div[data-radix-scroll-area-viewport]"
      );
      if (!viewPort) return;
      onScrollY({
        currentTarget: {
          clientHeight: viewPort.clientHeight,
          scrollHeight: viewPort.scrollHeight,
          scrollTop: viewPort.scrollTop,
        },
      });
    }
  }, [side]);

  return (
    <div
      data-swap-trigger="1"
      className={cn(
        {
          "scroll-gradient-right": side == "right" && progress < 100,
          "scroll-gradient-down": side == "bottom" && progress < 100,
        },
        className
      )}
    >
      {side == "bottom" && (
        <span
          className={cn(
            "select-none grad-indicator text-center font-extralight text-xs text-gray-500 pt-2",
            { hidden: progress == 100 }
          )}
        >
          Scroll down
        </span>
      )}
      {React.cloneElement(children, {
        ref: ref,
        onScroll: side == "right" ? onScrollX : onScrollY,
      })}
    </div>
  );
}
