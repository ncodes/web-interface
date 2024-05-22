import {
  BadgeManifest,
  BadgeManifests,
  ChainBadgeManifest,
} from "@jointlabs/chains-info";
import DOMPurify from "dompurify";
import { ChevronRight } from "lucide-react";
import { marked } from "marked";
import { Dispatch, SetStateAction, useState } from "react";
import { ErrorIcon } from "react-hot-toast";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useToast } from "../../hooks/useToast.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";
import { AuthInfo } from "./BadgeSheetContent.tsx";

function findMatchInBadgeManifests(
  netManifests: ChainBadgeManifest,
  badge: string,
) {
  let manifest: BadgeManifest | undefined;
  for (const key in netManifests) {
    if (badge.match(new RegExp(key))) {
      manifest = netManifests[key];
    }
  }
  return manifest;
}

export function BadgeClaimAuthorization({
  badge,
  setAuthInfo,
  setManifest,
}: {
  badge: string;
  setAuthInfo: Dispatch<SetStateAction<AuthInfo>>;
  setManifest: Dispatch<SetStateAction<BadgeManifest | undefined>>;
}) {
  const { sign, ready, getChainInfo } = useConnectorContext();
  const { notifyError } = useToast();
  const [loading, setLoading] = useState(false);

  const manifest = findMatchInBadgeManifests(
    BadgeManifests[getChainInfo().queryName] as ChainBadgeManifest,
    badge,
  );

  function buildSigMsg(
    badge: string,
    issuer: string,
    issuerAddress: string,
    timestamp: string,
  ) {
    return `Authorization to claim "${badge}" badge.

Issuer: ${issuer}
Issuer Address: ${issuerAddress}
Timestamp: ${timestamp}`;
  }

  async function requestAuthorization() {
    if (!manifest) return;
    try {
      setLoading(true);
      const timestamp = new Date().toISOString();
      const message = buildSigMsg(
        badge,
        manifest?.issuer,
        manifest?.issuerAddress,
        timestamp,
      );
      const signature = await sign(message);
      setManifest(manifest);
      setAuthInfo({ message, signature, timestamp });
    } catch (error) {
      notifyError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {!manifest && (
        <div className="flex gap-2 h-full items-center justify-center font-light text-gray-100">
          <span>
            <ErrorIcon />
          </span>
          <span className="relative -top-0.5">
            Badge manifest was not found
          </span>
        </div>
      )}

      {manifest && (
        <div className="flex h-full flex-col text-gray-200">
          <div className="w-full bg-gray-950 flex flex-col border-b border-gray-900 gap-3 justify-center items-center h-[150px]  cover">
            <div className="flex gap-2">
              <span>
                <img src={manifest?.logoUrl} width="50" />
              </span>
              <span className="text-xl text-gray-100">{manifest.name}</span>
            </div>
            <div className="text-center tracking-wider font-light text-xs">
              {manifest.shortDescription}
            </div>
          </div>
          <div className="flex-1 ">
            {manifest.longDescriptions.slice(0, 3).map((desc) => (
              <div
                className="flex gap-3 p-5 pb-2 px-3 pr-5 "
                key={desc.substring(0, 5)}
              >
                <span>
                  <ChevronRight width="20" className="text-gray-400" />
                </span>
                <p
                  className="text-sm transition-all [&>p>a]:text-chinese-green/90 hover:[&>p>a]:text-chinese-green"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked.parse(desc)),
                  }}
                ></p>
              </div>
            ))}
          </div>

          {ready && (
            <div className="p-3 pt-0 border-t border-gray-800">
              <div className="text-center p-3 text-gray-500 font-light text-xs tracking-wide">
                You will be asked to sign a message.
              </div>
              <Button
                variant="default"
                size="full"
                disabled={loading}
                onClick={requestAuthorization}
              >
                {loading && (
                  <IconSpinner
                    width="20"
                    className="animate-spin text-gray-800"
                  />
                )}
                {!loading && <>Proceed</>}
              </Button>
            </div>
          )}

          {!ready && (
            <div className="p-3 border-t border-gray-800">
              <div className="select-none text-center p-3 text-gray-500 font-light text-xs tracking-wide">
                Connect your wallet
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
