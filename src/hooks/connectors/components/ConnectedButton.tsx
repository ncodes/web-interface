import { useAccount } from "wagmi";
import EmojiAvatar from "../../../components/avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../../../components/avatar/useAvatar";
import { IconSettingsOutline } from "../../../components/icons/IconSettingsOutline.tsx";
import { SettingsSheet } from "../../../components/settings/SettingsSheet.tsx";
import { cn, shortenAddress, shortenAddress2 } from "../../../libs/helpers.ts";
import useStore from "../../store/useStore.ts";
import { useConnectorContext } from "../useConnectorContext.tsx";

export const ConnectedButton = ({
  openWalletModal,
  virtual,
}: {
  openWalletModal?: () => void;
  virtual?: boolean;
}) => {
  const acct = useAccount();
  const connectCtx = useConnectorContext();
  const address = (virtual ? connectCtx.address : acct?.address) || "";

  const toggleOpenState = useStore((state) => state.toggleOpenState);

  return (
    <div>
      <div
        className="flex [&>*]:cursor-pointer justify-between items-center h-[37px]  bg-chinese-green rounded-full hover:shadow-[0px_11px_24px_-6px_rgba(131,164,34,1)] gap-1 pr-1 transition-all duration-500 hover:scale-x-105"
        onClick={() => {
          !virtual && toggleOpenState && toggleOpenState("settingsSheet");
        }}
      >
        <p
          className={cn(
            "hidden lg:flex py-[6px] px-[8px] ml-[4px] text-[#001029] tracking-[0.19px]  rounded-full",
          )}
        >
          <IconSettingsOutline width="17" />
        </p>
        <p
          className={cn(
            "hidden address lg:inline-block font-normal text-[18px] text-black font-jersey20 tracking-wider",
            {
              "!inline pl-3": virtual,
            },
          )}
        >
          {!virtual && (
            <>
              <span className="hidden lg:inline-block">
                {shortenAddress(address as string)}
              </span>
              <span className="lg:hidden">
                {shortenAddress2(address as string)}
              </span>
            </>
          )}

          {virtual && <>{shortenAddress(address as string)}</>}
        </p>

        <div className="pl-1 md:pl-2">
          <EmojiAvatar size={AvatarSize.Small} randomStr={address as string} />
        </div>
      </div>
      <div className="absolute">
        <SettingsSheet openWalletManager={openWalletModal} />
      </div>
    </div>
  );
};
