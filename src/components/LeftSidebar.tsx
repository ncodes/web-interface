import { RegionSelector } from "./RegionSelector.tsx";
import { Navigation } from "./Navigation.tsx";
import { NavOrdinaryLink } from "./NavOrdinaryLink.tsx";
import { cn } from "../libs/utils.ts";
import { useEffect, useState } from "react";
import { IconSettingsOutline } from "./icons/IconSettingsOutline.tsx";
import { IconQuestionCircle } from "./NavHelpButton.tsx";

import { LanguageSelectorMobile } from "./LanguageSelector.tsx";
import { IconDoubleChevronBack } from "./icons/IconDoubleChevronBack.tsx";
import { IconSearch } from "./icons/IconSearch.tsx";
import useStore from "../hooks/store/useStore.ts";

function Overlay(props: { open: undefined | boolean; onClick: () => void }) {
  return (
    <div
      className={cn(
        "xl:hidden fixed w-screen h-screen bg-black/50 left-0 top-0 z-10",
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
  const [openOverlay, setOpenOverlay] = useState(props.open);
  const toggleSearchSheetOpen = useStore((s) => s.toggleSearchSheetOpen);

  useEffect(() => {
    setOpenOverlay(props.open);
  }, [props.open]);

  return (
    <div>
      <Overlay
        open={openOverlay}
        onClick={() => {
          props.closeRequested && props.closeRequested();
        }}
      />
      <div
        className={cn(
          "z-10 absolute border-r xl:border-r-0 border-gray-800 bg-background xl:pl-0 xl:bg-transparent xl:relative flex flex-col justify-between w-[280px] left-0 py-[28px] pt-[18px] h-screen transition-left duration-150",
          { "absolute top-0 -left-[280px] z-10 bg-background": !openOverlay }
        )}
      >
        <header className="flex gap-4 -ml-[5px] pl-8 mt-1">
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
            <IconDoubleChevronBack className="text-gray-200 p-1" />
          </div>
        </header>

        <div className="md:hidden pl-7 py-3 mt-5 border-b border-gray-800">
          <NavOrdinaryLink
            href="#"
            label="Search"
            svg={<IconSearch width="20" />}
            className="py-0"
            onClick={() => {
              toggleSearchSheetOpen && toggleSearchSheetOpen();
            }}
          />
        </div>

        <Navigation />
        <div className="flex-1 flex flex-col justify-end pl-8">
          <LanguageSelectorMobile />
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
