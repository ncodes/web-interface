import { useMutation } from "@tanstack/react-query";
import { LogInIcon } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { RefCodeKey } from "../constants.ts";
import { createSignatureMessage } from "../hooks/connectors/common.ts";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import { useAuthService } from "../hooks/services/backend/useAuthService.ts";
import useStore from "../hooks/store/useStore.ts";
import useMounted from "../hooks/useMounted.ts";
import { useSession } from "../hooks/useSession.ts";
import { useToast } from "../hooks/useToast.tsx";
import { cn, logError } from "../libs/helpers.ts";
import { CreateVirtualAccount } from "./CreateVirtualAccount.tsx";
import LoaderOverlay from "./airdrop/tapoff/LoaderOverlay.tsx";
import IconSpinner from "./icons/IconSpinner.tsx";
import { Button } from "./ui/Button.tsx";
import { EmptyBodyCard } from "./ui/EmptyBodyCard.tsx";

export function MainContainerConnectButton({
  variant,
  authenticate,
  showLoader,
  loaderIcon,
  className,
}: {
  variant?: string;
  authenticate?: boolean;
  showLoader?: boolean;
  loaderIcon?: ReactNode;
  className?: string;
}) {
  const connectedAt = useRef<number>(0);
  const { address, ready } = useConnectorContext();
  const { token } = useSession();
  const mounted = useMounted(3000);
  const isTelegramBot = useStore((state) => state.isTelegramBot);

  useEffect(() => {
    if (!isTelegramBot || !mounted) return;
    (window as any).Telegram.WebApp.ready();
    (window as any).Telegram.WebApp.expand();
  }, [mounted, isTelegramBot]);

  if (address && !!token) return null;

  return (
    <div className="h-full flex justify-center items-center flex-1">
      {!mounted && showLoader && <LoaderOverlay icon={loaderIcon} />}

      {mounted && !ready && !address && (
        <WalletConnect
          variant={variant}
          loaderIcon={loaderIcon}
          className={className}
          onConnect={() => {
            connectedAt.current = Math.round(Date.now() / 1000);
          }}
        />
      )}

      {mounted && authenticate && address && !token && (
        <AccountSignIn
          className={className}
          connectedAt={connectedAt.current}
        />
      )}
    </div>
  );
}

function WalletConnect({
  variant,
  onConnect,
  className,
  loaderIcon,
}: {
  variant?: string;
  onConnect?: () => void;
  className?: string;
  loaderIcon?: ReactNode;
}) {
  // const { ready } = useConnectorContext();
  // const isTelegramBot = useStore((state) => state.isTelegramBot);

  return (
    <div className="animate-i sslide-in-from-top-10 flex flex-col select-none items-center gap-2 text-gray-200 justify-center font-light h-[200px] xl:h-[610px]">
      <>
        {/* {(!isTelegramBot ||
          (window as any).Telegram.WebApp.platform != "android") && (
          <EmptyBodyCard
            className={cn("max-w-[350px] mt-[30px] md:mt-0 pt-0", className)}
            label={
              <div className="text-sm text-gray-200">
                {!ready && (
                  <>
                    <div className="flex items-center gap-2">
                      <Wallet2 className="text-chinese-green" width="20" />
                      <span className="font-jersey20 text-lg xs:text-xl block">
                        You need to connect a wallet
                      </span>
                    </div>
                    {isTelegramBot && (
                      <div className="text-sm text-gray-300 tracking-wide my-2">
                        Hey 😎, it looks like you haven't connected a wallet.
                        Connect one to start the game.
                      </div>
                    )}
                  </>
                )}
              </div>
            }
          >
            <ConnectWalletButton onConnect={onConnect} className="w-full">
              <Button
                variant={(variant || "default") as any}
                rounded="xl"
                className="w-full flex gap-2 hover:scale-[1.02] duration-500 font-jersey10 text-2xl"
              >
                <Wallet2 width="20" className="" /> Connect
              </Button>
            </ConnectWalletButton>
          </EmptyBodyCard>
        )} */}

        <CreateVirtualAccount loaderIcon={loaderIcon} />
      </>
    </div>
  );
}

function AccountSignIn({
  connectedAt,
  className,
}: {
  connectedAt: number;
  className?: string;
}) {
  const { simpleError } = useToast();
  const { auth } = useAuthService();
  const { address, sign, ready } = useConnectorContext();
  const [loading, setLoading] = useState(false);
  const { setAccessToken, token } = useSession();

  const authMutation = useMutation({
    mutationFn: (data: {
      msg: string;
      sig: string;
      refCode: string | null;
    }) => {
      return auth(data.msg, data.sig, data.refCode);
    },
  });

  useEffect(() => {
    if (token || !ready) return;
    if (Date.now() / 1000 - connectedAt > 2) return;
    doAuth();
  }, [ready]);

  async function doAuth() {
    setLoading(true);
    const msg = createSignatureMessage(address, undefined, "24 hours");
    const sig = await sign(msg.toString("utf-8")).catch((e) => {
      simpleError(e.message, { position: "top-center", duration: 5000 });
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

      setAccessToken(address, data.token as string);
      setLoading(false);
    } catch (error) {
      simpleError("Auth failed", { position: "top-center", duration: 5000 });
      logError(error);
      setLoading(false);
    }
  }

  return (
    <div className="animate-in slide-in-from-top-10 flex select-none items-center gap-2 text-gray-200 justify-center font-light h-[200px] xl:h-[610px]">
      <EmptyBodyCard
        className={cn(
          "min-h-[100px] max-w-[300px] mt-12 md:mt-0 pt-0",
          className,
        )}
        label={
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <LogInIcon className="text-chinese-green" width="20" />
            <span className="font-jersey20 text-xl">Log In</span>
          </div>
        }
      >
        <>
          <div className="text-sm mx-5 mb-3 text-center text-gray-400 tracking-wide">
            You will be asked to sign a message to verify your wallet.
          </div>
          <Button
            variant="default"
            size="sm"
            disabled={loading}
            className="w-full mt-2"
            onClick={() => {
              doAuth();
            }}
          >
            {!loading && "Login"}
            {loading && (
              <IconSpinner width={20} className="text-gray-800 animate-spin" />
            )}
          </Button>
        </>
      </EmptyBodyCard>
    </div>
  );
}
