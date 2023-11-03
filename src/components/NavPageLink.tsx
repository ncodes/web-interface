import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../libs/helpers.ts";

type NavPageLinkProps = {
  iconFile?: string;
  icon?: React.ReactElement;
  iconClassName?: string;
  label: string;
  alt?: string;
  active?: boolean;
  to?: string;
  countBadge?: number;
};

export function NavPageLink(props: NavPageLinkProps) {
  return (
    <Link to={props.to || "#"}>
      <div
        className={cn(
          "flex w-[200px] space-x-3 items-center hover:bg-gray-900 transition-all delay-100 duration-300 hover:cursor-pointer hover:rounded-full p-2 xl:p-3 px-4 pr-8 hover:scale-x-105",
          {
            "font-light text-gray-300 fill-gray-300  hover:text-gray-200":
              !props.active,
            "text-white fill-chinese-green scale-x-105 bg-gray-900 rounded-full":
              props.active,
          }
        )}
      >
        <span
          className={cn(
            "w-[24px] flex justify-center items-center",
            props.iconClassName
          )}
        >
          {!props.icon && (
            <img
              src={`/images/icons/${props.iconFile}`}
              alt={props.alt || props.label}
              className=""
            />
          )}
          {props.icon &&
            React.cloneElement(props.icon, {
              className: cn({
                "text-gray-300": !props.active,
                "text-chinese-green": props.active,
              }),
            })}
        </span>
        <span className={cn("text-[20px] xl:text-[21px] tracking-wide", {})}>
          {props.label}
        </span>
        {props.countBadge != undefined && props.countBadge > 0 && (
          <span className="rounded-full relative top-[1px] h-[20px] min-w-[20px] px-[5px] leading-[20px] flex justify-center items-center  bg-red-600 text-[10px]">
            {props.countBadge}
          </span>
        )}
      </div>
    </Link>
  );
}
