import { createRef, useEffect } from "react";

export const AlwaysScrollToBottom = () => {
  const elementRef = createRef<HTMLDivElement>();
  useEffect(() => elementRef?.current?.scrollIntoView());
  return <div ref={elementRef} />;
};
