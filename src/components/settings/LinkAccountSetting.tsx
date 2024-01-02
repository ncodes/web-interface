import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { RefCodeKey, StoreEmailKey } from "../../constants.ts";
import { createSignatureMessage } from "../../hooks/connectors/common.ts";
import { useAuthService } from "../../hooks/services/backend/useAuthService.ts";
import useStore from "../../hooks/store/useStore.ts";
import { useToast } from "../../hooks/useToast.tsx";
import { Alert } from "../Alert.tsx";
import IconCheckCircle from "../icons/IconCheckCircle.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { Button } from "../ui/Button.tsx";

import { ChevronLeft } from "lucide-react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import { useSession } from "../../hooks/useSession.ts";
import { cn, logError } from "../../libs/helpers.ts";
import Input2 from "../Input2.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";

export function LinkAccountSetting() {
  const [value, setValue] = useState("");
  const [linked, setLinked] = useState(false);
  const { setUser } = useStore((state) => ({ setUser: state.setUser }));
  const { sign, address } = useConnectorContext();
  const { simpleError } = useToast();
  const { auth, verifyEmail, deleteSession } = useAuthService();
  const [loading, setLoading] = useState(false);
  const [verifyMode, setVerifyMode] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");
  const { getUser } = useUserService();
  const { setAccessToken, delAccessToken } = useSession();

  const authMutation = useMutation({
    mutationFn: (data: {
      msg: string;
      sig: string;
      refCode: string | null;
    }) => {
      return auth(data.msg, data.sig, data.refCode);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (data: { userId: string; otp: string }) => {
      return verifyEmail(data.userId, data.otp);
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (all: boolean) => {
      return deleteSession(all);
    },
  });

  const fetchUser = useQuery({
    queryKey: ["getUser", { address }],
    queryFn: getUser,
    enabled: !!address,
  });

  useEffect(() => {
    if (fetchUser.data) {
      const { email } = fetchUser.data;
      setValue(email || localStorage.getItem(StoreEmailKey) || "");
      if (!verifyMode) setLinked(email !== undefined);
    } else {
      setValue(localStorage.getItem(StoreEmailKey) || "");
    }
  }, [fetchUser.data]);

  async function doLinkWallet() {
    if (!value?.trim()) {
      simpleError("Please enter a valid email", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }

    setLoading(true);

    const msg = createSignatureMessage(address, value, "24 hours");
    const sig = await sign(msg.toString("utf-8"))
      .catch((e) => {
        simpleError(e.message, { position: "top-center", duration: 5000 });
      })
      .catch(() => {
        setLoading(false);
      });

    if (!sig) {
      setLoading(false);
      return;
    }

    try {
      const refCode = localStorage.getItem(RefCodeKey);
      const data = await authMutation.mutateAsync({
        msg: msg.toString("hex"),
        sig,
        refCode,
      });

      if (!data.token) {
        setVerifyMode(true);
        return;
      }

      void onLinked(data.user, data.token);
    } catch (error) {
      simpleError("Failed to link wallet", {
        position: "top-center",
        duration: 5000,
      });
      logError(error);
    } finally {
      setLoading(false);
    }
  }

  async function doVerifyOTP() {
    try {
      setLoading(true);
      if (!authMutation.data?.user) return;
      const data = await verifyEmailMutation.mutateAsync({
        userId: authMutation.data.user.id,
        otp: value,
      });

      if (!data.token) {
        setVerifyMode(true);
        return;
      }

      void onLinked(data.user, data.token);
    } catch (error) {
      if ((error as { message: string }).message == "invalid otp") {
        setErr("Invalid code");
      } else {
        simpleError("Failed to verify code", {
          position: "top-center",
          duration: 5000,
        });
        logError(error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function onLinked(user: User, token: string) {
    setAccessToken(token);
    localStorage.setItem(StoreEmailKey, user.email);
    await fetchUser.refetch();
    setValue(user.email);
    setLinked(true);
    setVerifyMode(false);
    setUser(user);
  }

  async function doUnlink() {
    try {
      setLoading(true);
      await deleteSessionMutation.mutateAsync(false);
      simpleError("Successfully unlinked wallet", {
        position: "top-center",
        duration: 5000,
      });
    } catch (error) {
      setLoading(false);
      simpleError("Failed to unlink wallet", {
        position: "top-center",
        duration: 5000,
      });
      logError(error);
      return;
    }

    delAccessToken();
    setLinked(false);
    setLoading(false);
  }

  return (
    <>
      <div className="font-light text-gray-300 text-sm">
        Link your wallet to an email account to receive trade notifications.
      </div>
      {!linked && (
        <div className="transition-all duration-300">
          <Alert icon={<IconInfoCircle />}>
            {!verifyMode && (
              <>
                A signature request will be initiated. No gas fee or blockchain
                transaction is required.
              </>
            )}
            {verifyMode && (
              <>
                A code has been sent to the email address you provided. Enter
                the code below to verify your email.
              </>
            )}
          </Alert>
          <div className="flex gap-2 mt-5">
            <div className="flex w-full flex-col">
              <div className="font-light items-center flex justify-between text-xs mb-2 ml-1 text-gray-500 tracking-wide">
                <span>
                  {!verifyMode && "Enter your email address"}
                  {verifyMode && "Enter Code"}
                </span>
                {verifyMode && (
                  <span
                    className="flex items-center text-gray-600 cursor-pointer hover:opacity-90"
                    onClick={() => {
                      setVerifyMode(false);
                      setErr("");
                      setValue(
                        fetchUser.data?.emailUnverified ||
                          localStorage.getItem(StoreEmailKey) ||
                          "",
                      );
                    }}
                  >
                    <ChevronLeft width="15" />
                    <span>back</span>
                  </span>
                )}
              </div>
              <Input2
                type={verifyMode ? "number" : "email"}
                value={value}
                disabled={loading}
                placeholder={verifyMode ? "000000" : "satoshi@btc.com"}
                onChange={(e) => {
                  setValue(
                    !verifyMode ? e.target.value : e.target.value.slice(0, 6),
                  );
                }}
                containerClassName={cn("pr-1", { "!border-red-500": !!err })}
                err={err}
                afterInput={
                  <Button
                    variant="default"
                    rounded="xl"
                    disabled={loading}
                    size="sm"
                    onClick={verifyMode ? doVerifyOTP : doLinkWallet}
                  >
                    {loading && (
                      <IconSpinner
                        className="animate-spin"
                        fill="fill-gray-900"
                        width="20"
                      />
                    )}
                    {!loading && (verifyMode ? "Verify" : "Link")}
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      )}

      {linked && (
        <div>
          <Alert
            icon={<IconCheckCircle width="20px" height="20px" />}
            className="!text-sm"
          >
            <div className="flex justify-between items-center">
              <span className="grow-0 break-all flex flex-col">
                <span>Your wallet is linked to</span>
                <b>{fetchUser.data?.email}</b>
              </span>
              <span className="shrink-0">
                {loading && (
                  <IconSpinner
                    className="animate-spin"
                    fill="fill-gray-500"
                    width="20"
                  />
                )}

                {!loading && (
                  <Button
                    onClick={doUnlink}
                    variant="link"
                    rounded="md"
                    size="sm"
                  >
                    Unlink
                  </Button>
                )}
              </span>
            </div>
          </Alert>
        </div>
      )}
    </>
  );
}
