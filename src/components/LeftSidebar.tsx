import { RegionSelector } from "./RegionSelector.tsx";
import { Navigation } from "./Navigation.tsx";
import { NavOrdinaryLink } from "./NavOrdinaryLink.tsx";
import { cn } from "../libs/utils.ts";
import React, { useEffect, useState } from "react";
import { IconGlobalLine } from "./NavLanguageSelectorButton.tsx";
import { IconSettingsOutline } from "./icons/IconSettingsOutline.tsx";
import { IconQuestionCircle } from "./NavHelpButton.tsx";

import { IconSearch } from "./IconSearch.tsx";

function IconDoubleChevronBack(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width="30"
      height="30"
      viewBox="0 0 72 72"
      {...props}
    >
      <path d="M 35.078125 13.808594 C 34.033125 13.808594 32.990078 14.216344 32.205078 15.027344 L 14.591797 33.21875 C 13.090797 34.76975 13.090797 37.232203 14.591797 38.783203 L 32.205078 56.974609 C 33.743078 58.561609 36.275328 58.600453 37.861328 57.064453 C 39.448328 55.528453 39.489125 52.995203 37.953125 51.408203 L 23.03125 36 L 37.953125 20.591797 C 39.489125 19.004797 39.448328 16.472547 37.861328 14.935547 C 37.085328 14.183547 36.081125 13.808594 35.078125 13.808594 z M 54.535156 13.808594 C 53.490156 13.808594 52.445156 14.216344 51.660156 15.027344 L 34.046875 33.21875 C 32.545875 34.76975 32.545875 37.232203 34.046875 38.783203 L 51.660156 56.974609 C 53.198156 58.561609 55.730406 58.600453 57.316406 57.064453 C 58.903406 55.528453 58.944203 52.995203 57.408203 51.408203 L 42.488281 36 L 57.408203 20.591797 C 58.944203 19.004797 58.903406 16.472547 57.316406 14.935547 C 56.540406 14.183547 55.538156 13.808594 54.535156 13.808594 z"></path>
    </svg>
  );
}

function Overlay(props: { open: undefined | boolean; onClick: () => void }) {
  return (
    <div
      className={cn(
        "xl:hidden absolute w-screen h-screen bg-black/50 left-0 top-0 z-10",
        { hidden: !props.open }
      )}
      onClick={props.onClick}
    />
  );
}

export function LeftSidebar(props: {
  open?: boolean;
  closeRequested: () => void;
}) {
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <div>
      <Overlay
        open={open}
        onClick={() => {
          if (props.closeRequested) props.closeRequested();
        }}
      />
      <div
        className={cn(
          "z-10 absolute border-r xl:border-r-0 border-gray-800 bg-background xl:pl-0 xl:bg-transparent xl:relative flex flex-col justify-between w-[280px] left-0 py-[28px] pt-[18px] h-screen transition-left duration-150",
          { "absolute top-0 -left-[280px] z-10 bg-background": !open }
        )}
      >
        <header className="flex gap-4 -ml-[5px] pl-8">
          <a href="#" className="pt-[6px]">
            <img src="/images/logo-mark-w.svg" alt="logo" />
          </a>
          <RegionSelector />
          <div
            className="xl:hidden flex justify items-center flex-1 border-chinese-green justify-end pr-4 -mt-1"
            onClick={() => {
              if (props.closeRequested) props.closeRequested();
            }}
          >
            <IconDoubleChevronBack className="text-chinese-green p-1 border border-chinese-green rounded-lg" />
          </div>
        </header>

        <div className="md:hidden pl-8 py-3 mt-5 border-y border-gray-800">
          <NavOrdinaryLink
            href="#"
            label="Search"
            svg={<IconSearch />}
            className="py-0"
          />
        </div>

        <Navigation />
        <div className="flex-1 flex flex-col justify-end pl-8">
          <NavOrdinaryLink
            href="#"
            label="Language"
            svg={<IconGlobalLine />}
            className="relative [&>span:nth-child(2)]:relative [&>span:nth-child(2)]:-top-[1px]"
          />
          <NavOrdinaryLink
            href="#"
            label="Settings"
            svg={<IconSettingsOutline />}
            className="relative [&>span:nth-child(2)]:relative [&>span:nth-child(2)]:-top-[1px]"
          />
          <NavOrdinaryLink
            href="#"
            label="Help & Support"
            svg={<IconQuestionCircle />}
            className="relative [&>span:nth-child(2)]:relative [&>span:nth-child(2)]:-top-[2px]"
          />
        </div>
      </div>
    </div>
  );
}
