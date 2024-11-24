import { Link } from "react-router-dom";

export function BuyBanner() {
  return (
    <Link
      to="/dexdrop/buy"
      className="hidden cursor-pointer hover:scale-[1.005] duration-[5000ms] transition-all animate-pulse hover:animate-none"
    >
      <button className="flex items-center justify-center">
        <img
          src="/images/dexdrop-buy-banner-xl.png"
          className="w-full h-auto hidden xl:block"
        />
        <img
          src="/images/dexdrop-buy-banner-lg.png"
          className="w-full h-auto lg:block hidden xl:hidden"
        />
        <img
          src="/images/dexdrop-buy-banner-md.png"
          className="w-full h-auto hidden md:block lg:hidden"
        />

        <img
          src="/images/dexdrop-buy-banner-sm.png"
          className="w-full h-auto md:hidden"
        />
      </button>
    </Link>
  );
}
