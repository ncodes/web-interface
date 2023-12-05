import React from "react";

export default function IconConflict(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 10L13 10 13 1 6 14 12 14 12 23z"></path>
      <path
        d="M17.4 4.5H21.599999999999998V6.5H17.4z"
        transform="rotate(-45.001 19.5 5.5)"
      ></path>
      <path
        d="M3.5 3.4H5.5V7.6H3.5z"
        transform="rotate(-45.001 4.5 5.5)"
      ></path>
      <path
        d="M18.5 16.4H20.5V20.599999999999998H18.5z"
        transform="rotate(-45.001 19.5 18.5)"
      ></path>
      <path
        d="M2.4 17.5H6.6V19.5H2.4z"
        transform="rotate(-45.001 4.5 18.5)"
      ></path>
    </svg>
  );
}
