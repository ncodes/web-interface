import EmojiAvatar from "../../../components/avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../../../components/avatar/useAvatar";
import { useAccount, useBalance } from "wagmi";
import {
  formatMoney,
  shortenAddress,
  shortenAddress2,
} from "../../../libs/helpers.ts";
import { SettingsSheet } from "../../../components/SettingsSheet.tsx";
import useStore from "../../store/useStore.ts";

// Component for rendering amount and symbol
function Amount(props: { balance: string; symbol: string }) {
  return (
    <span className="flex gap-2">
      <span className="font-medium text-gray-900 overflow-auto scrollbar-hide">
        {formatMoney(props.balance)}
      </span>
      <span className="hidden xxs:inline">{props.symbol}</span>
    </span>
  );
}

interface ConnectedProps {
  openWalletModal?: () => void;
}

export const ConnectedButton = (props: ConnectedProps) => {
  const { address } = useAccount();
  const balance = useBalance({
    address,
    watch: true,
  });
  const toggleSettingsSheetOpen = useStore(
    (state) => state.toggleSettingsSheetOpen
  );

  return (
    <div>
      <div
        className="flex [&>*]:cursor-pointer items-center justify-between  bg-chinese-green rounded-full hover:shadow-[0px_11px_24px_-6px_rgba(131,164,34,1)] gap-3 xs:pr-1"
        onClick={() => {
          toggleSettingsSheetOpen && toggleSettingsSheetOpen();
        }}
      >
        <p
          className="hidden xs:inline max-w-[80px] xxs:max-w-[120px] py-[8px] px-[12px] text-[#001029] font-normal text-[14px]
        tracking-[0.19px] bg-[#8DB90C] rounded-full"
        >
          <Amount
            balance={balance?.data?.formatted || "0"}
            symbol={balance?.data?.symbol || ""}
          />
        </p>
        <p className="hidden lg:inline-block address font-normal text-[14px] tracking-[0.22px] text-black">
          <span className="hidden lg:inline-block">
            {shortenAddress(address as string)}
          </span>
          <span className="lg:hidden">
            {shortenAddress2(address as string)}
          </span>
        </p>
        <div>
          <EmojiAvatar size={AvatarSize.Small} randomStr={address as string} />
        </div>
      </div>
      <div className="absolute">
        <SettingsSheet openWalletManager={props.openWalletModal} />
      </div>
    </div>
  );
};
