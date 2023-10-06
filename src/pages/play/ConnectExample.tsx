import { ConnectButton } from "../../hooks/connectors/components/ConnectButton.tsx";
import useConnector from "../../hooks/connectors/useConnector.tsx";
import { createSignatureMessage } from "../../hooks/connectors/common.ts";
import { useCallback } from "react";

export default function ConnectExample() {
  const { connected, sign, address } = useConnector();

  const signMsg = useCallback(() => {
    const email = "kennedyidialu@gmail.com";
    const msg = createSignatureMessage(address, email);
    console.log("MSG:", msg.toString("hex"));
    sign(msg.toString("utf-8"))
      .then((sig) => {
        console.log("SIG:", sig);
      })
      .catch((e) => {
        console.error(e.message);
      });
  }, [address, sign]);

  return (
    <>
      <div className="w-6/12 mx-auto flex flex-col space-y-2 justify-center mt-20">
        <div className="border w-80 text-center p-2">
          <ConnectButton />
        </div>

        {connected && (
          <button className="border w-80 text-center p-3" onClick={signMsg}>
            Create Auth Sig
          </button>
        )}
      </div>
    </>
  );
}
