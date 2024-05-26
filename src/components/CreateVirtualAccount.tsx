import { useMutation } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import { useTGBotService } from "../hooks/services/backend/useTGBotService.ts";
import useStore from "../hooks/store/useStore.ts";
import { useSession } from "../hooks/useSession.ts";
import { ToolTip } from "./ToolTip.tsx";
import { Button } from "./ui/Button.tsx";

export function CreateVirtualAccount() {
  const isTelegramBot = useStore((state) => state.isTelegramBot);
  const { createLinkedUser } = useTGBotService();
  const setUser = useStore((state) => state.setUser);
  const setIsVirtualWallet = useStore((state) => state.setIsVirtualWallet);
  const { setAddress, setReady } = useConnectorContext();
  const { setAccessToken } = useSession();

  const createLinkedUserMut = useMutation({
    mutationFn: createLinkedUser,
  });

  function createAccount() {
    async function doTGLinkUser() {
      try {
        const result = await createLinkedUserMut.mutateAsync({
          // initData: (window as any).Telegram.WebApp.initData,
          // initDataUnsafe: (window as any).Telegram.WebApp.initDataUnsafe,
          initData:
            "query_id=AAH4CQ0aAAAAAPgJDRr_Qt2t&user=%7B%22id%22%3A437062136%2C%22first_name%22%3A%22Kennedy%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ncodes%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1716660789&hash=61fdecd2845d779c22c3b0fdfdfdb1efb2b661014dfba7fcc14e12e2a3276dc1",
          initDataUnsafe: {
            auth_date: "1716592368",
            hash: "61fdecd2845d779c22c3b0fdfdfdb1efb2b661014dfba7fcc14e12e2a3276dc1",
            query_id: "AAH4CQ0aAAAAAPgJDRq9naJu",
            user: {
              id: 437062136,
              allows_write_to_pm: true,
              first_name: "Kennedy",
              last_name: "",
              username: "ncodes",
              language_code: "en",
            },
          },
        });
        setIsVirtualWallet(true);
        setUser(result.user);
        setAddress(result.user.address);
        setReady(true);
        setAccessToken(result.user.address, result.token);
      } catch (error) {
        console.error("Failed to create virtual account: ", error);
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
