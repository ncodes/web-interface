import { shortenAddress } from "../../libs/helpers.ts";
import CopyToClipboard from "react-copy-to-clipboard";
import IconCopyFilled from "../icons/IconCopyFilled.tsx";
import { Globe } from "lucide-react";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import { NavLink } from "react-router-dom";

export function AssetTip(props: { address: string }) {
  const { getChainInfo } = useConnectorContext();

  return (
    <span className="flex gap-3 items-center">
      <span>{shortenAddress(props.address)}</span>
      <div className="flex gap-1 items-center">
        <CopyToClipboard text={props.address}>
          <IconCopyFilled
            width="13px"
            height="13px"
            className="opacity-70 hover:opacity-100 hover:text-chinese-green cursor-pointer transition-all duration-300 active:text-white active:scale-50"
          />
        </CopyToClipboard>
        <NavLink
          target="_blank"
          to={`${getChainInfo().blockExplorer}/address/${props.address}`}
        >
          <Globe
            width="13px"
            className="opacity-70 hover:opacity-100 hover:text-chinese-green cursor-pointer transition-all duration-300 active:text-white active:scale-50"
          />
        </NavLink>
      </div>
    </span>
  );
}
