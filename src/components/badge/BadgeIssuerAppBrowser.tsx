import { useConnectorContext } from "@/hooks/connectors/useConnectorContext.tsx";
import { BadgeManifest } from "@/hooks/services/backend/useBadgeService.ts";
import { NewGrantValues } from "@/hooks/services/backend/useInstructionsService.ts";
import useBadgeMgrContract from "@/hooks/services/contracts/useBadgeMgrContract.ts";
import { useToast } from "@/hooks/useToast.tsx";
import IconSpinner from "@/icons/IconSpinner.tsx";
import { delay, isDev } from "@/libs/helpers.ts";
import { useEffect, useRef, useState } from "react";
import { AuthInfo } from "./BadgeSheetContent.tsx";
import { GrantBadgeSignatureMessage } from "./types.ts";

export function BadgeIssuerAppBrowser({
  manifest,
  authInfo,
  badge,
}: {
  badge: string;
  manifest: BadgeManifest | undefined;
  authInfo: AuthInfo;
}) {
  const [loading, setLoading] = useState(true);
  const [loadingLabel, setLoadingLabel] = useState<string>("Loading...");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { address, getChainInfo } = useConnectorContext();
  const { grantNewOrUpsetBadgeMetaBySig, humanizeErrors } =
    useBadgeMgrContract();
  const { notifySuccess, notifyError } = useToast();

  useEffect(() => {
    checkIframeLoaded();
  }, []);

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (
      event: MessageEvent<{ message: string; payload: any }>,
    ) => {
      if (event.origin !== import.meta.env.VITE_BADGE_ISSUER_URL) return;
      if (event.data.message == "call:grantBadgeBySig") {
        execGrantBySig(event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Check if the iframe has loaded
  async function checkIframeLoaded() {
    const { current } = iframeRef;
    if (!current || !current.contentDocument || !current.contentWindow) return;
    const iframeDoc = current.contentDocument || current.contentWindow.document;
    if (iframeDoc.readyState == "complete") return setLoading(false);
    window.setTimeout(checkIframeLoaded, 100);
  }

  /**
   * Request the user to initiate a transaction to call the
   * grantBadgeBySig contract function to claim their badge.
   * @param params The parameters to pass to the contract function.
   * @returns
   */
  async function execGrantBySig(params: GrantBadgeSignatureMessage) {
    try {
      setLoading(true);
      setLoadingLabel(`Claiming '${params.badge}' badge...`);

      const txHash = await grantNewOrUpsetBadgeMetaBySig({
        isNew: true,
        sig: params.signature,
        values: params.values as unknown as NewGrantValues,
      });

      await delay(5000);

      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Successfully claimed ${params.badge}`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });

      // Send a message to the iframe to let it know that the grant was successful
      const message = "success:grantBadgeBySig";
      iframeRef.current?.contentWindow?.postMessage(
        { message, payload: params.badge },
        import.meta.env.VITE_BADGE_ISSUER_URL,
      );
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
      setLoadingLabel("");
    }
  }

  return (
    <div className="w-full h-full justify-center">
      {loading && (
        <div className="w-full  gap-2 h-full flex justify-center relative top-[35%]">
          <span>
            <IconSpinner
              width="20"
              className="animate-spin"
              fill="fill-gray-500"
            />
          </span>
          {loadingLabel && (
            <span className="text-gray-500 font-light text-sm tracking-wider">
              {loadingLabel}
            </span>
          )}
        </div>
      )}

      <iframe
        ref={iframeRef}
        className="w-full h-screen"
        allow="camera; microphone"
        src={`${manifest?.claimPageUrl}/?badge=${badge}&authNetwork=${
          getChainInfo().queryName
        }&authSig=${authInfo.signature}&authMsg=${
          authInfo.message
        }&authTimestamp=${authInfo.timestamp}&authAddress=${address}`}
      />
    </div>
  );
}
