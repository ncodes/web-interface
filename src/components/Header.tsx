import { MobileMenuActivator } from "./MobileMenuActivator.tsx";
import { NavSearchBox } from "./NavSearchBox.tsx";
import { NavLanguageSelectorButton } from "./NavLanguageSelectorButton.tsx";
import { NavHelpButton } from "./NavHelpButton.tsx";
import { NavNotificationButton } from "./NavNotificationButton.tsx";
import { ConnectWalletButton } from "./ConnectWalletButton.tsx";
import { NetworkSelector } from "./NetworkSelector.tsx";

export function Header(props: { onClick: () => void }) {
  return (
    <header className="flex items-center">
      <MobileMenuActivator onClick={props.onClick} />
      <NavSearchBox />
      <div className="flex-1 flex justify-end items-center space-x-4 mt-1">
        <NavLanguageSelectorButton />
        <NavHelpButton />
        <NavNotificationButton />
        <NetworkSelector />
        <ConnectWalletButton className="hidden lg:block max-[300px]" />
        <ConnectWalletButton
          className="lg:hidden xs:min-w-[120px]"
          label="Connect"
        />
      </div>
    </header>
  );
}
