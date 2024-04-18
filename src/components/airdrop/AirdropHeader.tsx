import { InfoCircledIcon } from "@radix-ui/react-icons";
import useStore from "../../hooks/store/useStore.ts";
import { formatToHighDenom } from "../../libs/helpers.ts";
import { ToolTip } from "../ToolTip.tsx";

export function AirdropHeader() {
  const user = useStore((store) => store.user);

  return (
    <div className="border-b border-gray-800 flex flex-col md:flex-row justify-between p-5">
      <span className="text-xl tracking-wider font-bold">Airdrop Season</span>
      <ul className="flex gap-7 mt-2 md:mt-0">
        <li className="flex gap-2 items-center font-light tracking-wider">
          <img src="/images/airdrop-icons/point-star.svg" className="w-6" />
          <span className="flex items-center text-lg gap-0.5">
            <span>{user?.points ?? "0"}</span>
            <span className="text-gray-500">
              <ToolTip tip="Your total points">
                <InfoCircledIcon width="20px" />
              </ToolTip>
            </span>
          </span>
        </li>

        <li className="flex gap-2 items-center font-light tracking-wider">
          <img src="/images/airdrop-icons/coin.svg" className="w-6" />
          <span className="flex items-center text-lg gap-0.5">
            <span>
              {formatToHighDenom(user?.totalUnclaimedAlloc || "0", 18)}
            </span>
            <span className="text-gray-500">
              <ToolTip tip="Your total $JOIN allocation">
                <InfoCircledIcon width="20px" />
              </ToolTip>
            </span>
          </span>
        </li>
      </ul>
    </div>
  );
}
