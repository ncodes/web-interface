import useStore from "../hooks/store/useStore.ts";
import IconCaution from "./icons/IconCaution.tsx";
import { Button } from "./ui/Button.tsx";

export function UnlinkedAccountNotice() {
  const toggleSettingsSheetOpen = useStore(
    (state) => state.toggleSettingsSheetOpen
  );

  return (
    <div>
      <div className="py-2 bg-gray-900 rounded-t-3xl px-3 md:px-5 border-b border-gray-800 flex items-center gap-3">
        <span>
          <IconCaution
            width="25"
            height="25"
            pathAProps={{ className: "fill-yellow-500" }}
            pathBProps={{ className: "fill-black" }}
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
    </div>
  );
}
