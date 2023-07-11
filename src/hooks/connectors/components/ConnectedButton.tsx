import Avatar from "../../../components/avatar/Avatar";
import { AvatarSize } from "../../../components/avatar/useAvatar";
import { useAccount, useBalance } from "wagmi";
import {
  formatMoney,
  shortenAddress,
  shortenAddress2,
} from "../../../libs/helpers.ts";
import ModalMyWallet from "../../../components/modals/ModalMyWallet.tsx";
import { useEffect, useState } from "react";

// Component for rendering amount and symbol
function Amount(props: { balance: string; symbol: string }) {
  return (
    <span className="flex gap-2">
      <span className="font-medium text-gray-900">
        {formatMoney(props.balance)}
      </span>
      <span>{props.symbol}</span>
    </span>
  );
}

interface ConnectedProps {
  openWalletModal?: () => void;
}

export const ConnectedButton = ({}: { props: ConnectedProps }) => {
  const [openMyWalletModal, setOpenMyWalletModal] = useState(false);
  const { address } = useAccount();
  const balance = useBalance({
    address,
    watch: true,
  });

  useEffect(() => {}, [openMyWalletModal]);

  return (
    <div>
      <div
        className="flex [&>*]:cursor-pointer items-center justify-between  bg-chinese-green rounded-full hover:shadow-[0px_11px_24px_-6px_rgba(131,164,34,1)] gap-3 xxs:pr-1"
        onClick={() => {
          setOpenMyWalletModal(true);
        }}
      >
        <p
          className="w-full xxs:w-auto max-w-[120px] overflow-y-scroll py-[8px] px-[12px] text-[#001029] font-normal text-[14px]
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
        <div className="hidden xxs:block">
          <Avatar size={AvatarSize.Small} randomStr={address as string} />
        </div>
      </div>
      <ModalMyWallet
        open={openMyWalletModal}
        onOpenChange={(open) => {
          setOpenMyWalletModal(open);
        }}
      />
    </div>
  );
};
