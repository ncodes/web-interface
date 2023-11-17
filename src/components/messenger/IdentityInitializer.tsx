import { Client } from "@xmtp/xmtp-js";
import { useEffect, useRef, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import useMessenger from "../../hooks/messenger/useMessenger.ts";
import { isDev } from "../../libs/helpers.ts";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";

export function IdentityInitializer({
  onInitialized,
}: {
  onInitialized: (client: Client) => void;
}) {
  const {  loadKeys, initClient } = useMessenger();
  const env = isDev() ? "local" : "production";
  const { wallet, address } = useConnectorContext();
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const client = useRef<Client | null>(null);

  useEffect(() => {
    if (!address) return;
    const key = loadKeys(env, address);
    if (key) {
      if (!client.current) {
        void initializeWallet();
      } else {
        setInitialized(true);
        onInitialized && onInitialized(client.current as Client);
      }
    }
  }, [address, wallet]);

  async function initializeWallet() {
    try {
      if (!wallet || client.current) return;
      setLoading(true);

      client.current = await initClient(env, wallet);

      setLoading(false);
      setInitialized(true);
      onInitialized && onInitialized(client.current);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  }

  if (initialized) return null;

  return (
    <div className="flex h-full justify-center items-center">
      <div className="px-12 flex flex-col gap-3 items-center">
        <div className="flex gap-1.5">
          <span className="w-[50px] h-1 rounded-full bg-chinese-green"></span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="font-semibold tracking-wider">Enable Chat</div>
          <div className="text-xs font-light tracking-wider text-gray-300 text-center">
            It seems it's your first time using chat. <br />
            To start chatting, you need to initialize your wallet for chat.
          </div>
          <div className="text-[11px] border rounded-xl py-2 my-2 border-gray-800 font-light tracking-wider text-gray-500 text-center">
            You will be prompted to sign one or two messages to initialize your
            wallet. Signing does not require gas.
          </div>
          <div className="mt-2">
            <Button
              size="full"
              variant="outline"
              className="w-[160px]"
              onClick={initializeWallet}
              disabled={loading}
            >
              {!loading && <>Initialize</>}
              {loading && (
                <IconSpinner
                  width="15px"
                  fill="fill-gray-400"
                  className="animate-spin"
                />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
