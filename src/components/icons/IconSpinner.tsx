import React from "react";
import { cn } from "../../libs/utils.ts";

export default function IconSpinner(
  props: React.SVGProps<SVGSVGElement> & { fill?: string }
) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
      <path
        fill="url(#ymZTTHHCsqAuBTSb78~Hsb_Z4lBdSu2GAl2_gr2)"
        className={cn("fill-gray-100", props.fill)}
        d="M24,5.029v3.002c0,0.54,0.429,0.965,0.968,0.999c8.064,0.514,14.396,7.4,14.016,15.677	c-0.351,7.638-6.636,13.924-14.275,14.276c-8.278,0.381-15.164-5.951-15.678-14.016C8.996,24.429,8.571,24,8.031,24H5.029	c-0.564,0-1.032,0.467-1.003,1.03c0.554,10.92,9.866,19.529,21.051,18.942c10.095-0.529,18.365-8.8,18.894-18.895	C44.558,13.891,35.949,4.58,25.03,4.026C24.467,3.998,24,4.466,24,5.029z"
      ></path>
    </svg>
  );
}
