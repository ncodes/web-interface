import { ToolTip } from "../ToolTip.tsx";
import { IconFlagVerified } from "../icons/IconVerifiedBadge.tsx";

export function VerifiedBadge() {
  return (
    <span className="transition-all duration-500 cursor-pointer hover:scale-110 flex items-center">
      <ToolTip tip="This liquidity provider is a registered merchant whose identity has been verified.">
        <IconFlagVerified width="14px" />
      </ToolTip>
    </span>
  );
}
