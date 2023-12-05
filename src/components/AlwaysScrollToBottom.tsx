import { RefObject, useEffect } from "react";

export const AlwaysScrollToBottom = ({
  scrollRef,
}: {
  scrollRef?: RefObject<HTMLDivElement>;
}) => {
  useEffect(() => scrollRef?.current?.scrollIntoView());
  return <div ref={scrollRef} />;
};
