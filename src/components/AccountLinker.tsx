import { useConnectorContext } from "../hooks/connectors/useConnectorContext.tsx";
import useStore from "../hooks/store/useStore.ts";
import { useSession } from "../hooks/useSession.ts";
import IconCaution from "./icons/IconCaution.tsx";
import { Button } from "./ui/Button.tsx";

export function AccountLinker() {
  const { connected, address } = useConnectorContext();
  const { toggleOpenState } = useStore((state) => ({
    user: state.user,
    toggleOpenState: state.toggleOpenState,
  }));
  const { getAccessToken } = useSession();

  return (
    <>
      {connected && !!address && !getAccessToken(address) && (
        <div className="select-none pt-2 py-2 bg-card-background rounded-3xl mb-2 px-3 md:px-3 border border-card-border flex items-center gap-3">
          <span>
            <IconCaution
              width="25"
              height="25"
              fillA="#C8ED5A"
              fillB="#000000"
            />
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
                toggleOpenState && toggleOpenState("settingsSheet", "account");
              }}
            >
              Link
            </Button>
          </span>
        </div>
      )}
    </>
  );
}
