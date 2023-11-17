import { ConnectKitButton } from "connectkit";
import { ConnectedButton } from "./ConnectedButton";

interface ConnectProps {
  show: () => void;
}

function Connect({ show }: ConnectProps) {
  return (
    <button className="not-connected w-full md:w-auto" onClick={show}>
      Connect
    </button>
  );
}

interface ConnectedProps {
  show: () => void;
}

function Connected({ show }: ConnectedProps) {
  return (
    <div>
      <ConnectedButton openWalletModal={show} />
    </div>
  );
}

export function ConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show }) => {
        return (
          <span className="connect-btn">
            {!isConnected ? <Connect show={show as () => void} /> : <Connected show={show as () => void} />}
          </span>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
