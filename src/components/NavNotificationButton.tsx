import { IconNotifications } from "./icons/IconNotifications.tsx";
import useStore from "../hooks/store/useStore.ts";

export function NavNotificationButton() {
  const toggleNotifSheetOpen = useStore((state) => state.toggleNotifSheetOpen);

  return (
    <div
      onClick={() => {
        toggleNotifSheetOpen && toggleNotifSheetOpen();
      }}
      className="flex transition-all duration-500 hover:scale-110  p-[10px] justify-center items-center hover:bg-gray-800 rounded-full border border-gray-600 cursor-pointer text-gray-200 hover:border-chinese-green hover:text-chinese-green"
    >
      <IconNotifications />
    </div>
  );
}
