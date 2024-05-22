import { ConnectKitButton } from "connectkit";
import React from "react";
import { ConnectedButton } from "../hooks/connectors/components/ConnectedButton.tsx";
import { IconWallet } from "./icons/IconWallet.tsx";
import { Button } from "./ui/Button.tsx";

interface ConnectedProps {
  show: () => void;
}

function Connect(props: {
  showIcon?: boolean;
  label?: string;
  show: () => void;
}) {
  return (
    <Button size="full" onClick={props.show}>
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
  children?: React.ReactElement;
  onClick?: () => void;
  onConnect?: () => void;
}) {
  return (
    <span className={props.className}>
      <ConnectKitButton.Custom>
        {({ isConnected, show }) => {
          if (isConnected) {
            props.onConnect?.();
          }

          return (
            <span className="connect-btn">
              {!isConnected ? (
                <>
                  {!props.children ? (
                    <Connect
                      showIcon={props.showIcon}
                      label={props.label}
                      show={() => {
                        show?.();
                      }}
                    />
                  ) : (
                    React.cloneElement(props.children, {
                      onClick: () => {
                        props.onClick?.();
                        show?.();
                      },
                    })
                  )}
                </>
              ) : (
                <Connected
                  show={() => {
                    show?.();
                  }}
                />
              )}
            </span>
          );
        }}
      </ConnectKitButton.Custom>
    </span>
  );
}
