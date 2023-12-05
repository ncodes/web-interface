import useStore from "../hooks/store/useStore.ts";
import { IconNotifications } from "./icons/IconNotifications.tsx";
import { UnreadMessageCount } from "./messenger/UnreadMessageCount.tsx";

export function NavNotificationButton() {
  const toggleOpenState = useStore((state) => state.toggleOpenState);

  return (
    <div
      onClick={() => {
        toggleOpenState && toggleOpenState("notificationSheet");
      }}
      className="flex relative transition-all duration-500 hover:scale-110  p-[10px] justify-center items-center hover:bg-gray-800 rounded-full border border-gray-600 cursor-pointer text-gray-200 hover:border-chinese-green hover:text-chinese-green"
    >
      <IconNotifications />
      <span className="absolute top-4 left-6">
        <UnreadMessageCount disableUnmark />
      </span>
    </div>
  );
}
