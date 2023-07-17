import { MobileMenuActivator } from "./MobileMenuActivator.tsx";
import { LanguageSelector } from "./LanguageSelector.tsx";
import { NavHelpButton } from "./NavHelpButton.tsx";
import { NavNotificationButton } from "./NavNotificationButton.tsx";
import { ConnectWalletButton } from "./ConnectWalletButton.tsx";
import { NetworkSelector } from "./NetworkSelector.tsx";
import { NavSearchButton } from "./NavSearchButton.tsx";
import { InputActivatedSearchBox } from "./SearchBox.tsx";

export function Header(props: { onClick: () => void }) {
  return (
    <header className="flex items-center">
      <MobileMenuActivator onClick={props.onClick} />
      <InputActivatedSearchBox />
      <div className="flex-1 flex justify-end items-center gap-4">
        <NavSearchButton />
        <LanguageSelector />
        <NavHelpButton />
        <NavNotificationButton />
        <NetworkSelector />
        <ConnectWalletButton className="hidden lg:block max-[300px] relative " />
        <ConnectWalletButton
          className="lg:hidden xs:min-w-[120px]"
          label="Connect"
        />
      </div>
    </header>
  );
}
