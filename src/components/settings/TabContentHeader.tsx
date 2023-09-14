import { useToast } from "../../hooks/toast/toast.tsx";
import { shortenAddress } from "../../libs/helpers.ts";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconCopy from "../icons/IconCopy.tsx";

export function TabContentHeader(props: { address: string }) {
  const { simpleSuccess } = useToast();

  return (
    <div className="!select-none text-gray-500 text-[12px] font-light">
      <span className="text-white w-full px-5 py-2 border-b border-gray-800 flex font-light tracking-wider gap-1 items-center">
        <span className="text-chinese-green">Address:</span>
        <span className="flex items-center gap-1">
          {shortenAddress(props.address)}
          <CopyToClipboard
            text={props.address}
            onCopy={() => {
              simpleSuccess("Copied", { position: "top-center" });
            }}
          >
            <IconCopy
              width="15px"
              height="15px"
              className="opacity-50 hover:opacity-100 hover:text-chinese-green cursor-pointer transition-all duration-300 active:text-white active:scale-50"
            />
          </CopyToClipboard>
        </span>
      </span>
    </div>
  );
}
