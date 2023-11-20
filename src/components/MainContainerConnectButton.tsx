import { PlugZapIcon } from "lucide-react";
import { ConnectWalletButton } from "./ConnectWalletButton.tsx";
import { Button } from "./ui/Button.tsx";

export function MainContainerConnectButton() {
  return (
    <div className="flex select-none items-center gap-2 text-gray-200 justify-center font-light h-[200px] xl:h-[610px]">
      <ConnectWalletButton>
        <Button
          variant="outline"
          className="w-[220px] flex gap-2 hover:scale-105 duration-500"
        >
          <PlugZapIcon className="w-[20px]" /> Connect your wallet
        </Button>
      </ConnectWalletButton>
    </div>
  );
}
