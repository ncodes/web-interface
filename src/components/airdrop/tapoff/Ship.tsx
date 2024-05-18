import { motion } from "framer-motion";
import random from "random";
import { ReactNode, Ref, useEffect, useRef, useState } from "react";
import useStore from "../../../hooks/store/useStore.ts";
import { FiringCoins } from "./FiringCoins.tsx";

export function Ship({
  fire,
  onFireStop,
  firedCoins,
  rank,
  showTapToFireNotice,
  firing,
  shipRef,
  overheatLevel,
  tapIncrement,
}: {
  rank: string;
  fire: () => void;
  onFireStop: () => void;
  firedCoins: ReactNode[];
  showTapToFireNotice: boolean;
  firing: boolean;
  shipRef: Ref<any>;
  overheatLevel: number;
  tapIncrement: number;
}) {
  const containerRef = useRef<any>();
  const mousePos = useStore((state) => state.mousePosition);
  const [incrIndicators, setIncrIndicators] = useState<ReactNode[]>([]);

  useEffect(() => {
    if (firedCoins.length > 0) return;
    setIncrIndicators([]);
  }, [firedCoins]);

  function renderTapIncrementIndicator() {
    if (overheatLevel <= 0) return;
    const el = (
      <IncrIndicator
        top={mousePos.y - 10}
        left={mousePos.x}
        tapIncrement={tapIncrement}
      />
    );
    setIncrIndicators(
      incrIndicators.length < 100 ? [...incrIndicators, el] : [el],
    );
  }

  return (
    <div ref={containerRef} className="[touch-action:manipulation]">
      {incrIndicators.map((indicator, i) => (
        <div key={i}>{indicator}</div>
      ))}
      <motion.div
        className="flex justify-center w-[250px] mx-auto"
        animate={{
          x: [null, 20, 0],
          rotate: [null, -5, 0, 5, 0, null] as any,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        onClick={renderTapIncrementIndicator}
      >
        {rank && (
          <div
            className="flex text-center [-webkit-tap-highlight-color:transparent] [touch-action:manipulation] border-none ring-0 active:bottom-0 focus-visible:ring-0 select-none flex-col h-auto hover:bg-transparent xanimate-bounce hover:animate-none duration-1000"
            onMouseDown={fire}
            onMouseUp={onFireStop}
          >
            {showTapToFireNotice && !firing && (
              <div className="relative w-full">
                <div className="w-full animate-pulse font-jersey20 z-20 text-xl text-white absolute -top-10">
                  Tap to Fire
                </div>
              </div>
            )}
            <div className="flex justify-center" ref={shipRef}>
              <FiringCoins coins={firedCoins} />
            </div>
            <img
              src={`/images/rank-ships/${rank}.png`}
              className="h-[200px] select-none"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}

function IncrIndicator({
  top,
  left,
  tapIncrement,
}: {
  top: number;
  left: number;
  tapIncrement: number;
}) {
  function randomPoint(min: number, max: number) {
    return random.float(min, max);
  }

  return (
    <motion.div
      initial={{ left: left, top: top }}
      animate={{
        left: random.choice([
          randomPoint(left + 50, left + -200),
          randomPoint(left + 50, left + 200),
        ]),
        top: random.choice([
          randomPoint(top + 50, top + -300),
          randomPoint(top + 50, top + 300),
        ]),
        opacity: [1, 0.5, 0],
        zIndex: 0,
        transition: {
          duration: 2,
        },
      }}
      className="fixed break w-10 h-10 pointer-events-none text-2xl text-gray-200 font-jersey20 rounded-full flex justify-center items-center"
    >
      +{tapIncrement}
    </motion.div>
  );
}
