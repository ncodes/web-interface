import { useMutation } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import { useTGBotService } from "../hooks/services/backend/useTGBotService.ts";
import useStore from "../hooks/store/useStore.ts";
import { useSession } from "../hooks/useSession.ts";
import { useToast } from "../hooks/useToast.tsx";
import { logError } from "../libs/helpers.ts";
import { ToolTip } from "./ToolTip.tsx";
import { Button } from "./ui/Button.tsx";

export function CreateVirtualAccount() {
  const isTelegramBot = useStore((state) => state.isTelegramBot);
  const { createLinkedUser } = useTGBotService();
  const setUser = useStore((state) => state.setUser);
  const setIsVirtualWallet = useStore((state) => state.setIsVirtualWallet);
  const { setAddress, setReady } = useConnectorContext();
  const { setAccessToken } = useSession();
  const { notifyError } = useToast();

  const createLinkedUserMut = useMutation({
    mutationFn: createLinkedUser,
  });

  function createAccount() {
    async function doTGLinkUser() {
      try {
        const result = await createLinkedUserMut.mutateAsync({
          initData: (window as any).Telegram.WebApp.initData,
          initDataUnsafe: (window as any).Telegram.WebApp.initDataUnsafe,
        });
        setIsVirtualWallet(true);
        setUser(result.user);
        setAddress(result.user.address);
        setReady(true);
        setAccessToken(result.user.address, result.token);
      } catch (error) {
        notifyError((error as Error).message);
        logError(error);
      }
    }
    void doTGLinkUser();
  }

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
        className="mt-2 bg-gray-800/20 backdrop-blur-sm hover:bg-gray-800/40 hover:text-chinese-green"
        onClick={createAccount}
      >
        Create a virtual account
      </Button>
    </div>
  );
}
