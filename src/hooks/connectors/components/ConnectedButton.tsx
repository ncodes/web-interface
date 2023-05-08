import { formatMoney, shortenAddress } from '../../../libs/utils';
import Avatar from '../../../components/avatar/Avatar';
import { AvatarSize } from '../../../components/avatar/useAvatar';
import { useAccount, useBalance } from 'wagmi';

// Component for rendering amount and symbol
function Amount(props: { balance: string; symbol: string }) {
  return (
    <span className="flex gap-2">
      <span className="font-['Mitr'] font-semibold text-gray-900">
        {formatMoney(props.balance)}
      </span>
      <span>{props.symbol}</span>
    </span>
  );
}

interface ConnectedProps {
  openModal?: () => void;
}

export const ConnectedButton = (props: ConnectedProps) => {
  const { address } = useAccount();
  const balance = useBalance({
    address,
    watch: true,
  });

  return (
    <div
      onClick={props.openModal}
      className="flex items-center justify-between sm:pr-2 bg-chinese-green rounded-full cursor-pointer hover:shadow-[0px_11px_24px_-6px_rgba(131,164,34,1)]"
      style={{ paddingRight: '5px', gap: '10px' }}
    >
      <p
        className="py-[8px] px-[12px] font-mitr text-[#001029] font-semibold text-[14px]
        tracking-[0.19px] bg-[#8DB90C] rounded-full"
      >
        <Amount
          balance={balance?.data?.formatted || '0'}
          symbol={balance?.data?.symbol || ''}
        />
      </p>
      <p className="address mx-[14px] font-mitr font-medium text-[14px] tracking-[0.22px] text-black">
        {shortenAddress(address as string)}
      </p>
      <div className="relative">
        <Avatar size={AvatarSize.Small} randomStr={address as string} />
      </div>
    </div>
  );
};
