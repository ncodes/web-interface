import useStore from "../hooks/store/useStore.ts";
import IconCaution from "./icons/IconCaution.tsx";
import { Button } from "./ui/Button.tsx";

export function UnlinkedAccountNotice() {
  const { toggleSettingsSheetOpen, user } = useStore((state) => ({
    toggleSettingsSheetOpen: state.toggleSettingsSheetOpen,
    user: state.user,
  }));

  return (
    <>
      {!user && (
        <div className="select-none py-2 bg-gray-900 rounded-xl mb-4 px-3 md:px-5 border border-gray-800 flex items-center gap-3">
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
              <span className="hidden md:inline">
                - Link your wallet to receive notifications!
              </span>
              <span className="hidden xxs:inline md:hidden">
                Link to receive notifications!
              </span>
              <span className="xxs:hidden">Link for notifications!</span>
            </span>
          </span>
          <span className="flex-1 flex justify-end">
            <Button
              variant="default"
              rounded="md"
              size="sm"
              onClick={() => {
                toggleSettingsSheetOpen && toggleSettingsSheetOpen("account");
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
