import React from "react";

function IconNotifications(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      height="20px"
      width="20px"
      {...props}
    >
      <path d="M4 8a6 6 0 014.03-5.67 2 2 0 113.95 0A6 6 0 0116 8v6l3 2v1H1v-1l3-2V8zm8 10a2 2 0 11-4 0h4z" />
    </svg>
  );
}

export function NavNotificationButton() {
  return (
    <div className="flex transition-all duration-500 hover:scale-110 justify-center items-center h-[40px] w-[40px] hover:bg-gray-800 rounded-full border border-gray-600 cursor-pointer text-gray-200 hover:border-chinese-green hover:text-chinese-green">
      <IconNotifications />
    </div>
  );
}
