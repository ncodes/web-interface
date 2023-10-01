import { cn } from "../libs/helpers.ts";
import { ConnectWalletButton } from "./ConnectWalletButton.tsx";
import { Link, useLocation } from "react-router-dom";
import { IconExchange } from "./icons/IconExchange.tsx";
import IconOffer from "./icons/IconOffer.tsx";
import { useQuery } from "@tanstack/react-query";
import { useOfferService } from "../hooks/services/backend/useOfferService.ts";

import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";

type NavPageLinkProps = {
  iconFile?: string;
  icon?: React.ReactNode;
  label: string;
  alt?: string;
  active?: boolean;
  to?: string;
  countBadge?: number;
};

function NavPageLink(props: NavPageLinkProps) {
  return (
    <Link to={props.to || "#"}>
      <div
        className={cn(
          "flex w-[200px] space-x-3 items-center hover:bg-gray-900 transition-all delay-100 duration-300 hover:cursor-pointer hover:rounded-full p-2 xl:p-3 px-4 pr-8 hover:scale-x-105",
          {
            "font-light text-gray-300 hover:text-gray-200": !props.active,
            "text-white scale-x-105": props.active,
          }
        )}
      >
        <span className="w-[24px] flex justify-center items-center">
          {!props.icon && (
            <img
              src={`/images/icons/${props.iconFile}`}
              alt={props.alt || props.label}
              className=""
            />
          )}
          {props.icon && props.icon}
        </span>
        <span className={cn("text-[20px] xl:text-[21px] tracking-wide", {})}>
          {props.label}
        </span>
        {props.countBadge != undefined && props.countBadge > 0 && (
          <span className="rounded-full relative top-[1px] h-[20px] min-w-[20px] px-[5px] leading-[20px] flex justify-center items-center  bg-red-600 text-[10px]">
            {props.countBadge}
          </span>
        )}
      </div>
    </Link>
  );
}

export function Navigation() {
  const { connected, address, getChainInfo } = useConnectorContext();
  const { pathname } = useLocation();
  const { countUnread } = useOfferService();
  const unreadOfferCount = useQuery({
    queryKey: ["countUnreadOffer", { network: getChainInfo().queryName }],
    queryFn: countUnread,
    enabled: !!address,
  });

  return (
    <nav className="-ml-5 border-b border-b-gray-900 xl:border-b-0 pb-4 xl:pb-0 pl-8">
      <ul className="mt-3 xl:mt-[50px] flex flex-col xl:space-y-3">
        <li>
          <NavPageLink
            iconFile="timeline.svg"
            label="Timeline"
            active={pathname.match("^/$") != null}
            to="/"
          />
        </li>
        <li>
          <NavPageLink
            iconFile="market.svg"
            label="Markets"
            active={pathname.match("^/market") != null}
            to="/markets"
          />
        </li>
        <li>
          <NavPageLink
            iconFile="liquidity.svg"
            label="Liquidity"
            active={pathname.match("^/liquidity") != null}
            to="/liquidity/owned"
          />
        </li>
        <li>
          <NavPageLink
            icon={<IconExchange />}
            label="Swaps"
            active={pathname.match("^/swap(s|)") != null}
            to="/swaps/owned"
          />
        </li>
        <li>
          <NavPageLink
            icon={<IconOffer />}
            label="Offers"
            active={pathname.match("^/offer(s|)") != null}
            to="/offers"
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
            iconFile="disputes.svg"
            label="Disputes"
            active={pathname.match("^/dispute") != null}
            to="/disputes"
          />
        </li>
        <li>
          <NavPageLink
            iconFile="mediation.svg"
            label="Mediation"
            active={pathname.match("^/mediation") != null}
            to="/mediation"
          />
        </li>
      </ul>
      <div className="hidden xl:block mt-[30px] w-[240px]">
        {!connected && <ConnectWalletButton />}
      </div>
    </nav>
  );
}
