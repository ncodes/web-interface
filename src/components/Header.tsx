import { MobileMenuActivator } from "./MobileMenuActivator.tsx";
import { LanguageSelector } from "./LanguageSelector.tsx";
import { NavHelpButton } from "./NavHelpButton.tsx";
import { NavNotificationButton } from "./NavNotificationButton.tsx";
import { ConnectWalletButton } from "./ConnectWalletButton.tsx";
import { NetworkSelector } from "./NetworkSelector.tsx";
import { NavSearchButton } from "./NavSearchButton.tsx";
import { cn } from "../libs/utils.ts";
import { InputActivatedSearchBox } from "./search/InputActivatedSearchBox.tsx";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";

export function Header(props: { onClick: () => void; height?: string }) {
  const { connected } = useConnectorContext();

  return (
    <header className={cn("flex -mt-[1px]", props.height)}>
      <MobileMenuActivator onClick={props.onClick} />
      <InputActivatedSearchBox />
      <div className="flex-1 flex justify-end items-center gap-4 ">
        <NavSearchButton />
        <LanguageSelector />
        <NavHelpButton />
        {connected && <NavNotificationButton />}
        {connected && <NetworkSelector />}
        <ConnectWalletButton className="hidden lg:block max-[300px] relative " />
        <ConnectWalletButton
          className="lg:hidden xs:min-w-[120px]"
          label="Connect"
        />
      </div>
    </header>
  );
}
