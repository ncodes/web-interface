import { IconSearch } from "./icons/IconSearch.tsx";
import SearchBox from "./SearchBox.tsx";
import { useState } from "react";
export function NavSearchButton() {
  const [open, setOpen] = useState(false);

  return (
    <SearchBox open={open} onOpen={setOpen}>
      <span
        onClick={() => setOpen(!open)}
        className="hidden md:block lg:hidden border border-gray-600 rounded-full p-[7px] hover:border-chinese-green hover:text-chinese-green transition-all duration-500 cursor-pointer hover:scale-110 hover:bg-gray-800"
      >
        <div className="[&>svg]:scale-75 transition-all duration-500 hover:scale-110 w-[25px] h-[25px]">
          <IconSearch
            width="25"
            height="25"
            className="relative lg:-left-9 lg:top-2 cursor-pointer"
          />
        </div>
      </span>
    </SearchBox>
  );
}
