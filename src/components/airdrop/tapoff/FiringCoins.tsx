import { ReactNode } from "react";

export function FiringCoins({ coins }: { coins: ReactNode[] }) {
  return (
    <>
      {coins.map((coin, i) => (
        <div key={`k${i}`}>{coin}</div>
      ))}
    </>
  );
}
