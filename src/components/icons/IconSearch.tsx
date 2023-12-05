import React from "react";

export function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="#C8ED5A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M19 11 A8 8 0 0 1 11 19 A8 8 0 0 1 3 11 A8 8 0 0 1 19 11 z" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
