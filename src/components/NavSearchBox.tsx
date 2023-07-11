import React from "react";
import { Input } from "./ui/Input.tsx";

export function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="#C8ED5A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height="24px"
      width="24px"
      {...props}
    >
      <path d="M19 11 A8 8 0 0 1 11 19 A8 8 0 0 1 3 11 A8 8 0 0 1 19 11 z" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function NavSearchBox() {
  return (
    <div className="flex hidden md:flex md:w-[350px] lg:w-[400px] xl:w-[500px]">
      <Input
        placeholder="Search tokens, pairs or addresses"
        className="delay-300 duration-300 ease-in-out tracking-wide focus-visible:ring-chinese-green text-[16px] font-normal rounded-full p-5  pr-11 cursor-pointer hover:bg-gray-900"
      />
      <IconSearch className="relative -left-9 top-2 cursor-pointer" />
    </div>
  );
}
