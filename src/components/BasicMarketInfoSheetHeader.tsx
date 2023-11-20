import CopyToClipboard from "react-copy-to-clipboard";
import { shortenAddress } from "../libs/helpers.ts";
import { PairAvatar } from "./avatar/PairAvatar.tsx";
import IconCopyFilled from "./icons/IconCopyFilled.tsx";

export function BasicMarketInfoSheetHeader({ market }: { market: Market }) {
  return (
    <div className="flex w-full px-5 py-2 items-center bg-card-background border-b border-gray-800">
      <PairAvatar
        base="BTC"
        quote="UNI"
        baseSrc={market.baseLogo}
        quoteSrc={market.quoteLogo}
        size="sm"
        noBorder={true}
      />
      <span className="flex ml-1">
        {market.base}
        <span className="text-gray-500 inline-block mx-1">/</span>
        {market.quote}
      </span>
      <span className="flex-1 font-light gap-2 text-xs items-center text-gray-400 flex justify-end">
        <span>ID: {shortenAddress(market.address)}</span>
        <span className="active:animate-ping">
          <CopyToClipboard text={market.address}>
            <IconCopyFilled
              width="12"
              className="hover:text-chinese-green cursor-pointer transition-all duration-300"
            />
          </CopyToClipboard>
        </span>
      </span>
    </div>
  );
}
