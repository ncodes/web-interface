import { useCallback, useEffect, useState } from "react";
import useConnector from "../hooks/connectors/useConnector.tsx";
import { useToast } from "../hooks/toast/toast.tsx";
import { useAuthService } from "../hooks/services/backend/useAuthService.ts";
import { useUserService } from "../hooks/services/backend/useUserService.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createSignatureMessage } from "../hooks/connectors/common.ts";
import { Alert } from "./Alert.tsx";
import IconInfoCircle from "./icons/IconInfoCircle.tsx";
import { Input } from "./ui/Input.tsx";
import { Button } from "./ui/Button.tsx";
import IconCheckCircle from "./icons/IconCheckCircle.tsx";
import { StoreAccessTokenKey, StoreEmailKey } from "../constants.ts";
import useStore from "../hooks/store/useStore.ts";

export function LinkAccountSetting() {
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [linked, setLinked] = useState(false);
  const { setUser } = useStore((state) => ({ setUser: state.setUser }));
  const { sign, address } = useConnector();
  const { simpleError } = useToast();
  const setLoaderProgress = useStore((state) => state.setLoaderProgress);
  const { auth } = useAuthService();
  const { getUser } = useUserService();
  const queryUserByAddress = useQuery({
    queryKey: ["user", address],
    queryFn: getUser,
    enabled: !!address,
  });
  const authMutation = useMutation({
    mutationFn: (data: { msg: string; sig: string }) => {
      return auth(data.msg, data.sig);
    },
  });

  useEffect(() => {
    if (queryUserByAddress.isSuccess) {
      const { email } = queryUserByAddress.data;
      setEmail(email || localStorage.getItem(StoreEmailKey) || "");
      setLinked(email !== undefined);
    } else {
      setEmail(localStorage.getItem(StoreEmailKey) || "");
    }
  }, [queryUserByAddress.data, queryUserByAddress.isSuccess]);

  const linkWallet = useCallback(async () => {
    if (!email?.trim()) {
      simpleError("Please enter a valid email", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }

    setDisabled(true);

    const msg = createSignatureMessage(address, email);
    const sig = await sign(msg.toString("utf-8"))
      .catch((e) => {
        simpleError(e.message, { position: "top-center", duration: 10000 });
      })
      .finally(() => {
        setDisabled(false);
      });
    if (!sig) return;

    setLoaderProgress && setLoaderProgress(50);

    const data = await authMutation.mutateAsync({
      msg: msg.toString("hex"),
      sig,
    });

    localStorage.setItem(StoreAccessTokenKey, data.token);
    localStorage.setItem(StoreEmailKey, data.user.email);
    setEmail(data.user.email);
    setLinked(true);
    setUser(data.user);
    setLoaderProgress && setLoaderProgress(100);
  }, [address, authMutation, email, setLoaderProgress, sign, simpleError]);

  return (
    <>
      <div className="font-light text-gray-400 text-sm">
        Use Joint's Account server to link your wallet to your email account to
        receive trade notifications and important news.
      </div>
      {!linked && (
        <div>
          <Alert icon={<IconInfoCircle />}>
            A signature request will be initiated. No gas fee or blockchain
            transaction is required.
          </Alert>
          <div className="flex gap-2 mt-4">
            <Input
              type="email"
              value={email}
              disabled={disabled}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              variant="primary"
              placeholder="satoshi@btc.com"
            />
            <Button
              variant="default"
              rounded="md"
              disabled={disabled}
              size="sm"
              onClick={linkWallet}
            >
              Authorize
            </Button>
          </div>
        </div>
      )}

      {linked && (
        <div>
          <Alert icon={<IconCheckCircle />} className="!text-sm">
            <div className="flex justify-between items-center">
              <span className="grow-0 break-all flex flex-col">
                <span>Your wallet is linked to</span>
                <b>{queryUserByAddress?.data?.email}</b>
              </span>
              <span className="shrink-0">
                <Button
                  onClick={() => setLinked(false)}
                  variant="link"
                  rounded="md"
                  size="sm"
                >
                  Re-link
                </Button>
              </span>
            </div>
          </Alert>
        </div>
      )}
    </>
  );
}
