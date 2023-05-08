import { ConnectedButton } from "./ConnectedButton";
import { ConnectKitButton } from "connectkit";

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
      <ConnectedButton openModal={show} />
    </div>
  );
}

export function ConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show }) => {
        return (
          <span className="connect-btn">
            {!isConnected ? <Connect show={show} /> : <Connected show={show} />}
          </span>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
