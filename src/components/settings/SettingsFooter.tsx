import useStore from "../../hooks/store/useStore.ts";
import IconDisconnect from "../icons/IconDisconnect.tsx";
import { IconSettingsOutline } from "../icons/IconSettingsOutline.tsx";

import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";

export function SettingsFooter(props: { openWalletManager: () => void }) {
  const { disconnect } = useConnectorContext();
  const toggleOpenState = useStore((state) => state.toggleOpenState);

  return (
    <div className="w-full p-5 border-gray-600 bg-modal-background flex justify-between py-3 border-t border-modal-border/50">
      <div className="flex items-center text-sm font-light gap-1 text-gray-400 hover:text-gray-300 transition-all duration-500 cursor-pointer">
        <span>
          <IconSettingsOutline />
        </span>
        <span className="select-none" onClick={props.openWalletManager}>
          Manage Wallet
        </span>
      </div>
      <div className="flex items-center text-sm font-light gap-1 text-gray-400 hover:text-gray-300 transition-all duration-500 cursor-pointer">
        <span>
          <IconDisconnect />
        </span>
        <span
          className="select-none"
          onClick={async () => {
            await disconnect();
            toggleOpenState && toggleOpenState("settingsSheet");
          }}
        >
          Disconnect
        </span>
      </div>
    </div>
  );
}
