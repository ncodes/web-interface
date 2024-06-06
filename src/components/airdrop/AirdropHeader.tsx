import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useStore from "../../hooks/store/useStore.ts";
import { formatToHighDenom, numberToOrdinal } from "../../libs/helpers.ts";
import { ToolTip } from "../ToolTip.tsx";

export function AirdropHeader() {
  const user = useStore((store) => store.user);
  const { address } = useConnectorContext();

  if (!address) return null;

  return (
    <div className="border-b bg-airdropHeader2 md:bg-airdropHeader3 bg-right-bottom lg:bg-right lg:bg-airdropHeader bg-cover border-gray-900 flex flex-col md:flex-row justify-between items-center md:items-start p-5">
      <span className="text-3xl tracking-wider font-semibold font-jersey10 inline-block ml-2">
        Dashboard
      </span>
      <ul className="flex justify-center items-center flex-col md:flex-row gap-2 md:gap-7 mt-2 md:mt-1">
        <li className="flex gap-2 items-center font-light tracking-wider">
          <img src="/images/airdrop-icons/point-star.svg" className="w-6" />
          <span className="flex items-center text-lg md:text-2xl gap-0.5 font-jersey25">
            <span>
              {user?.points ?? "0"}{" "}
              <span className="text-gray-400">
                ({numberToOrdinal(user?.rank)})
              </span>
            </span>
            <span className="text-gray-500">
              <ToolTip tip="Your total points and rank">
                <InfoCircledIcon width="20px" />
              </ToolTip>
            </span>
          </span>
        </li>

        <li className="flex gap-2 items-center font-light tracking-wider">
          <img src="/images/airdrop-icons/coin.svg" className="w-6" />
          <span className="flex items-center text-lg md:text-2xl gap-0.5 font-jersey25">
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
