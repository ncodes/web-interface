import { cn } from "../libs/helpers.ts";
import { ConnectWalletButton } from "./ConnectWalletButton.tsx";
import useConnector from "../hooks/connectors/useConnector.tsx";

type NavPageLinkProps = {
  iconFile: string;
  label: string;
  alt?: string;
  active?: boolean;
};

function NavPageLink(props: NavPageLinkProps) {
  return (
    <div
      className={cn(
        "flex space-x-3 hover:bg-gray-900 transition-all delay-100 duration-300 hover:cursor-pointer hover:rounded-full p-2 xl:p-3 px-4 pr-8",
        {
          "font-light text-gray-300 hover:text-gray-200": !props.active,
          "text-white": props.active,
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
  );
}

export function Navigation() {
  const { connected } = useConnector();

  return (
    <nav className="-ml-5 border-b border-b-gray-900 xl:border-b-0 pb-4 xl:pb-0 pl-8">
      <ul className="mt-5 xs:mt-7 xl:mt-[50px] flex flex-col xl:space-y-3">
        <li className="flex space-x-5">
          <NavPageLink iconFile="timeline.svg" label="Timeline" active />
        </li>
        <li className="flex space-x-5">
          <NavPageLink iconFile="market.svg" label="Markets" />
        </li>
        <li className="flex space-x-5">
          <NavPageLink iconFile="liquidity.svg" label="Liquidity" />
        </li>
        <li className="flex space-x-5">
          <NavPageLink iconFile="offers.svg" label="Offers" />
        </li>
        <li className="flex space-x-5">
          <NavPageLink iconFile="messages.svg" label="Messages" />
        </li>
        <li className="flex space-x-5">
          <NavPageLink iconFile="disputes.svg" label="Disputes" />
        </li>
        <li className="flex space-x-5">
          <NavPageLink iconFile="mediation.svg" label="Mediation" />
        </li>
      </ul>
      <div className="hidden xl:block mt-[30px] w-[240px]">
        {!connected && <ConnectWalletButton />}
      </div>
    </nav>
  );
}
