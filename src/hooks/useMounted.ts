import { useEffect, useRef } from "react";

export default function useMounted(delay = 0) {
  const mounted = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      mounted.current = true;
    }, delay);

    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted.current;
}
