import { memo } from "react";
import useImagePreloader from "../../../hooks/useImagePreloader";
import { imageList } from "./contants";

export const GameBackgroundImage = memo(function () {
  const { imagesPreloaded } = useImagePreloader(imageList);

  if (!imagesPreloaded) {
    return null;
  }

  return (
    <div className=" bg-black z-0 w-full h-full opacity-60 overflow-hidden absolute rounded-b-3xl bg-gamebg bg-center bg-no-repeat bg-cover">
      <img
        src="/images/game/planet1.svg"
        className="w-[100px] absolute left-[10%] top-[1%]"
      />
      <img
        src="/images/game/planet2.svg"
        className="w-[100px] absolute left-[80%] top-[3%]"
      />
      <img
        src="/images/game/planet3.svg"
        className="w-[150px] absolute left-[80%] top-[30%] md:left-[90%] md:top-[30%]"
      />
      <img
        src="/images/game/planet4.svg"
        className="w-[100px] absolute -left-[15%] top-[40%] md:-left-[4%] md:top-[40%]"
      />
      <img
        src="/images/game/planet5.svg"
        className="w-[100px] absolute left-[20%] top-[70%]"
      />
      <img
        src="/images/game/planet6.svg"
        className="w-[100px] absolute left-[90%] top-[60%]"
      />
      <img
        src="/images/game/planet7.svg"
        className="w-[70px] absolute -left-[3%] top-[80%]"
      />
      <img
        src="/images/game/planet8.svg"
        className="w-[150px] absolute left-[42%] top-[92%]"
      />
      <img
        src="/images/game/planet9.svg"
        className="w-[100px] absolute left-[92%] top-[90%]"
      />
    </div>
  );
});
