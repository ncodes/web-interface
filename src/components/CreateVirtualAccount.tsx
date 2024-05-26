import { InfoIcon } from "lucide-react";
import useStore from "../hooks/store/useStore.ts";
import { ToolTip } from "./ToolTip.tsx";
import { Button } from "./ui/Button.tsx";

export function CreateVirtualAccount() {
  const isTelegramBot = useStore((state) => state.isTelegramBot);

  if (!isTelegramBot) return null;

  return (
    <div className="mt-5 text-center items-center flex flex-col">
      <span className="text-gray-400 flex items-center gap-2">
        <span>Unable to connect?</span>
        <ToolTip tip="Virtual account is linked to your telegram account.">
          <InfoIcon className="w-4" />
        </ToolTip>
      </span>
      <Button
        variant="outline"
        className="mt-2 hover:bg-transparent hover:text-chinese-green"
      >
        Create a virtual account
      </Button>
    </div>
  );
}
