import { ReactNode } from "react";

export function FiringCoins({ coins }: { coins: ReactNode[] }) {
  return (
    <>
      {coins.map((coin) => (
        <>{coin}</>
      ))}
    </>
  );
}
