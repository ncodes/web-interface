import { useState } from "react";
import { cn } from "../../libs/utils.ts";
import SearchBox from "./SearchBox.tsx";
import { SearchInput } from "./SearchInput.tsx";

export function InputActivatedSearchBox() {
  const [focus, setFocus] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <SearchBox open={focus} query={query}>
      <div
        className={cn(
          "relative hidden lg:flex lg:w-[350px] xl:w-[500px] transition-all duration-500 hover:scale-x-105",
          { "scale-x-105": focus },
        )}
      >
        <SearchInput
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          focus={focus}
          onValue={(value) => setQuery(value)}
        />
      </div>
    </SearchBox>
  );
}
