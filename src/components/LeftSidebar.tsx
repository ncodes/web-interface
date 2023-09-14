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
import { useLockedBody, useMediaQuery } from "usehooks-ts";

function Overlay(props: { open: undefined | boolean; onClick: () => void }) {
  return (
    <div
      className={cn(
        "xl:hidden fixed overflow-hidden w-screen h-screen bg-black/50 left-0 top-0 z-[15] md:z-[20] ",
        { hidden: !props.open }
      )}
      onClick={props.onClick}
    />
  );
}

export function LeftSidebar(props: {
  open: boolean;
  closeRequested: () => void;
  headerHeight: number;
  scrollYPos: number;
}) {
  const isXl = useMediaQuery("(min-width: 1280px)");
  const [openOverlay, setOpenOverlay] = useState(props.open);
  const { toggleOpenState } = useStore((s) => ({
    toggleOpenState: s.toggleOpenState,
  }));
  const [, setLocked] = useLockedBody(false);

  useEffect(() => {
    if (!isXl) setLocked(props.open);
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
          "w-[250px] left-0 flex absolute xl:relative z-[15] md:z-[20] border-r xl:border-r-0 border-gray-800 xl:pl-0 xl:bg-transparent h-screen transition-left duration-150",
          {
            "absolute top-0 -left-[280px] z-[6]  ": !openOverlay,
          }
        )}
      >
        <div className="fixed w-[250px] xl:left-0 flex flex-col flex-1 h-screen bg-background">
          <div className="flex-col py-[28px] pt-[18px] flex-1 flex ">
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
                  toggleOpenState && toggleOpenState("searchSheet");
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
                onClick={() => {
                  toggleOpenState && toggleOpenState("settingsSheet");
                }}
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
      </div>
    </div>
  );
}
