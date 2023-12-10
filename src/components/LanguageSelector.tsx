import React, { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import useTranslate from "../i18n/useTranslate.ts";
import { cn } from "../libs/utils.ts";
import { NavOrdinaryLink } from "./NavOrdinaryLink.tsx";
import { IconFlagChina } from "./icons/IconFlagChina.tsx";
import { IconFlagFrance } from "./icons/IconFlagFrance.tsx";
import { IconFlagIndia } from "./icons/IconFlagIndia.tsx";
import { IconFlagItaly } from "./icons/IconFlagItaly.tsx";
import { IconFlagJapan } from "./icons/IconFlagJapan.tsx";
import { IconFlagSKorea } from "./icons/IconFlagSKorea.tsx";
import { IconFlagSpain } from "./icons/IconFlagSpain.tsx";
import { IconFlagUK } from "./icons/IconFlagUK.tsx";
import { IconGlobalLine } from "./icons/IconGlobalLine.tsx";
import { Button } from "./ui/Button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";
import { ScrollArea } from "./ui/scroll-area.tsx";

function DropdownMenuItemCustom({
  children,
  className,
  locale,
}: {
  children: ReactNode;
  className?: string;
  locale: string;
}) {
  const { genLink, i18n, cacheLocale } = useTranslate();
  return (
    <DropdownMenuItem
      onClick={() => {
        cacheLocale(locale);
      }}
      className={cn(
        "flex items-center gap-2 font-normal text-[13px] px-2 py-2 transition-all duration-300 focus:scale-x-105 focus:bg-chinese-green cursor-pointer rounded-xl mx-1",
        className,
        {
          "scale-x-105 bg-chinese-green text-accent-foreground my-1":
            i18n.language === locale,
        },
      )}
      asChild
    >
      <NavLink to={genLink("", locale)}>{children}</NavLink>
    </DropdownMenuItem>
  );
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden">
      <LanguageSelectorMenu onOpenChange={setOpen}>
        <Button
          variant="ghost"
          className={cn(
            "justify-center items-center p-0 h-[40px] w-[40px] rounded-full border border-gray-600 hover:bg-gray-800 cursor-pointer text-gray-200 hover:border-chinese-green hover:text-chinese-green transition-all duration-500 hover:scale-110",
            {
              "scale-110 border-chinese-green": open,
            },
          )}
        >
          <IconGlobalLine />
        </Button>
      </LanguageSelectorMenu>
    </div>
  );
}

export function LanguageSelectorMenu({
  children,
  onOpenChange,
}: {
  children: React.ReactElement;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className="outline-0 ring-0" asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[152px] outline-0 tracking-wide shadow-xl drop-shadow-2xl rounded-2xl bg-modal-background border-gray-600 text-gray-200 py-0 px-1">
        <ScrollArea className="h-[300px]" type="scroll">
          <DropdownMenuItemCustom locale="en">
            <IconFlagUK width="25" /> English
          </DropdownMenuItemCustom>
          <DropdownMenuItemCustom locale="es">
            <IconFlagSpain width="25" /> Español
          </DropdownMenuItemCustom>
          <DropdownMenuItemCustom locale="it">
            <IconFlagItaly width="25" /> Italiano
          </DropdownMenuItemCustom>
          <DropdownMenuItemCustom locale="fr">
            <IconFlagFrance width="25" /> Français
          </DropdownMenuItemCustom>{" "}
          <DropdownMenuItemCustom locale="zh-CN">
            <IconFlagChina width="25" /> Chinese
          </DropdownMenuItemCustom>
          <DropdownMenuItemCustom locale="hi-IN">
            <IconFlagIndia width="25" /> Hindi
          </DropdownMenuItemCustom>
          <DropdownMenuItemCustom locale="ko">
            <IconFlagSKorea width="25" /> Korean
          </DropdownMenuItemCustom>
          <DropdownMenuItemCustom locale="jo">
            <IconFlagJapan width="25" /> Japanese
          </DropdownMenuItemCustom>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LanguageSelectorMobile() {
  const [open, setOpen] = useState(false);
  return (
    <LanguageSelectorMenu onOpenChange={setOpen}>
      <span>
        <NavOrdinaryLink
          href="#"
          label="Language"
          svg={<IconGlobalLine />}
          className={cn(
            "hidden outline-0 ring-0 relative [&>span:nth-child(2)]:relative [&>span:nth-child(2)]:-top-[1px]",
            { "text-white ml-[2px]": open },
          )}
        />
      </span>
    </LanguageSelectorMenu>
  );
}
