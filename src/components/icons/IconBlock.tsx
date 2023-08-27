import * as React from "react";

export function IconBlock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      height="20px"
      width="20px"
      {...props}
    >
      <path d="M11 3.2H13V20.7H11z" transform="rotate(-45.001 12 12)"></path>
      <path d="M12,22C6.5,22,2,17.5,2,12C2,6.5,6.5,2,12,2c5.5,0,10,4.5,10,10C22,17.5,17.5,22,12,22z M12,4c-4.4,0-8,3.6-8,8s3.6,8,8,8 s8-3.6,8-8S16.4,4,12,4z"></path>
    </svg>
  );
}
