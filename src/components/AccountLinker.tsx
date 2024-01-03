import { LogIn } from "lucide-react";
import { useState } from "react";
import { useInterval } from "usehooks-ts";
import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import useStore from "../hooks/store/useStore.ts";
import { useSession } from "../hooks/useSession.ts";
import { cn } from "../libs/helpers.ts";
import { Button } from "./ui/Button.tsx";

export function AccountLinker() {
  const { connected, address } = useConnectorContext();
  const { hasAccessToken } = useSession();
  const { toggleOpenState } = useStore((state) => ({
    user: state.user,
    toggleOpenState: state.toggleOpenState,
  }));
  const [animate, setAnimate] = useState(true);
  const [hovered, setHovered] = useState(false);

  useInterval(
    () => {
      if (hovered) return;
      setAnimate(!animate);
      setTimeout(() => {
        setAnimate(!animate);
      }, 5000);
    },
    !hasAccessToken(address) ? 10000 : null,
  );

  return (
    <>
      {connected && !!address && !hasAccessToken(address) && (
        <div
          className={cn(
            "select-none bg-card-background rounded-3xl mb-2 bg-gradient-to-r from-chinese-green via-orange-500 to-yellow-500 p-0.5",
            { "animate-pulse": animate },
          )}
          onMouseEnter={() => {
            setHovered(true);
            setAnimate(false);
          }}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="select-none pt-2 py-2 bg-card-background rounded-3xl px-3 md:px-3 border border-card-border flex items-center gap-3">
            <span>
              <LogIn className="text-chinese-green" width="25" height="25" />
            </span>
            <span className="tracking-wide font-light text-gray-400 flex md:items-center flex-col md:flex-row md:gap-2">
              <span className="text-white font-normal">Wallet Unlinked</span>
              <span className="text-xs md:text-sm">
                <span className="hidden lg:inline">
                  - Link to enable personalized features like notifications!
                </span>
                <span className="hidden xxs:inline lg:hidden">
                  Enable personalized features!
                </span>
                <span className="xxs:hidden">Get personalized features!</span>
              </span>
            </span>
            <span className="flex-1 flex justify-end">
              <Button
                variant="default"
                size="sm"
                className="w-[100px]"
                onClick={() => {
                  toggleOpenState &&
                    toggleOpenState("settingsSheet", "account");
                }}
              >
                Link
              </Button>
            </span>
          </div>
        </div>
      )}
    </>
  );
}
