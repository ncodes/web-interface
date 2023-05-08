import { useEffect, useState } from 'react';

/**
 * Hook to get network status information
 */
export default function useNetStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const online = () => {
      setOnline(true);
    };

    const offline = () => {
      setOnline(false);
    };

    window.addEventListener('online', online);
    window.addEventListener('offline', offline);

    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, []);

  return { online };
}
