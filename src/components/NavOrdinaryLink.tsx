import React from "react";
import { cn } from "../libs/utils.ts";

export function NavOrdinaryLink(props: {
  href: string;
  label: string;
  svg?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={props.href}
      className={cn(
        "flex items-center gap-3 font-light text-[17px] py-2 text-muted-foreground hover:text-white transition-all duration-500 hover:ml-[2px]",
        props.className
      )}
    >
      {props.svg && <span className=" w-[20px] -ml-1">{props.svg}</span>}
      <span>{props.label}</span>
    </a>
  );
}
