import { useEffect, useState } from "react";

export default function useMounted(delay = 0) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, delay);

    return () => {
      setMounted(false);
    };
  }, []);

  return mounted;
}
