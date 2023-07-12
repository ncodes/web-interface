import { IconSearch } from "./NavSearchBox.tsx";

export function NavSearchButton() {
  return (
    <span className="border border-gray-600 rounded-full p-[7px] [&>svg]:scale-75 hover:border-chinese-green hover:text-chinese-green transition-all duration-500 hover:scale-110">
      <IconSearch className="relative lg:-left-9 lg:top-2 cursor-pointer" />
    </span>
  );
}
