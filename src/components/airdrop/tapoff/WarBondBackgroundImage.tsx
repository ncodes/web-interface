import { memo } from "react";
import useImagePreloader from "../../../hooks/useImagePreloader";

const imageList = [
  "/images/game/gamebg@1x.png",
  "/images/game/planet1.svg",
  "/images/game/planet2.svg",
  "/images/game/planet3.svg",
  "/images/game/planet4.svg",
  "/images/game/planet5.svg",
  "/images/game/planet6.svg",
  "/images/game/planet7.svg",
  "/images/game/planet8.svg",
  "/images/game/planet9.svg",
];

export const WarBondBackgroundImage = memo(function () {
  const { imagesPreloaded } = useImagePreloader(imageList);

  if (!imagesPreloaded) {
    return null;
  }

  return (
    <div className=" bg-black z-0 w-full h-full opacity-50 overflow-hidden absolute rounded-b-3xl bg-warbond bg-center bg-no-repeat bg-cover">
      <img
        src="/images/game/planet1.svg"
        className="w-[100px] absolute top-[45px] -left-[10%] md:top-[45px] md:-left-[5%] lg:-left-[2%] lg:top-[5%] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/planet9.svg"
        className="w-[100px] absolute left-[91%] top-[13%] lg:left-[95%] lg:top-[15%] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/planet8.svg"
        className="w-[150px] absolute -left-[23%] top-[70%] md:-left-[10%] md:top-[70%] lg:-left-[5%] lg:top-[65%] rotate-[65deg] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/planet4.svg"
        className="w-[80px] absolute hidden md:inline left-[10%] top-[75%] lg:left-[10%] lg:top-[70%] rotate-[65deg] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/planet7_2.svg"
        className="w-[250px] absolute -left-[40%] top-[81%] md:-left-[12%] md:top-[81%] lg:-left-[5%] lg:top-[81%] rotate-[65deg] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/planet10.svg"
        className="w-[500px] absolute left-[50%] top-[70%] md:left-[60%] md:top-[53%] lg:left-[80%] lg:top-[63%] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/planet6.svg"
        className="w-[80px] absolute left-[97%] top-[57%] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/planet5.svg"
        className="w-[130px] absolute left-[83%] top-[62%] lg:left-[83%] lg:top-[65%] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/planet2.svg"
        className="w-[100px] absolute left-[55%] top-[94%] md:left-[72%] md:top-[92%] lg:left-[75%] lg:top-[92%] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/planet11.svg"
        className="w-[200px] absolute left-[13%] top-[90%] scale-75 lg:scale-100"
      />

      <img
        src="/images/game/ship1.svg"
        className="w-[200px] hidden md:inline absolute left-[13%] top-[55%] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/ship2.svg"
        className="w-[150px] absolute left-[11%] top-[75%] md:left-[18%] md:top-[75%] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/ship3.svg"
        className="w-[150px] absolute hidden md:inline left-[30%] top-[85%] lg:left-[25%] lg:top-[85%] scale-75 lg:scale-100"
      />

      <img
        src="/images/game/ship1.svg"
        className="w-[200px] absolute hidden md:inline left-[60%] top-[54%] lg:left-[70%] lg:top-[59%] rotate-[140deg] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/ship2.svg"
        className="w-[150px] absolute hidden md:inline left-[58%] top-[75%] lg:left-[75%] lg:top-[75%] rotate-[160deg] scale-75 lg:scale-100"
      />
      <img
        src="/images/game/ship3.svg"
        className="w-[150px] absolute left-[55%] top-[69%] md:left-[55%] md:top-[85%] lg:left-[65%] lg:top-[85%] rotate-[160deg] md:rotate-[200deg] scale-75 lg:scale-100"
      />
    </div>
  );
});
