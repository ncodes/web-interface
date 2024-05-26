import { useLocation } from "react-router-dom";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import useStore from "../hooks/store/useStore.ts";
import { cn } from "../libs/utils.ts";
import { ConnectWalletButton } from "./ConnectWalletButton.tsx";
import { LanguageSelector } from "./LanguageSelector.tsx";
import { MobileMenuActivator } from "./MobileMenuActivator.tsx";
import { NavHelpButton } from "./NavHelpButton.tsx";
import { NavNotificationButton } from "./NavNotificationButton.tsx";
import { NavSearchButton } from "./NavSearchButton.tsx";
import { NetworkSelector } from "./NetworkSelector.tsx";
import { InputActivatedSearchBox } from "./search/InputActivatedSearchBox.tsx";

export function Header(props: { onClick: () => void; height?: string }) {
  const { connected } = useConnectorContext();
  const user = useStore((state) => state.user);
  const isVirtualWallet = useStore((state) => state.isVirtualWallet);
  const isTelegramBot = useStore((state) => state.isTelegramBot);
  const loc = useLocation();

  if (isTelegramBot && loc.pathname.includes("/tapwar")) return null;

  return (
    <header
      className={cn("flex items-center", props.height, {
        "p-2": isTelegramBot,
      })}
    >
      <MobileMenuActivator onClick={props.onClick} />
      <InputActivatedSearchBox />
      <div className="flex-1 flex justify-end items-center gap-4">
        <NavSearchButton />
        <LanguageSelector />
        <NavHelpButton />
        {connected && !!user && <NavNotificationButton />}
        {connected && <NetworkSelector />}
        {!isVirtualWallet && (
          <>
            <ConnectWalletButton className="hidden lg:block max-[300px] relative " />
            <ConnectWalletButton className="lg:hidden" label="Connect" />
          </>
        )}
      </div>
    </header>
  );
}
