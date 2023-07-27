import { PairAvatar } from "./avatar/PairAvatar.tsx";
import IconCopyFilled from "./icons/IconCopyFilled.tsx";

export function BasicMarketInfoSheetHeader() {
  return (
    <div className="flex w-full px-5 py-2 items-center bg-card-background border-b border-gray-800">
      <PairAvatar
        base="BTC"
        quote="UNI"
        baseSrc="/images/icons/asset-icons/btc.svg"
        quoteSrc="/images/icons/asset-icons/uni.svg"
        className="[&>span>img]:w-[25px]"
        className2="[&>span>img]:w-[25px] !-ml-5"
      />
      <span className="-ml-1">BTC-UNI</span>
      <span className="flex-1 font-light gap-2 text-xs items-center text-gray-400 flex justify-end">
        <span>ID: 0xAbC</span>
        <span>
          <IconCopyFilled
            width="12"
            className="hover:text-chinese-green cursor-pointer transition-all duration-300"
          />
        </span>
      </span>
    </div>
  );
}
