import { useState } from "react";
import { cn } from "../../libs/utils.ts";
import { SearchInput } from "./SearchInput.tsx";
import SearchBox from "./SearchBox.tsx";

export function InputActivatedSearchBox() {
  const [focus, setFocus] = useState(false);

  return (
    <SearchBox open={focus}>
      <div
        className={cn(
          "hidden lg:flex lg:w-[230px] xl:w-[500px] mt-1 transition-all duration-500 hover:scale-x-105",
          { "scale-x-105": focus }
        )}
      >
        <SearchInput
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          focus={focus}
        />
      </div>
    </SearchBox>
  );
}
