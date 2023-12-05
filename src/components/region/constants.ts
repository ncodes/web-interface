import { ReactElement, SVGProps } from "react";
import { IconFlagChina } from "../icons/IconFlagChina.tsx";
import { IconFlagFrance } from "../icons/IconFlagFrance.tsx";
import { IconFlagNigeria } from "../icons/IconFlagNigeria.tsx";
import { IconFlagUK } from "../icons/IconFlagUK.tsx";
import { IconFlagUSA } from "../icons/IconFlagUSA.tsx";
import { IconGlobe } from "../icons/IconGlobe.tsx";

export interface Region {
  name: string;
  value: string;
  selectName?: string;
  icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
  className?: string;
}

export const defaultRegion = "";

export const regions: Region[] = [
  {
    name: "",
    value: "",
    selectName: "ALL",
    icon: IconGlobe,
    className: "text-white",
  },
  { name: "US", value: "usa", icon: IconFlagUSA },
  { name: "UK", value: "gbr", icon: IconFlagUK },
  { name: "NG", value: "nga", icon: IconFlagNigeria },
  { name: "FR", value: "fra", icon: IconFlagFrance },
  { name: "CN", value: "chn", icon: IconFlagChina },
];
