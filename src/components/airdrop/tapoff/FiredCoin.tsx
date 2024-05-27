import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import random from "random";
import { useEffect, useState } from "react";

export function FiredCoin({
  ship,
  target,
  fire,
}: {
  ship: any;
  target: any;
  fire: boolean;
}) {
  const [done, setDone] = useState(false);
  const opacity = useMotionValue(0);
  const [targetTop, setTargetTop] = useState(0);
  const coinImages = [
    "coin.png",
    "coin2.png",
    "coin3.png",
    "coin4.png",
    "coin5.png",
    "coin6.png",
  ];

  useEffect(() => {
    const tapCounterRect = target.current.getBoundingClientRect();
    const shipRect = ship.current.getBoundingClientRect();
    const targetTop = shipRect.top - tapCounterRect.top;

    if (fire) {
      setTargetTop(targetTop);
    }
  }, [fire]);

  useMotionValueEvent(opacity, "animationComplete", () => {
    setDone(opacity.get() == 0);
  });

  if (done) {
    return null;
  }

  return (
    <div className="absolute">
      <motion.div
        id="coin-anim"
        initial={false}
        style={{ opacity }}
        animate={{
          y: -targetTop,
          x: [0, random.int(-40, 40), random.int(-50, 50), random.int(-60, 60)],
          opacity: [100, 70, 50, 30, 10, 0],
        }}
        transition={{
          ease: "easeOut",
        }}
      >
        <img src={`/images/${random.choice(coinImages)}`} width="30px" />
      </motion.div>
    </div>
  );
}
