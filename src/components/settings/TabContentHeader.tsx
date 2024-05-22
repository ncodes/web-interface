import { CopyToClipboard } from "react-copy-to-clipboard";
import { useToast } from "../../hooks/useToast.tsx";
import { shortenAddress } from "../../libs/helpers.ts";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import IconCopy from "../icons/IconCopy.tsx";

export function TabContentHeader(props: { address: string }) {
  const { simpleSuccess } = useToast();

  return (
    <div className="!select-none text-gray-500 text-sm font-light">
      <span className="text-white bg-gradient-to-r from-black to-chinese-green/30 w-full px-3 py-2 border-b border-gray-800 rounded-b-xl border-b-gray-800 flex font-light tracking-wider gap-1 items-center">
        <span className="flex w-full justify-between items-center gap-2">
          <span>
            <EmojiAvatar size={AvatarSize.Small} randomStr={props.address} />
          </span>
          <span className="text-[18px] font-jersey25 tracking-wider">
            {shortenAddress(props.address)}
          </span>
          <span className="flex justify-between items-center">
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
      </span>
    </div>
  );
}
