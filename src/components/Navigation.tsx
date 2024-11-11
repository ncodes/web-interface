import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useOfferService } from "../hooks/services/backend/useOfferService.ts";
import { ConnectWalletButton } from "./ConnectWalletButton.tsx";
import { IconExchange } from "./icons/IconExchange.tsx";
import IconOffer from "./icons/IconOffer.tsx";

import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import useStore from "../hooks/store/useStore.ts";
import { useSession } from "../hooks/useSession.ts";
import { NavPageLink } from "./NavPageLink.tsx";
import IconCoinStack2 from "./icons/IconCoinStack2.tsx";
import IconDispute from "./icons/IconDispute.tsx";
import IconFreebros from "./icons/IconFreebros.tsx";
import IconMarketCoin from "./icons/IconMarketCoin.tsx";
import IconMediation from "./icons/IconMediation.tsx";

export function Navigation() {
  const { connected, address, getChainInfo } = useConnectorContext();
  const { pathname } = useLocation();
  const { countUnread } = useOfferService();
  const { hasAccessToken } = useSession();
  const isTelegramBot = useStore((state) => state.isTelegramBot);
  const unreadOfferCount = useQuery({
    queryKey: ["countUnreadOffer", { network: getChainInfo().queryName }],
    queryFn: countUnread,
    enabled: !!address && hasAccessToken(address),
  });

  return (
    <nav className="-ml-5 border-b border-b-gray-900 xl:border-b-0 pb-4 xl:pb-0 pl-8">
      <ul className="mt-3 xl:mt-[60px] flex flex-col xl:space-y-2">
        {/* <li>
          <NavPageLink
            iconClassName="w-[25px]"
            icon={<IconTimeline width="20" />}
            label="Timeline"
            active={pathname.match("^/$") != null}
            to="/"
          />
        </li> */}
        {!isTelegramBot && (
          <>
            <li>
              <NavPageLink
                iconClassName="w-[25px]"
                label="Markets"
                labelClassName="font-silkscreen tracking-wider"
                icon={<IconMarketCoin width="25" />}
                active={pathname.match("^(/(my/)?market)|(/$)") != null}
                to="/"
              />
            </li>
            <li>
              <NavPageLink
                iconClassName="w-[25px]"
                label="Liquidity"
                labelClassName="font-silkscreen tracking-wider"
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
                labelClassName="font-silkscreen tracking-wider"
                active={pathname.match("^/(my/)?swap(s|)") != null}
                to="/my/swaps"
              />
            </li>
            <li>
              <NavPageLink
                iconClassName="w-[25px]"
                icon={<IconOffer width="25" />}
                label="Offers"
                labelClassName="font-silkscreen tracking-wider"
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
                labelClassName="font-silkscreen tracking-wider"
                active={pathname.match("^/my/dispute") != null}
                to="/my/disputes"
              />
            </li>
            <li>
              <NavPageLink
                icon={<IconMediation width="40" />}
                iconClassName="w-[25px]"
                labelClassName="font-silkscreen tracking-wider"
                label="Mediation"
                active={pathname.match("^/(my/)?tickets") != null}
                to="/my/tickets"
              />
            </li>
          </>
        )}
        <li>
          <NavPageLink
            icon={<IconFreebros width="40" />}
            iconClassName="w-[35px] relative -left-1"
            label="DexDrop"
            labelClassName="relative -left-2 font-silkscreen tracking-wider"
            active={
              pathname.match("^/points|referrals|energon|airdrop|dexdrop") !=
              null
            }
            inactiveIconClassName=""
            inactiveClassName=" hover:text-yellow-500"
            activeClassName="text-gray-100 text-white"
            activeIconClassName="text-yellow-500"
            to="/dexdrop/claim"
          />
        </li>
        {/* <li>
          <NavPageLink
            icon={<IconSpaceship width="25" className="text-yellow-500" />}
            iconClassName="w-[25px]"
            labelClassName="font-silkscreen tracking-wider"
            label="TapWar"
            active={pathname.match("^/tapwar") != null}
            inactiveIconClassName="text-yellow-500"
            inactiveClassName=" hover:text-yellow-500"
            activeClassName="text-gray-100 text-white"
            activeIconClassName="text-yellow-500"
            to="/tapwar"
          />
        </li> */}
        {/* <li>
          <NavPageLink
            icon={<IconBattle width="25" className="text-yellow-500" />}
            iconClassName="w-[25px]"
            labelClassName="font-silkscreen tracking-wider"
            label="WarBond"
            active={pathname.match("^/warbond") != null}
            inactiveIconClassName="text-yellow-500"
            inactiveClassName=" hover:text-yellow-500"
            activeClassName="text-gray-100 text-white"
            activeIconClassName="text-yellow-500"
            to="/warbond"
          />
        </li> */}
      </ul>
      <div className="hidden mt-[30px] w-[240px] ">
        {!connected && <ConnectWalletButton />}
      </div>
    </nav>
  );
}
