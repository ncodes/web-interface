import { Button } from "./ui/Button.tsx";
import { ConnectKitButton } from "connectkit";
import { ConnectedButton } from "../hooks/connectors/components/ConnectedButton.tsx";
import { IconWallet } from "./icons/IconWallet.tsx";

interface ConnectedProps {
  show: () => void;
}

function Connect(props: {
  showIcon?: boolean;
  label?: string;
  show: () => void;
}) {
  return (
    <Button size="full" onClick={props.show} {...props}>
      {props.showIcon && <IconWallet className="mr-3" />}
      {props.label || "Connect Wallet"}
    </Button>
  );
}

function Connected({ show }: ConnectedProps) {
  return (
    <div>
      <ConnectedButton openWalletModal={show} />
    </div>
  );
}

export function ConnectWalletButton(props: {
  showIcon?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <span className={props.className}>
      <ConnectKitButton.Custom>
        {({ isConnected, show }) => {
          return (
            <span className="connect-btn">
              {!isConnected ? (
                <Connect
                  showIcon={props.showIcon}
                  label={props.label}
                  show={show}
                />
              ) : (
                <Connected show={show} />
              )}
            </span>
          );
        }}
      </ConnectKitButton.Custom>
    </span>
  );
}
