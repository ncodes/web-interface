import { Button } from "../ui/Button.tsx";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useEffect, useState } from "react";
import { Client, ClientOptions } from "@xmtp/xmtp-js";
import IconSpinner from "../icons/IconSpinner.tsx";
import { isDev } from "../../libs/helpers.ts";
import useMessenger from "../../hooks/messager/useMessenger.ts";
import MessageRelayCodec from "../../hooks/messager/codecs/MessageRelayCodec.ts";
import SwapStatusCodec from "../../hooks/messager/codecs/SwapStatusCodec.ts";
import DeliveryReceiptCodec from "../../hooks/messager/codecs/DeliveryReceiptCodec.ts";
import ReadReceiptCodec from "../../hooks/messager/codecs/ReadReceiptCodec.ts";

export function IdentityInitializer({
  onInitialized,
}: {
  onInitialized: (client: Client) => void;
}) {
  const { saveKeys, loadKeys } = useMessenger();
  const env = isDev() ? "dev" : "production";
  const { wallet, address } = useConnectorContext();
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!address) return;
    const key = loadKeys(env, address);
    if (key) {
      if (!client) {
        void initializeWallet();
      } else {
        setInitialized(true);
        onInitialized && onInitialized(client as Client);
      }
    }
  }, [address, client]);

  async function initializeWallet() {
    try {
      setLoading(true);

      const opts: Partial<ClientOptions> = { env };
      let keys = loadKeys(env, address);
      if (!keys) {
        keys = await Client.getKeys(wallet, opts);
        saveKeys(env, address, keys);
      }

      const client = await Client.create(null, {
        ...opts,
        privateKeyOverride: keys,
      });

      client.registerCodec(new DeliveryReceiptCodec());
      client.registerCodec(new ReadReceiptCodec());
      client.registerCodec(new MessageRelayCodec());
      client.registerCodec(new SwapStatusCodec());

      setLoading(false);
      setClient(client);
      setInitialized(true);
      onInitialized && onInitialized(client as Client);
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
