import { Search } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { isAddress } from "viem";
import { useToast } from "../../hooks/useToast.tsx";
import Input2 from "../Input2.tsx";
import { Button } from "../ui/Button.tsx";

export function PointSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [address, setAddress] = useState("");
  const { simpleError } = useToast();

  function doSearch() {
    if (!address) return;
    if (!isAddress(address)) {
      simpleError("Invalid ethereum address", { position: "top-center" });
      return;
    }

    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("address", address);
    setSearchParams(updatedSearchParams.toString());
  }

  return (
    <div>
      <Input2
        placeholder="Search by address"
        className="h-[25px]"
        containerClassName="mr-1"
        onChange={(e) => setAddress(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter") doSearch();
        }}
        afterInput={
          <Button
            variant="default"
            size="xs"
            className="!h-[25px] mr-1"
            onClick={doSearch}
          >
            <Search size="16" />
          </Button>
        }
      />
    </div>
  );
}
