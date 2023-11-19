import React from "react";
import { cn } from "../libs/utils.ts";

export function NavOrdinaryLink(props: {
  href: string;
  label: string;
  target?: string;
  svg?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      onClick={props.onClick}
      href={props.href}
      target={props.target || ""}
      className={cn(
        "outline-0 ring-0 flex items-center gap-3 font-light text-[17px] py-2 text-muted-foreground hover:text-white transition-all duration-500 md:hover:ml-[2px]",
        props.className,
      )}
    >
      {props.svg && <span>{props.svg}</span>}
      <span>{props.label}</span>
    </a>
  );
}
