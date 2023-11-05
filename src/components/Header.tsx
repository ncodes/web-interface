import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
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

  return (
    <header className={cn("flex items-center", props.height)}>
      <MobileMenuActivator onClick={props.onClick} />
      <InputActivatedSearchBox />
      <div className="flex-1 flex justify-end items-center gap-4">
        <NavSearchButton />
        <LanguageSelector />
        <NavHelpButton />
        {connected && <NavNotificationButton />}
        {connected && <NetworkSelector />}
        <ConnectWalletButton className="hidden lg:block max-[300px] relative " />
        <ConnectWalletButton
          className="lg:hidden md:min-w-[120px]"
          label="Connect"
        />
      </div>
    </header>
  );
}
