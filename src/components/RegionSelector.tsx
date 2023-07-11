export function RegionSelector() {
  return (
    <div className="pr-2 text-lg  bg-input rounded-full flex pl-4 space-x-2 hover:cursor-pointer hover:bg-input/90 transition-all ease-in-out delay-100 duration-150 [&>span]:py-1">
      <span className="font-medium mt-[1px]">UK</span>
      <span className="mt-[2px]">🇬🇧</span>
      <span className="pl-1 pt-[2px] border-input-separator border-l">
        <img
          src="/images/icons/down-arrow.svg"
          alt="down"
          className="mt-[2px]"
        />
      </span>
    </div>
  );
}
