import { IconGlobe } from "../icons/IconGlobe.tsx";
import { IconFlagUSA } from "../icons/IconFlagUSA.tsx";
import { IconFlagUK } from "../icons/IconFlagUK.tsx";
import { IconFlagNigeria } from "../icons/IconFlagNigeria.tsx";
import { IconFlagFrance } from "../icons/IconFlagFrance.tsx";
import { IconFlagChina } from "../icons/IconFlagChina.tsx";
import { ReactElement, SVGProps } from "react";

export interface Region {
  name: string;
  selectName?: string;
  icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
  className?: string;
}

export const defaultRegion = "";

export const regions: Region[] = [
  {
    name: "",
    selectName: "ALL",
    icon: IconGlobe,
    className: "text-chinese-green",
  },
  { name: "US", icon: IconFlagUSA },
  { name: "UK", icon: IconFlagUK },
  { name: "NG", icon: IconFlagNigeria },
  { name: "FR", icon: IconFlagFrance },
  { name: "CN", icon: IconFlagChina },
];
