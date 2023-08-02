import { cn } from "../libs/helpers.ts";
import { ConnectWalletButton } from "./ConnectWalletButton.tsx";
import useConnector from "../hooks/connectors/useConnector.tsx";
import { Link, useLocation } from "react-router-dom";

type NavPageLinkProps = {
  iconFile: string;
  label: string;
  alt?: string;
  active?: boolean;
  to?: string;
};

function NavPageLink(props: NavPageLinkProps) {
  return (
    <Link to={props.to || "#"}>
      <div
        className={cn(
          "flex w-[200px] space-x-3 hover:bg-gray-900 transition-all delay-100 duration-300 hover:cursor-pointer hover:rounded-full p-2 xl:p-3 px-4 pr-8 hover:scale-x-105",
          {
            "font-light text-gray-300 hover:text-gray-200": !props.active,
            "text-white scale-x-105": props.active,
          }
        )}
      >
        <span className="w-[24px] flex justify-center items-center">
          <img
            src={`/images/icons/${props.iconFile}`}
            alt={props.alt || props.label}
            className=""
          />
        </span>
        <span className={cn("text-[20px] xl:text-[21px] tracking-wide", {})}>
          {props.label}
        </span>
      </div>
    </Link>
  );
}

export function Navigation() {
  const { connected } = useConnector();
  const { pathname } = useLocation();

  return (
    <nav className="-ml-5 border-b border-b-gray-900 xl:border-b-0 pb-4 xl:pb-0 pl-8">
      <ul className="mt-3 xl:mt-[50px] flex flex-col xl:space-y-3">
        <li>
          <NavPageLink
            iconFile="timeline.svg"
            label="Timeline"
            active={pathname == ""}
            to="/"
          />
        </li>
        <li>
          <NavPageLink
            iconFile="market.svg"
            label="Markets"
            active={pathname.match("/market") != null}
            to="/markets"
          />
        </li>
        <li>
          <NavPageLink
            iconFile="liquidity.svg"
            label="Liquidity"
            active={pathname.match("/liquidit(y|ies)") != null}
            to="/liquidities"
          />
        </li>
        <li>
          <NavPageLink
            iconFile="liquidity.svg"
            label="Swaps"
            active={pathname.match("/swap(s|)") != null}
            to="/swaps"
          />
        </li>
        <li>
          <NavPageLink
            iconFile="disputes.svg"
            label="Disputes"
            active={pathname.match("/dispute") != null}
            to="/disputes"
          />
        </li>
        <li>
          <NavPageLink
            iconFile="mediation.svg"
            label="Mediation"
            active={pathname.match("/mediation") != null}
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
