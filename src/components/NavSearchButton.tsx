import { IconSearch } from "./NavSearchBox.tsx";

export function NavSearchButton() {
  return (
    <span className="hidden xs:inline-block md:hidden border border-gray-700 rounded-full p-[7px] [&>svg]:scale-75 hover:border-chinese-green hover:text-chinese-green transition-all duration-300">
      <IconSearch className="relative lg:-left-9 lg:top-2 cursor-pointer" />
    </span>
  );
}
