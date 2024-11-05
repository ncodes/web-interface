import React from "react";

function IconMenu2Line(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      height="33px"
      width="33px"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M16 18v2H5v-2h11zm5-7v2H3v-2h18zm-2-7v2H8V4h11z" />
    </svg>
  );
}

export function MobileMenuActivator(props: { onClick: () => void }) {
  return (
    <div className="flex items-center gap-3 mr-5 xl:hidden">
      <span className="shrink-0 cursor-pointer" onClick={props.onClick}>
        <IconMenu2Line
          className="border outline-0 select-none p-1 pb-2 pr-2 pt-1 border-gray-600 text-gray-300 rounded-xl hover:border-chinese-green hover:text-chinese-green transition-all duration-1000"
          height="35px"
          width="35px"
        />
      </span>
      <span className="shrink-0 ">
        <img src="/images/logo-mark-w-new.svg" alt="logo" className="w-[25px]" />
      </span>
    </div>
  );
}
