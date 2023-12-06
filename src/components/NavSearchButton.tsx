import useStore from "../hooks/store/useStore.ts";
import { IconSearch } from "./icons/IconSearch.tsx";
export function NavSearchButton() {
  const toggleOpenState = useStore((s) => s.toggleOpenState);

  return (
    <div className="lg:hidden z-20">
      <span
        onClick={() => {
          toggleOpenState && toggleOpenState("searchSheet");
        }}
        className="block border border-gray-600 rounded-full p-[7px] hover:border-chinese-green hover:text-chinese-green transition-all duration-500 cursor-pointer hover:scale-110 hover:bg-gray-800"
      >
        <div className="[&>svg]:scale-75 transition-all duration-500 hover:scale-110 w-[25px] h-[25px]">
          <IconSearch
            width="25"
            height="25"
            className="relative lg:-left-9 lg:top-2 cursor-pointer"
          />
        </div>
      </span>
    </div>
  );
}
