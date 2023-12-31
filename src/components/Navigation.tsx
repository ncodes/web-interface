import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useOfferService } from "../hooks/services/backend/useOfferService.ts";
import { ConnectWalletButton } from "./ConnectWalletButton.tsx";
import { IconExchange } from "./icons/IconExchange.tsx";
import IconOffer from "./icons/IconOffer.tsx";

import { AwardIcon } from "lucide-react";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import useStore from "../hooks/store/useStore.ts";
import { NavPageLink } from "./NavPageLink.tsx";
import IconCoinStack2 from "./icons/IconCoinStack2.tsx";
import IconDispute from "./icons/IconDispute.tsx";
import IconMarketCoin from "./icons/IconMarketCoin.tsx";
import IconMediation from "./icons/IconMediation.tsx";
import IconTimeline from "./icons/IconTimeline.tsx";

export function Navigation() {
  const { connected, address, getChainInfo } = useConnectorContext();
  const { pathname } = useLocation();
  const { countUnread } = useOfferService();
  const user = useStore((state) => state.user);
  const unreadOfferCount = useQuery({
    queryKey: ["countUnreadOffer", { network: getChainInfo().queryName }],
    queryFn: countUnread,
    enabled: !!address && !!user,
  });

  return (
    <nav className="-ml-5 border-b border-b-gray-900 xl:border-b-0 pb-4 xl:pb-0 pl-8">
      <ul className="mt-3 xl:mt-[50px] flex flex-col xl:space-y-3">
        <li>
          <NavPageLink
            iconClassName="w-[25px]"
            icon={<IconTimeline width="20" />}
            label="Timeline"
            active={pathname.match("^/$") != null}
            to="/"
          />
        </li>
        <li>
          <NavPageLink
            iconClassName="w-[25px]"
            label="Markets"
            icon={<IconMarketCoin width="25" />}
            active={pathname.match("^/(my/)?market") != null}
            to="/markets"
          />
        </li>
        <li>
          <NavPageLink
            iconClassName="w-[25px]"
            label="Liquidity"
            active={pathname.match("^/(my/)?liquidit(y|ies)") != null}
            icon={<IconCoinStack2 width="25" />}
            to="/my/liquidity"
          />
        </li>
        <li>
          <NavPageLink
            iconClassName="w-[25px]"
            icon={<IconExchange width="25" />}
            label="Swaps"
            active={pathname.match("^/(my/)?swap(s|)") != null}
            to="/my/swaps"
          />
        </li>
        <li>
          <NavPageLink
            iconClassName="w-[25px]"
            icon={<IconOffer width="25" />}
            label="Offers"
            active={pathname.match("^/(my/)?offer(s|)") != null}
            to="/my/offers"
            countBadge={
              unreadOfferCount.data &&
              unreadOfferCount.data.asOfferer +
                unreadOfferCount.data.asProvider >
                0
                ? unreadOfferCount.data.asOfferer +
                  unreadOfferCount.data.asProvider
                : 0
            }
          />
        </li>
        <li>
          <NavPageLink
            iconClassName="relative w-[25px] left-1"
            icon={<IconDispute width="40" />}
            label="Disputes"
            active={pathname.match("^/my/dispute") != null}
            to="/my/disputes"
          />
        </li>
        <li>
          <NavPageLink
            icon={<IconMediation width="40" />}
            iconClassName="w-[25px]"
            label="Mediation"
            active={pathname.match("^/(my/)?tickets") != null}
            to="/my/tickets"
          />
        </li>
        <li>
          <NavPageLink
            icon={<AwardIcon width="40" />}
            iconClassName="w-[25px]"
            label="Points"
            active={pathname.match("^/points|referrals") != null}
            inactiveIconClassName="text-orange-500"
            inactiveClassName="text-orange-500 hover:text-orange-500"
            activeClassName="text-gray-100 text-orange-500"
            activeIconClassName="text-orange-500"
            to="/points"
          />
        </li>
      </ul>
      <div className="hidden xl:block mt-[30px] w-[240px]">
        {!connected && <ConnectWalletButton />}
      </div>
    </nav>
  );
}
