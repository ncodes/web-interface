import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { ReactElement, createRef, useEffect } from "react";
import { cn } from "../libs/utils.ts";
import { Button } from "./ui/Button.tsx";

export default function ScrollOverflowIndicator({
  children,
  side = "right",
  className,
  onScroll,
  showArrow,
  arrowContainerClassName,
  arrowContainerRightClassName,
  arrowContainerLeftClassName,
  disabled,
}: {
  children: ReactElement;
  side?: "bottom" | "right";
  className?: string;
  showArrow?: boolean;
  arrowContainerClassName?: string;
  arrowContainerRightClassName?: string;
  arrowContainerLeftClassName?: string;
  disabled?: boolean;
  onScroll?: (progress: number) => void;
}) {
  const [progress, setProgress] = React.useState(0);
  const ref = createRef<HTMLDivElement>();
  const [initialProgress, setInitialProgress] = React.useState(0);

  useEffect(() => {
    if (!progress || initialProgress) return;
    setInitialProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (!ref || !ref.current) return;
    const viewPort = ref.current.querySelector(
      "div[data-radix-scroll-area-viewport]",
    );
    if (!viewPort) return;
    if (side == "right") {
      onScrollX({
        currentTarget: {
          clientWidth: viewPort.clientWidth,
          scrollWidth: viewPort.scrollWidth,
          scrollLeft: viewPort.scrollLeft,
        },
      });
    } else {
      onScrollY({
        currentTarget: {
          clientHeight: viewPort.clientHeight,
          scrollHeight: viewPort.scrollHeight,
          scrollTop: viewPort.scrollTop,
        },
      });
    }
  }, [side]);

  useEffect(() => {
    onScroll && onScroll(progress);
  }, [progress]);

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
    if (containerWidth != scrollWidth)
      setProgress(
        Math.ceil(((scrollLeft + containerWidth) / scrollWidth) * 100),
      );
    else setProgress(100);
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
    if (containerHeight != scrollHeight)
      setProgress(
        Math.ceil(((scrollTop + containerHeight) / scrollHeight) * 100),
      );
    else setProgress(100);
  };

  function scrollRight() {
    if (!ref || !ref.current) return;
    const viewPort = ref.current.querySelector(
      "div[data-radix-scroll-area-viewport]",
    );
    if (!viewPort) return;
    viewPort.scrollLeft += 20;
  }

  function scrollLeft() {
    if (!ref || !ref.current) return;
    const viewPort = ref.current.querySelector(
      "div[data-radix-scroll-area-viewport]",
    );
    if (!viewPort) return;
    viewPort.scrollLeft -= 20;
  }

  if (disabled) return <>{children}</>;

  return (
    <div
      data-click-trigger="1"
      className={cn(
        showArrow
          ? null
          : {
              "scroll-gradient-right": side == "right" && progress < 100,
              "scroll-gradient-down": side == "bottom" && progress < 100,
            },
        className,
      )}
    >
      {showArrow && progress > initialProgress && (
        <span
          onClick={scrollLeft}
          className={cn(
            "absolute w-[30px] flex justify-end items-center h-[45px] z-10 bg-gradient-to-r from-black via-black",
            arrowContainerClassName,
            arrowContainerLeftClassName,
          )}
        >
          <Button
            variant="ghost"
            className="w-auto p-0 focus-visible:ring-0 hover:bg-transparent hover:text-gray-200 text-gray-400 transition-all duration-300"
          >
            <ChevronLeftIcon />
          </Button>
        </span>
      )}

      {showArrow && progress < 100 && (
        <span
          onClick={scrollRight}
          className={cn(
            "absolute w-[30px] flex right-0 justify-end items-center h-[45px] z-10 bg-gradient-to-l from-black via-black",
            arrowContainerClassName,
            arrowContainerRightClassName,
          )}
        >
          <Button
            variant="ghost"
            className="w-auto p-0 focus-visible:ring-0 hover:bg-transparent hover:text-gray-200 text-gray-400 transition-all duration-300"
          >
            <ChevronRightIcon />
          </Button>
        </span>
      )}

      {side == "bottom" && (
        <span
          className={cn(
            "hidden select-none grad-indicator text-center font-extralight text-xs text-gray-400 pt-2",
            {
              hidden: progress == 100,
            },
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
